from contextlib import asynccontextmanager
from fastapi import FastAPI 
from sqlalchemy import text

from app.db.database import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.media import router as media_router
from app.services.vector_store import (
    create_collection,
    create_user_id_index
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_collection()
        create_user_id_index()
    except Exception as e:
        print(f"Warning: Failed to initialize Qdrant on startup: {e}")
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(media_router)

@app.get("/")
def root():
    return {"message": "API is running"}

@app.post("/test-create-collection")
def test_create_collection():
    create_collection()
    create_user_id_index()

    return {
        "message": "Qdrant collection ready"
    }
    