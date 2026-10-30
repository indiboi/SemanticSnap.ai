from app.db.database import SessionLocal
from app.models.media import Media
from app.services.embedding import generate_image_embedding
from app.services.vector_store import insert_media_embedding


def process_media(media_id: int):

    db = SessionLocal()

    try:
        media = db.query(Media).filter(
            Media.id == media_id
        ).first()

        if not media:
            return

        media.status = "processing"
        db.commit()

        embedding = generate_image_embedding(
            media.file_path
        )

        insert_media_embedding(
            embedding=embedding,
            user_id=media.user_id,
            media_id=media.id,
            media_type=media.media_type
        )

        media.status = "indexed"
        db.commit()

    except Exception as e:
        print(f"Error processing media {media_id}: {e}")
        media = db.query(Media).filter(
            Media.id == media_id
        ).first()

        if media:
            media.status = "failed"
            db.commit()

    finally:
        db.close()