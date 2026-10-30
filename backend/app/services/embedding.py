from pathlib import Path

from google import genai

from app.core.config import settings


client = genai.Client(
    api_key=settings.GOOGLE_API_KEY
)


def generate_text_embedding(
    text: str
) -> list[float]:

    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=text
    )

    return result.embeddings[0].values


def generate_image_embedding(
    file_path: str
) -> list[float]:

    image = client.files.upload(
        file=Path(file_path)
    )

    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=[image]
    )

    return result.embeddings[0].values