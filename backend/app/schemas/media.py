from datetime import datetime

from pydantic import BaseModel


class MediaResponse(BaseModel):
    id: int
    original_name: str
    media_type: str
    file_size: int
    status: str
    created_at: datetime