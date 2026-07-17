from fastapi import FastAPI
from app.database import engine
from app.database import Base
from app.models.user import User
from app.routes.user import router as user_router



app = FastAPI(
    title="Modern Digital Banking API",
    version="1.0.0"
)

# Create tables (safe for development)
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database connected and tables checked")


app.include_router(user_router)


@app.get("/")
def root():
    return {"status": "FastAPI running successfully"}

