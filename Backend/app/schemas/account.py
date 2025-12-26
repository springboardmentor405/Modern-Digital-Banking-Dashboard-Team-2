from pydantic import BaseModel

class AccountCreate(BaseModel):
    account_name: str
    account_type: str
    balance: float
