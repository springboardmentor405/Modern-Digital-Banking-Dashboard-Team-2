from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

# SQLAlchemy Engine
engine = create_engine(
    DATABASE_URL,
    echo=True,          # shows SQL logs (good for development)
    future=True
)

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

# Base class for models
class Base(DeclarativeBase):
    pass

# Dependency for DB session (used in routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
