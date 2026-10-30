from app.db.database import SessionLocal
from app.models.media import Media
from app.services.embedding import generate_image_embedding
from app.services.vector_store import insert_media_embedding


db = SessionLocal()

try:
    media = db.query(Media).first()

    if not media:
        print("No media found in database")
        exit()

    print("Media ID:", media.id)
    print("User ID:", media.user_id)
    print("File:", media.file_path)

    embedding = generate_image_embedding(
        media.file_path
    )

    print("Embedding dimensions:", len(embedding))

    point_id = insert_media_embedding(
        embedding=embedding,
        user_id=media.user_id,
        media_id=media.id,
        media_type=media.media_type
    )

    print("Inserted into Qdrant")
    print("Point ID:", point_id)

finally:
    db.close()