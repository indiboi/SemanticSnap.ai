# SemanticSnap.ai

**SemanticSnap.ai** is a backend API that turns text into semantic snapshots, enabling intelligent search and retrieval based on meaning rather than simple keywords. It combines **FastAPI**, **PostgreSQL**, **Qdrant** (vector database), and **Google Gemini embeddings** to provide a robust semantic search pipeline.

Repository: [https://github.com/indiboi/SemanticSnap.ai](https://github.com/indiboi/SemanticSnap.ai)

---

## Features

- **Embedding generation** – Uses the Google API (Gemini) to convert text into high-quality vector representations.
- **Vector search** – Stores and queries embeddings in Qdrant for fast similarity-based retrieval.
- **Relational data** – Manages metadata, users, or other structured information in PostgreSQL.
- **REST API** – Exposes endpoints for indexing, searching, and managing snapshots via FastAPI.
- **Alembic migrations** – Handles database schema evolution.
- **Test suite** – Includes `test_embedding.py`, `test_pipeline.py`, and `test_search.py` for validating core functionality.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| API framework | FastAPI (Python) |
| Vector database | Qdrant |
| Relational database | PostgreSQL |
| Embeddings | Google Gemini API |
| ORM / Migrations | SQLAlchemy + Alembic |
| Auth | JWT (HS256) |

---

## Prerequisites

- Python 3.10+
- PostgreSQL (local instance)
- Docker (for running Qdrant)
- A Google API key with access to the Gemini embedding model

---

## Environment Variables

Create a `.env` file in the `backend/` directory. It must contain the following keys:

```env
DATABASE_URL: (The local URL)
SECRET_KEY = (Set yourself)
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30

GOOGLE_API_KEY
QDRANT_URL = http://localhost:6333
QDRANT_COLLECTION = semantic_snap
```

> **Note:** For a real `.env` file, use `KEY=value` syntax. The key list above matches the required configuration.

Example valid `.env`:

```env
DATABASE_URL=postgresql://semantic_snap_user:your_password@localhost:5432/semantic_snap
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GOOGLE_API_KEY=your_google_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=semantic_snap
```

- `DATABASE_URL` must point to your local PostgreSQL instance.
- `SECRET_KEY` should be a long, random string.
- `GOOGLE_API_KEY` is required for embedding generation.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/indiboi/SemanticSnap.ai.git
cd SemanticSnap.ai/backend
```

### 2. Set up a Python virtual environment

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Start PostgreSQL and create the database

Make sure PostgreSQL is running locally. Then connect and create the user/database as needed.

Connect to the local database:

```bash
psql -U semantic_snap_user -d semantic_snap -h localhost
```

If creating the user and database from a PostgreSQL superuser account:

```bash
psql -U postgres -c "CREATE USER semantic_snap_user WITH PASSWORD 'your_password';"
psql -U postgres -c "CREATE DATABASE semantic_snap OWNER semantic_snap_user;"
```

### 4. Run Qdrant in Docker

Start a Qdrant container with persistent storage:

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage \
    qdrant/qdrant
```

- `6333` – REST API port
- `6334` – gRPC port
- The volume `qdrant_storage` persists data between restarts.

### 5. Apply database migrations

```bash
alembic upgrade head
```

### 6. Launch the API

```bash
vicorn app.main:app --reload
```

> If your environment does not recognize `vicorn`, use `uvicorn app.main:app --reload` instead.

The API will be available at `http://127.0.0.1:8000`.

Interactive docs: `http://127.0.0.1:8000/docs`

---

## Running Tests

The `backend/` directory contains three test scripts:

```bash
python test_embedding.py
python test_pipeline.py
python test_search.py
```

These validate embedding generation, the overall pipeline, and search functionality.

---

## API Overview (High-Level)

While the exact routes are defined in `app/routes/`, the typical flow includes:

- `POST /snapshots` – Submit photos to be embedded and stored.
- `GET /search` – Perform a semantic search using a query string.
- `GET /snapshots/{id}` – Retrieve a specific snapshot.
- Authentication endpoints (`/token`, `/users`) if JWT is enabled.

Refer to the Swagger UI at `/docs` for the full specification.

---