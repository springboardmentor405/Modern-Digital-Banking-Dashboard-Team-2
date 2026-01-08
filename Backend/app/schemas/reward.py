from pydantic import BaseModel

class RewardOut(BaseModel):
    points: int

    class Config:
        orm_mode = True
