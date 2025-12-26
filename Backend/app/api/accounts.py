from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models import Account
from app.schemas.account import AccountCreate

router = APIRouter(prefix="/accounts", tags=["Accounts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_account(account: AccountCreate, user_id: int, db: Session = Depends(get_db)):
    acc = Account(user_id=user_id, **account.dict())
    db.add(acc)
    db.commit()
    return acc
