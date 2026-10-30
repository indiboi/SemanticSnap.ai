from app.services.embedding import generate_image_embedding


embedding = generate_image_embedding(
    "/home/nichaniboi/documents/github/SemanticSnap/SemanticSnap.ai/backend/storage/users/1/c1582a33-f574-40ee-a58d-8203d68ab18f.png"
)

print("Embedding generated successfully")
print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])