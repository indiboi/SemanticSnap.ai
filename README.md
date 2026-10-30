# SemanticSnap.ai

**SemanticSnap.ai** is an AI-powered multimodal semantic media vault and gallery. It turns photos and media into high-dimensional semantic snapshots, enabling natural language search and retrieval based on visual meaning rather than rigid filenames or manual tags.

Built with a modern **React 19 + Vite** frontend, a high-performance **FastAPI** backend, **PostgreSQL** for relational metadata, **Qdrant** for vector similarity search, and **Google Gemini embeddings**.

Repository: [https://github.com/indiboi/SemanticSnap.ai](https://github.com/indiboi/SemanticSnap.ai)

---

## Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │      React 19 + Vite Frontend         │
                      │  (Tailwind CSS v4 + Framer Motion)    │
                      └──────────────────┬────────────────────┘
                                         │ Axios + JWT
                                         ▼
                      ┌───────────────────────────────────────┐
                      │            FastAPI Backend            │
                      │       (REST API + Background Tasks)   │
                      └─────────┬───────────────────┬─────────┘
                                │                   │
           SQLAlchemy ORM       │                   │ Embeddings & Similarity
                                ▼                   ▼
             ┌─────────────────────────┐     ┌─────────────────────────┐
             │   PostgreSQL Database   │     │      Qdrant Engine      │
             │   (Users, Media, State) │     │  (3,072 D Gemini HNSW)  │
             └─────────────────────────┘     └─────────────────────────┘
                                                    ▲
                                                    │
                                     ┌──────────────┴──────────────┐
                                     │   Google Gemini API (v2)    │
                                     │  Multimodal Embeddings      │
                                     └─────────────────────────────┘
```

---

## Features

### AI & Media Pipeline
- **Multimodal Semantic Search** – Search your media library using everyday descriptive language (e.g., *"sunset at the beach"*, *"dog playing in grass"*).
- **Gemini Embeddings** – Generates high-dimensional (3,072-dimensional) vector representations for images and queries via Google Gemini.
- **Qdrant Vector Database** – Fast similarity search with HNSW indexing and multi-tenant payload filtering keyed by `user_id`.
- **Asynchronous Background Processing** – Uploaded media files are ingested immediately while embedding generation runs asynchronously via FastAPI background tasks.
- **Secure Authenticated Streaming** – Media files are served via protected endpoints verifying user ownership and JWT authorization tokens.

### Frontend & User Experience
- **Modern Landing Page** – Engaging, responsive landing page featuring smooth animations, interactive UI previews, and quick authentication access.
- **Date-Grouped Timeline Gallery** – Chronological photo gallery grouped by upload date (*"Today"*, *"Yesterday"*, *"October 2026"*, etc.) with a toggleable collapsible view.
- **Bulk Selection & Bulk Deletion** – Multi-select photos with batch selection, clear actions, and modal confirmations for bulk cleanup.
- **Advanced Search Filters** – Square icon popover filter right next to the search bar offering:
  - **Date Range Filter** (`Date From` and `Date To`).
  - **File Type Filter** (`All Types`, `JPEG`, `PNG`, `WebP`, `MP4`).
  - Active filter badge indicators and one-click filter reset.
- **Dedicated Profile & Settings Page** (`/profile`) – Manage display names, inspect read-only email identities, view vector storage specs, and terminate active sessions.
- **Global Light / Dark Mode** – Custom CSS variable design system with instant switching accessible from the navigation bar.
- **Media Lightbox Viewer & Metadata Drawer** – Full-screen zoomable media inspector and detailed EXIF/technical metadata panel.
- **Drag-and-Drop Uploader** – Smooth modal with live upload progress tracking and file validation.

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework & Bundler | [React 19](https://react.dev/) + [Vite](https://vite.dev/) |
| Styling & Design System | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables |
| Animations & Transitions | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com/gsap/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| HTTP Client | [Axios](https://axios-http.com/) (with JWT interceptors) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [React Hot Toast](https://react-hot-toast.com/) |

### Backend

| Layer | Technology |
|---|---|
| API Framework | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+) |
| Vector Database | [Qdrant](https://qdrant.tech/) |
| Relational Database | [PostgreSQL](https://www.postgresql.org/) |
| Embeddings Model | [Google Gemini API](https://ai.google.dev/) |
| Database ORM & Migrations | [SQLAlchemy](https://www.sqlalchemy.org/) + [Alembic](https://alembic.sqlalchemy.org/) |
| Authentication & Hashing | JWT (HS256) + Passlib (bcrypt) |

---

## Project Structure

```
SemanticSnap.ai/
├── backend/
│   ├── alembic/                      # Database migration scripts & env
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py             # App settings & environment loader
│   │   │   └── security.py           # JWT creation, token decoding, bcrypt hashing
│   │   ├── db/
│   │   │   └── database.py           # SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   ├── media.py              # Media database model
│   │   │   └── user.py               # User database model
│   │   ├── routes/
│   │   │   ├── auth.py               # Signup, login, profile (/auth/me)
│   │   │   ├── dependencies.py       # Auth guards & get_current_user
│   │   │   └── media.py              # Upload, gallery list, search, file stream, delete
│   │   ├── schemas/
│   │   │   ├── auth.py               # Pydantic schemas for auth & profile updates
│   │   │   └── media.py              # Pydantic schemas for media uploads & responses
│   │   ├── services/
│   │   │   ├── embedding.py          # Google Gemini text & image embedding generator
│   │   │   ├── media.py              # File storage & disk management
│   │   │   ├── processing.py         # Background worker for vector indexing
│   │   │   └── vector_store.py       # Qdrant client, collection creation, search
│   │   └── main.py                   # FastAPI app entry point & lifespan startup hooks
│   ├── test_embedding.py             # Validation script for Gemini embeddings
│   ├── test_pipeline.py              # Full ingestion pipeline test
│   ├── test_search.py                # Semantic search validation
│   ├── requirements.txt              # Backend Python dependencies
│   └── alembic.ini                   # Alembic configuration
│
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js               # Auth API calls (login, signup, getMe, updateProfile)
│   │   │   ├── client.js             # Axios instance with auth header & 401 interceptors
│   │   │   └── media.js              # Media APIs (upload, list, delete, search)
│   │   ├── components/
│   │   │   ├── AuthenticatedImage.jsx# Secure image loader fetching with auth token
│   │   │   ├── ConfirmDialog.jsx     # Reusable confirmation modal for deletion
│   │   │   ├── FilterPopover.jsx     # Date range & file extension filter popup
│   │   │   ├── GalleryGrid.jsx       # Grid view with date grouping & timeline toggles
│   │   │   ├── ImageCard.jsx         # Card thumbnail with status & multi-select actions
│   │   │   ├── ImageViewer.jsx       # Lightbox modal for high-res photo inspection
│   │   │   ├── MetadataPanel.jsx     # Slide-out file details and vector status drawer
│   │   │   ├── Navbar.jsx            # Sticky responsive header, search, theme & user menu
│   │   │   ├── ProtectedRoute.jsx    # React Router navigation guard
│   │   │   └── UploadModal.jsx       # Drag & drop upload modal with progress bars
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User auth state, session persistence, logout
│   │   │   └── ThemeContext.jsx      # Global light/dark theme provider
│   │   ├── pages/
│   │   │   ├── GalleryPage.jsx       # Main media dashboard, bulk operations & search
│   │   │   ├── LandingPage.jsx       # High-converting visual landing page
│   │   │   ├── LoginPage.jsx         # Sign in page
│   │   │   ├── ProfilePage.jsx       # Dedicated account profile & technical preferences
│   │   │   └── SignupPage.jsx        # Account registration page
│   │   ├── App.jsx                   # Route declarations & global toast providers
│   │   ├── index.css                 # Design system tokens, utilities & themes
│   │   └── main.jsx                  # React application entry point
│   ├── package.json                  # Frontend dependencies & scripts
│   └── vite.config.js                # Vite build and plugin configurations
│
└── README.md                         # Project documentation
```

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** & **npm**
- **PostgreSQL** (running locally or remotely)
- **Docker** (for running Qdrant)
- **Google Gemini API Key** (with access to embedding models)

---

## Environment Configuration

### Backend Configuration

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL=postgresql://semantic_snap_user:your_password@localhost:5432/semantic_snap
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GOOGLE_API_KEY=your_gemini_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=semantic_snap
```

- `DATABASE_URL`: Connection string to your PostgreSQL database.
- `SECRET_KEY`: Random 256-bit string used to sign JWT tokens.
- `GOOGLE_API_KEY`: API key obtained from Google AI Studio.
- `QDRANT_URL`: URL to your Qdrant instance (default `http://localhost:6333`).
- `QDRANT_COLLECTION`: Qdrant collection name (`semantic_snap`).

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/indiboi/SemanticSnap.ai.git
cd SemanticSnap.ai
```

---

### 2. Run Qdrant Vector Database

Start a local Qdrant container with persistent volume storage:

```bash
docker run -d -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage \
    --name qdrant_semantic_snap \
    qdrant/qdrant
```

- Web UI & REST API: `http://localhost:6333`
- gRPC API: `http://localhost:6334`

---

### 3. Set Up PostgreSQL

Ensure PostgreSQL is running, then create the user and database:

```bash
psql -U postgres -c "CREATE USER semantic_snap_user WITH PASSWORD 'your_password';"
psql -U postgres -c "CREATE DATABASE semantic_snap OWNER semantic_snap_user;"
```

---

### 4. Set Up & Run the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   
   # On Linux/macOS:
   source .venv/bin/activate
   
   # On Windows (PowerShell):
   .venv\Scripts\Activate.ps1
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

### 5. Set Up & Run the Frontend

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the web app in your browser:
   ```
   http://localhost:5173
   ```

To build for production:
```bash
npm run build
npm run preview
```

---

## API Endpoints Reference

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `POST` | `/auth/signup` | Register a new user account | No |
| `POST` | `/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/auth/me` | Fetch authenticated user information | Yes |
| `PUT` | `/auth/me` | Update user display name | Yes |

### Media & Search Routes (`/media`)

| Method | Endpoint | Description | Protected |
|---|---|---|:---:|
| `POST` | `/media/upload` | Upload media file (image/video, up to 100MB) | Yes |
| `GET` | `/media/` | List all media files for authenticated user | Yes |
| `GET` | `/media/search?q={query}` | Perform semantic search on user media vault | Yes |
| `GET` | `/media/{id}` | Retrieve metadata for specific media file | Yes |
| `GET` | `/media/{id}/file` | Stream media content (authenticated file response) | Yes |
| `DELETE` | `/media/{id}` | Permanently delete media file & vector record | Yes |

---

## Running Backend Tests

The `backend/` directory provides validation test scripts for rapid verification:

```bash
cd backend

# Validate Gemini embedding generation
python test_embedding.py

# Validate Qdrant collection and vector search
python test_search.py

# Validate end-to-end ingestion pipeline
python test_pipeline.py
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).