from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Reward

router = APIRouter(prefix="/rewards", tags=["Rewards"])

@router.get("/")
def get_rewards(db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.user_id == 1).first()

    if not reward:
        reward = Reward(user_id=1, points=0)
        db.add(reward)
        db.commit()
        db.refresh(reward)

    return {"points": reward.points}
