from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
import shutil
import tempfile
from datetime import datetime, timedelta
import asyncio
from concurrent.futures import ThreadPoolExecutor

from langchain.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import OllamaLLM
from langchain.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate

import re

app = FastAPI(title="Study Tutor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "llama3"
EMBED_MODEL = 'nomic-embed-text'
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
TOP_K = 3


sessions = {}
SESSION_TIMEOUT = timedelta(hours=2)

executor = ThreadPoolExecutor(max_workers=4)

class QuestionRequest(BaseModel):
    question: str

class SessionInfo(BaseModel):
    session_id: str
    created_at: datetime
    last_accessed: datetime
    file_count: int
    file_names: List[str]

def cleanup_expired_sessions():
    """Clean up expired sessions"""
    current_time = datetime.now()
    expired_sessions = []
    
    for session_id, session_data in sessions.items():
        if current_time - session_data['last_accessed'] > SESSION_TIMEOUT:
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        if 'temp_dir' in sessions[session_id]:
            temp_dir = sessions[session_id]['temp_dir']
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
        del sessions[session_id]



def process_pdfs_sync(uploaded_files: List[UploadFile], session_id: str):
    """Synchronous PDF processing function"""
    session_temp_dir = os.path.join(tempfile.gettempdir(), f"study_tutor_{session_id}")
    if os.path.exists(session_temp_dir):
        shutil.rmtree(session_temp_dir)
    os.makedirs(session_temp_dir, exist_ok=True)

    pdf_paths = []
    file_names = []
    
    for pdf in uploaded_files:
        file_names.append(pdf.filename)
        path = os.path.join(session_temp_dir, pdf.filename)
        with open(path, "wb") as f:
            f.write(pdf.file.read())
        pdf_paths.append(path)

    docs = []
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        add_start_index=True
    )
    
    for path in pdf_paths:
        loader = PyPDFLoader(path)
        pages = loader.load()
        text = "\n".join(p.page_content for p in pages)
        
        text = re.sub(r"\n\s*\n", "\n\n", text)
        docs.append(Document(page_content=text, metadata={"source": os.path.basename(path)}))
    
    chunks = splitter.split_documents(docs)

    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    
    collection_name = f"study_docs_{session_id.replace('-', '_')}"
    
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=os.path.join(session_temp_dir, "chroma")
    )
    
    return vectordb, file_names, session_temp_dir

def answer_query_sync(vectordb, question: str, top_k: int = TOP_K):
    """Synchronous query answering function"""
    results = vectordb.similarity_search_with_score(question, k=top_k)
    docs = [doc for doc, _ in results]

    context = "\n\n---\n\n".join(
        f"Source: {doc.metadata.get('source')}\n{doc.page_content.strip()}"
        for doc in docs
    )



    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are a highly effective tutor for students studying topics.

You have access to the following **study materials**:

{context}

When answering, do the following:
1. Understand the question.
2. Use **only** the information in the context—do not hallucinate.
3. Whenever you refer to learned content, include the **source filename** in parentheses (e.g. "...as shown in M1.md").
4. Provide a **step-by-step explanation** that helps students understand the reasoning.
5. **Explain** clearly (use bullet-points, examples, analogies).
6. **Plan** your answer briefly (e.g., "I'll explain X, then compare features.").
7. **Conclude** with a summary.
8. If the answer is incomplete or unclear, say:
   *"I'm not sure — I'd need to review more materials."*
---

**Question:**  
{question}

---

**Answer (as tutor):**
"""
    )
    
    llm = OllamaLLM(model=MODEL_NAME)
    message = prompt.format_prompt(
        context=context, 
        question=question
    ).to_string()
    
    response = llm.invoke([{"role": "user", "content": message}])
    
    return response, [doc.metadata.get('source') for doc in docs]

@app.post("/upload-pdfs/{session_id}")
async def upload_pdfs(
    session_id: str,
    files: List[UploadFile] = File(...)
):
    """Upload PDFs and create RAG system for a session"""
    cleanup_expired_sessions()
    
    for file in files:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
    
    try:
        loop = asyncio.get_event_loop()
        vectordb, file_names, temp_dir = await loop.run_in_executor(
            executor, process_pdfs_sync, files, session_id
        )
        
        current_time = datetime.now()
        sessions[session_id] = {
            'vectordb': vectordb,
            'created_at': current_time,
            'last_accessed': current_time,
            'file_names': file_names,
            'temp_dir': temp_dir
        }
        
        return JSONResponse({
            "message": "PDFs processed successfully",
            "session_id": session_id,
            "file_count": len(file_names),
            "file_names": file_names
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDFs: {str(e)}")

@app.post("/ask/{session_id}")
async def ask_question(
    session_id: str,
    question_request: QuestionRequest
):
    """Answer questions using the RAG system with memory for a session"""
    cleanup_expired_sessions()
    
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = sessions[session_id]
    session_data['last_accessed'] = datetime.now()
    
    try:
        loop = asyncio.get_event_loop()
        answer, sources = await loop.run_in_executor(
            executor, 
            answer_query_sync, 
            session_data['vectordb'], 
            question_request.question
        )
        
        return {
            "question": question_request.question,
            "answer": answer,
            "sources": sources,
            "session_id": session_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """Get session information"""
    cleanup_expired_sessions()
    
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = sessions[session_id]
    session_data['last_accessed'] = datetime.now()
    
    return SessionInfo(
        session_id=session_id,
        created_at=session_data['created_at'],
        last_accessed=session_data['last_accessed'],
        file_count=len(session_data['file_names']),
        file_names=session_data['file_names']
    )



@app.get("/generate-session")
async def generate_session():
    """Generate a new session ID"""
    return {"session_id": str(uuid.uuid4())}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Study Tutor API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
