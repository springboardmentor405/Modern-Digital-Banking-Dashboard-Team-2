from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta


from app.db.session import get_db
from app.db.models import Bill
from app.schemas.bill import BillCreate, BillUpdate
from app.db.models import Reward


# ✅ router MUST be defined BEFORE using it
router = APIRouter(prefix="/bills", tags=["Bills"])


@router.get("/")
def get_bills(db: Session = Depends(get_db)):
    return db.query(Bill).all()


@router.post("/")
def create_bill(bill: BillCreate, db: Session = Depends(get_db)):
    new_bill = Bill(**bill.dict())
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return new_bill


@router.patch("/{bill_id}/mark-paid")
def mark_bill_paid(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if not bill.due_date:
        raise HTTPException(status_code=400, detail="Bill has no due date")

    # 🔁 Recurring logic
    if bill.frequency == "Monthly":
        bill.due_date = bill.due_date + timedelta(days=30)
        bill.is_paid = False

    elif bill.frequency == "Yearly":
        bill.due_date = bill.due_date + timedelta(days=365)
        bill.is_paid = False

    else:  # One-time bill
        bill.is_paid = True

    # 🎁 Rewards logic (THIS PART YOU ASKED ABOUT)
    reward = db.query(Reward).filter(Reward.user_id == 1).first()
    if not reward:
        reward = Reward(user_id=1, points=0)
        db.add(reward)

    reward.points += 10  # add 10 points per paid bill

    # ✅ Commit ONCE at the end
    db.commit()
    db.refresh(bill)

    return {"message": "Bill marked as paid"}


@router.delete("/{bill_id}")
def delete_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted"}


# ✅ THIS IS THE UPDATE ROUTE (ADD THIS AT THE END)
@router.put("/{bill_id}")
def update_bill(bill_id: int, bill_data: BillUpdate, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    bill.title = bill_data.title
    bill.amount = bill_data.amount
    bill.due_date = bill_data.due_date  # 🔴 THIS LINE MUST EXIST
    bill.category = bill_data.category
    bill.frequency = bill_data.frequency
    bill.reminder = bill_data.reminder

    db.commit()
    db.refresh(bill)

    return bill

