# Study Tutor: Retrieval-Augmented Generation (RAG) for Educational Materials

## Overview

The **Study Tutor** is an interactive tool designed to assist students by answering questions based on uploaded PDF study materials. It leverages a Retrieval-Augmented Generation (RAG) pipeline, combining document retrieval with natural language generation. The project includes:
- A **Streamlit web application** (`app.py`) for uploading PDFs and asking questions via a user-friendly interface.
- A **Jupyter Notebook** (`rag.ipynb`) demonstrating the RAG pipeline, including PDF processing, embedding, and question answering.

The system uses **LangChain** for document handling, **Chroma** for vector storage, and the **Ollama** language model (`llama3`) to process PDFs, store embeddings, and generate detailed responses.

## Features

- **PDF Upload and Processing**: Upload PDFs, which are converted into text and split into chunks for efficient retrieval.
- **Vector Storage**: Stores document embeddings in a Chroma vector database for fast similarity search.
- **Question Answering**: Provides detailed, step-by-step answers using retrieved document chunks and the `llama3` model.
- **Interactive Interface**: Streamlit app for easy PDF uploads and question submission.
- **Source Attribution**: Answers include references to the source PDF filenames.

## Directory Structure

- **`chroma/`**: Stores the Chroma vector database.
  - `chroma.sqlite3`: SQLite file for embeddings and metadata.
- **`loaded-materials/`**: Contains Markdown files generated from PDFs (e.g., `M1.md`, `M2.md`, `M4.md`, `M5.md`).
- **`study-materials/`**: Holds input PDF files (e.g., `M1.pdf`, `M2.pdf`, `M4.pdf`, `M5.pdf`).
- **`.gitignore`**: Specifies files/folders to ignore in Git (e.g., `chroma/`).
- **`app.py`**: Streamlit app for the Study Tutor interface.
- **`rag.ipynb`**: Jupyter Notebook demonstrating the RAG pipeline.
- **`requirements.txt`**: Lists Python dependencies.

## Prerequisites

- **Python 3.8+**
- **Ollama**: Installed and running with `llama3` and `nomic-embed-text` models pulled ([Ollama setup guide](https://ollama.ai/)).
- Dependencies listed in `requirements.txt`.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/study-tutor.git
   cd study-tutor
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Up Ollama**:
   - Install Ollama and pull required models:
     ```bash
     ollama pull llama3
     ollama pull nomic-embed-text
     ```

4. **Add Study Materials**:
   - Place PDF files in the `study-materials/` directory.

5. **Run the Streamlit App**:
   ```bash
   streamlit run app.py
   ```
   - Visit `http://localhost:8501` to upload PDFs and ask questions.

6. **Explore the Notebook**:
   ```bash
   jupyter notebook rag.ipynb
   ```
   - Run cells to process PDFs and test the RAG pipeline.

## Usage

### Streamlit App (`app.py`)
1. Launch with `streamlit run app.py`.
2. Upload PDFs using the interface.
3. Enter a question and click "Get Answer" for a detailed response.

### Jupyter Notebook (`rag.ipynb`)
1. Open in Jupyter and run cells to:
   - Load PDFs from `study-materials/`.
   - Generate Markdown files in `loaded-materials/`.
   - Embed chunks in Chroma and query the system.
2. Modify the `question` variable to test different queries.

## Example Questions

- "Differentiate between flat plate collectors and solar concentrators."
- "What are the factors that affect biogas generation?"
- "Discuss the effect of temperature and insolation on solar cell characteristics."

## Dependencies

- `streamlit`
- `langchain`
- `langchain-community`
- `langchain-ollama`
- `chromadb`
- `pypdf`

Install with:
```bash
pip install -r requirements.txt
```

## Configuration

Edit these constants in `app.py`:
- `MODEL_NAME = "llama3"`: Language model for answers.
- `EMBED_MODEL = "nomic-embed-text"`: Embedding model.
- `CHUNK_SIZE = 1000`: Text chunk size (characters).
- `CHUNK_OVERLAP = 200`: Chunk overlap (characters).
- `TOP_K = 3`: Number of retrieved chunks per query.

## Limitations

- Supports only PDF inputs.
- Missing PDFs (e.g., `M3.pdf`) are skipped.
- Answer quality depends on PDF content and model performance.
- Large PDFs may slow processing.

## Future Improvements

- Support additional file formats (e.g., Word, text).
- Add caching for faster queries.
- Enable customizable prompts in the UI.
- Improve error handling for file issues.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a clear description.

## License

MIT License (see [LICENSE](LICENSE)).

## Contact

Open a GitHub issue or contact the repository owner for support.