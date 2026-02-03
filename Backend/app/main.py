from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import transactions
from app.api import auth, accounts
from app.api import budgets
from app.api import bills
from app.routers import bills
from app.routers import bills, rewards
from app.routers import currency
from app.routers.insights import router as insights_router
from app.routers import insights

from app.routers.transactions import router as transactions_router

from app.routers.users import router as users_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ CORS configuration (for frontend ↔ backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React (CRA)
        "http://localhost:5173"   # React (Vite)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(bills.router)
app.include_router(rewards.router)
app.include_router(currency.router)
app.include_router(insights.router)
app.include_router(transactions_router)
app.include_router(users_router)



# ✅ Health check
@app.get("/")
def root():
    return {"status": "Backend running"}
