from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Reward

router = APIRouter(prefix="/rewards", tags=["Rewards"])

# 🔹 Get current reward points
@router.get("/")
def get_rewards(db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.user_id == 1).first()

    if not reward:
        reward = Reward(user_id=1, points=0)
        db.add(reward)
        db.commit()
        db.refresh(reward)

    return {"points": reward.points}


# 🔹 Add reward points (called when bill is paid)
@router.post("/add")
def add_rewards(points: int = 10, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.user_id == 1).first()

    if not reward:
        reward = Reward(user_id=1, points=0)
        db.add(reward)

    reward.points += points
    db.commit()
    db.refresh(reward)

    return {
        "message": "Reward points added",
        "points": reward.points
    }