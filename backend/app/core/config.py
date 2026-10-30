from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GOOGLE_API_KEY: str

    QDRANT_URL: str
    QDRANT_COLLECTION: str = "semantic_snap"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()