from app.services.embedding import generate_text_embedding
from app.services.vector_store import search_media


query = "a photo of a person"

embedding = generate_text_embedding(query)

print("Query embedding dimensions:", len(embedding))

results = search_media(
    query_embedding=embedding,
    user_id=1,
    limit=10
)

print("\nResults:")

for result in results:
    print(
        "Media ID:",
        result.payload["media_id"],
        "| Score:",
        result.score,
        "| User ID:",
        result.payload["user_id"]
    )