from uuid import uuid4

from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams
)

from app.core.config import settings
from app.services.qdrant import client


VECTOR_SIZE = 3072

def create_user_id_index():
    client.create_payload_index(
        collection_name=settings.QDRANT_COLLECTION,
        field_name="user_id",
        field_schema="integer"
    )

def create_collection():
    collections = client.get_collections()

    existing_collections = [
        collection.name
        for collection in collections.collections
    ]

    if settings.QDRANT_COLLECTION in existing_collections:
        return

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE
        )
    )


def insert_media_embedding(
    embedding: list[float],
    user_id: int,
    media_id: int,
    media_type: str
):
    point_id = str(uuid4())

    client.upsert(
        collection_name=settings.QDRANT_COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "user_id": user_id,
                    "media_id": media_id,
                    "media_type": media_type
                }
            )
        ]
    )

    return point_id

def search_media(
    query_embedding: list[float],
    user_id: int,
    limit: int = 20
):
    results = client.query_points(
        collection_name=settings.QDRANT_COLLECTION,
        query=query_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(
                        value=user_id
                    )
                )
            ]
        ),
        limit=limit
    )

    return results.points