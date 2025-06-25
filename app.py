import streamlit as st
from langchain.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_community.llms import Ollama
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
import re
import os
import shutil
import tempfile

MODEL_NAME = "llama3"
EMBED_MODEL = 'nomic-embed-text'
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
TOP_K = 3

def process_pdfs(uploaded_files):
    pdf_dir = os.path.join(tempfile.gettempdir(), "uploaded_pdfs")
    if os.path.exists(pdf_dir):
        shutil.rmtree(pdf_dir)
    os.makedirs(pdf_dir, exist_ok=True)

    pdf_paths = []
    for pdf in uploaded_files:
        path = os.path.join(pdf_dir, pdf.name)
        with open(path, "wb") as f:
            f.write(pdf.read())
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

    embeddings = OllamaEmbeddings(model = EMBED_MODEL)
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="study-docs"
    )
    return vectordb


def answer_query(vectordb, question: str, top_k: int = TOP_K):
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
3. Whenever you refer to learned content, include the **source filename** in parentheses (e.g. “...as shown in M1.md”).
4. Provide a **step-by-step explanation** that helps students understand the reasoning.
5. **Explain** clearly (use bullet-points, examples, analogies).
6. **Plan** your answer briefly (e.g., “I'll explain X, then compare features.”).
7. **Conclude** with a summary.
8. If the answer is incomplete or unclear, say:
   *“I'm not sure — I'd need to review more materials.”*
---

**Question:**  
{question}

---

**Answer (as tutor):**
"""
    )
    llm = Ollama(model=MODEL_NAME)
    message = prompt.format_prompt(context=context, question=question).to_string()
    response = llm.invoke([{"role": "user", "content": message}])
    return response

st.title("Study Tutor")
st.write("Upload course PDFs and ask any question based on them.")

uploaded_docs = st.file_uploader(
    "Upload PDF files", type=["pdf"], accept_multiple_files=True
)

if uploaded_docs:
    with st.spinner("Processing documents..."):
        vectordb = process_pdfs(uploaded_docs)
    st.success("Documents processed! You can now ask questions.")

question = st.text_input("Your Question:")
if st.button("Get Answer") and question:
    if 'vectordb' in locals():
        with st.spinner("Thinking..."):
            answer = answer_query(vectordb, question)
        st.subheader("Answer")
        st.write(answer)
    else:
        st.error("Please upload PDFs first.")
