from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Database URL from .env
DATABASE_URL = os.getenv("postgresql://postgres:Anita4952@localhost:5432/Banking_DB")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True  # set False in production
)

# Create session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
