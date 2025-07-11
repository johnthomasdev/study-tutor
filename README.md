# Study Tutor: AI-Powered Educational Assistant

## Overview

**Study Tutor** is a full-stack AI-powered educational assistant that helps students learn by answering questions based on uploaded PDF study materials. The system uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers with conversation memory.

### Architecture

- **Backend**: FastAPI application (`app.py`) providing RESTful API endpoints
- **Frontend**: React application (`study-tutor/`) with modern UI built using Vite and Tailwind CSS
- **AI Core**: RAG pipeline using LangChain, Chroma vector database, and Ollama language models
- **Session Management**: Multi-user support with conversation memory and session isolation

## Features

- **📁 PDF Upload & Processing**: Upload multiple PDFs, automatically processed and indexed
- **🧠 AI Question Answering**: Powered by Ollama's `llama3` model with RAG architecture
- **🔄 Session Management**: Multi-user support with isolated sessions and document storage
- **📱 Modern UI**: Responsive React frontend with file drag-and-drop
- **🔍 Source Attribution**: Answers include references to source documents
- **⚡ Real-time Processing**: Async processing with progress feedback

## Tech Stack

### Backend
- **FastAPI**: High-performance API framework
- **LangChain**: Document processing and RAG pipeline
- **Chroma**: Vector database for embeddings
- **Ollama**: Local AI model inference
- **Python 3.8+**: Core runtime

### Frontend
- **React 19**: Modern UI framework
- **Vite**: Fast build tooling
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Axios**: API communication

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and **npm** installed
3. **Ollama** installed and running with required models:
   ```bash
   # Install Ollama first: https://ollama.ai/
   ollama pull llama3
   ollama pull nomic-embed-text
   ```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd study-tutor
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd study-tutor

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Verify Ollama Models

Ensure both models are available:
```bash
ollama list
# Should show: llama3, nomic-embed-text
```

## Usage

### Quick Start
1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Upload PDF files using the file upload interface
4. Ask questions about your study materials
5. Get AI-powered answers with source references

### API Endpoints

- `POST /upload-pdfs/{session_id}` - Upload PDFs for processing
- `POST /ask/{session_id}` - Ask questions about uploaded materials
- `GET /session/{session_id}` - Get session information
- `GET /generate-session` - Generate new session ID
- `GET /health` - Health check

## Project Structure

```
ktu/
├── app.py                 # FastAPI backend application
├── requirements.txt       # Python dependencies
├── rag.ipynb             # Jupyter notebook for RAG experiments
├── README.md             # This file
└── study-tutor/          # React frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── hooks/        # Custom hooks
    │   ├── utils/        # Utility functions
    │   └── App.jsx       # Main application
    ├── package.json      # Node.js dependencies
    └── vite.config.js    # Vite configuration
```

## Configuration

### Backend Configuration (app.py)
```python
MODEL_NAME = "llama3"              # Ollama model for responses
EMBED_MODEL = "nomic-embed-text"   # Embedding model
CHUNK_SIZE = 1000                  # Document chunk size
CHUNK_OVERLAP = 200                # Chunk overlap
TOP_K = 3                          # Retrieved documents per query
```

### Frontend Configuration
- **API Base URL**: Configured in `src/utils/api.js`
- **Styling**: Tailwind CSS configuration in `tailwind.config.js`
- **Build**: Vite configuration in `vite.config.js`

## Development

### Running in Development Mode

**Backend (with auto-reload)**:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (with hot reload)**:
```bash
cd study-tutor
npm run dev
```

### Building for Production

**Frontend**:
```bash
cd study-tutor
npm run build
```

**Backend**: Deploy using your preferred method (Docker, systemd, etc.)

## Session Management

- **Session Isolation**: Each user session has isolated document storage and processing
- **Automatic Cleanup**: Expired sessions are automatically cleaned up
- **Session Timeout**: 2-hour timeout for inactive sessions
