from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import Bill
from app.schemas.bill import BillCreate, BillOut

router = APIRouter(
    prefix="/bills",
    tags=["Bills"]
)

# CREATE BILL
@router.post("/", response_model=BillOut)
def create_bill(payload: BillCreate, db: Session = Depends(get_db)):
    bill = Bill(**payload.dict())
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill

# GET ALL BILLS
@router.get("/", response_model=List[BillOut])
def get_bills(db: Session = Depends(get_db)):
    return db.query(Bill).order_by(Bill.due_date).all()

# MARK BILL AS PAID
@router.patch("/{bill_id}/mark-paid")
def mark_bill_paid(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    bill.is_paid = True
    db.commit()
    return {"message": "Bill marked as paid"}

# DELETE BILL
@router.delete("/{bill_id}")
def delete_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted"}

from datetime import date, timedelta

@router.get("/reminders")
def get_bill_reminders(db: Session = Depends(get_db)):
    today = date.today()
    soon_limit = today + timedelta(days=3)

    overdue = db.query(Bill).filter(
        Bill.is_paid == False,
        Bill.due_date < today
    ).all()

    due_soon = db.query(Bill).filter(
        Bill.is_paid == False,
        Bill.due_date >= today,
        Bill.due_date <= soon_limit
    ).all()

    return {
        "overdue": overdue,
        "due_soon": due_soon
    }
