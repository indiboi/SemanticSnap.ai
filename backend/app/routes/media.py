from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Query, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from pathlib import Path

from app.db.database import get_db
from app.models.media import Media
from app.models.user import User
from app.routes.dependencies import get_current_user
from app.services.media import save_file
from app.services.embedding import generate_text_embedding, generate_image_embedding
from app.services.vector_store import search_media, insert_media_embedding
from app.services.processing import process_media


router = APIRouter(
    prefix="/media",
    tags=["Media"]
)

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska"
}


MAX_FILE_SIZE = 100 * 1024 * 1024 

@router.post("/upload")
async def upload_media(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided"
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}"
        )

    try:
        stored_name, file_path, file_size = await save_file(
            user_id=current_user.id,
            file=file
        )

    except ValueError:
        raise HTTPException(
            status_code=413,
            detail=f"{file.filename} exceeds the 100 MB limit"
        )

    media = Media(
        user_id=current_user.id,
        original_name=file.filename,
        stored_name=stored_name,
        file_path=file_path,
        media_type=file.content_type,
        file_size=file_size,
        status="pending"
    )

    db.add(media)
    db.commit()
    db.refresh(media)

    background_tasks.add_task(
        process_media,
        media.id
    )

    return {
        "message": "File uploaded successfully",
        "file": {
            "id": media.id,
            "original_name": media.original_name,
            "media_type": media.media_type,
            "file_size": media.file_size,
            "status": media.status,
            "created_at": media.created_at
        }
    }


@router.get("/")
def get_user_media(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    media_files = db.query(Media).filter(
        Media.user_id == current_user.id
    ).all()

    return {
        "files": [
            {
                "id": media.id,
                "original_name": media.original_name,
                "media_type": media.media_type,
                "file_size": media.file_size,
                "created_at": media.created_at
            }
            for media in media_files
        ]
    }

@router.get("/search")
def semantic_search(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_embedding = generate_text_embedding(q)

    results = search_media(
        query_embedding=query_embedding,
        user_id=current_user.id,
        limit=3
    )

    media_ids = [
        result.payload["media_id"]
        for result in results
    ]

    if not media_ids:
        return []

    media_items = db.query(Media).filter(
        Media.id.in_(media_ids),
        Media.user_id == current_user.id
    ).all()

    media_map = {
        media.id: media
        for media in media_items
    }

    response = []

    for result in results:
        media_id = result.payload["media_id"]

        media = media_map.get(media_id)

        if not media:
            continue

        response.append({
            "id": media.id,
            "original_name": media.original_name,
            "media_type": media.media_type,
            "file_size": media.file_size,
            "created_at": media.created_at,
            "score": result.score
        })

    return response


@router.get("/{media_id}")
def get_media(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    media = db.query(Media).filter(
        Media.id == media_id,
        Media.user_id == current_user.id
    ).first()

    if not media:
        raise HTTPException(
            status_code=404,
            detail="Media not found"
        )

    return {
        "id": media.id,
        "original_name": media.original_name,
        "media_type": media.media_type,
        "file_size": media.file_size,
        "created_at": media.created_at
    }

@router.get("/{media_id}/file")
def get_media_file(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    media = db.query(Media).filter(
        Media.id == media_id,
        Media.user_id == current_user.id
    ).first()

    if not media:
        raise HTTPException(
            status_code=404,
            detail="Media not found"
        )

    file_path = Path(media.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found on server"
        )

    return FileResponse(
        path=file_path,
        media_type=media.media_type,
        filename=media.original_name
    )


@router.delete("/{media_id}")
def delete_media(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    media = db.query(Media).filter(
        Media.id == media_id,
        Media.user_id == current_user.id
    ).first()

    if not media:
        raise HTTPException(
            status_code=404,
            detail="Media not found"
        )

    file_path = Path(media.file_path)

    if file_path.exists():
        file_path.unlink()

    db.delete(media)
    db.commit()

    return {
        "message": "Media deleted successfully",
        "id": media_id
    }


