from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile

STORAGE_DIR = Path("storage/users")
CHUNK_SIZE = 1024 * 1024
MAX_FILE_SIZE = 100 * 1024 * 1024

async def save_file(
    user_id: int,
    file: UploadFile
) -> tuple[str, str, int]:

    user_directory = STORAGE_DIR / str(user_id)
    user_directory.mkdir(
        parents=True,
        exist_ok=True
    )

    extension = Path(file.filename).suffix.lower()

    stored_name = f"{uuid4()}{extension}"

    file_path = user_directory / stored_name

    file_size = 0

    try:
        with file_path.open("wb") as output_file:

            while chunk := await file.read(CHUNK_SIZE):

                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    raise ValueError("File too large")

                output_file.write(chunk)

    except Exception:
        if file_path.exists():
            file_path.unlink()

        raise

    return stored_name, str(file_path), file_size