from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta, date

from app.db.session import get_db
from app.db.models import Transaction
from fastapi import Query

router = APIRouter(prefix="/insights", tags=["Insights"])


# ===============================
# SUMMARY
# ===============================
@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    income = db.query(func.sum(Transaction.amount)) \
        .filter(Transaction.type == "Income") \
        .scalar() or 0

    expense = db.query(func.sum(Transaction.amount)) \
        .filter(Transaction.type == "Expense") \
        .scalar() or 0

    return {
        "total_income": income,
        "total_expense": abs(expense)
    }


# ===============================
# CATEGORY WISE EXPENSES
# ===============================
@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    results = db.query(
        Transaction.category,
        func.sum(Transaction.amount)
    ).filter(
        Transaction.type == "Expense"
    ).group_by(
        Transaction.category
    ).all()

    return [
        {
            "category": r[0],
            "amount": abs(float(r[1]))
        }
        for r in results
    ]


# ===============================
# FINANCIAL METRICS (CARDS)
# ===============================
@router.get("/financial-metrics")
def financial_metrics(db: Session = Depends(get_db)):
    income = db.query(func.sum(Transaction.amount)) \
        .filter(Transaction.type == "Income") \
        .scalar() or 0

    expense = abs(
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.type == "Expense")
        .scalar() or 0
    )

    net = income - expense
    daily_burn = expense / 30 if expense else 0
    savings_rate = round((net / income) * 100, 2) if income else 0

    runway = "∞" if net > 0 else "0"

    return {
        "net_cash_flow": round(net, 2),
        "daily_burn_rate": round(daily_burn, 2),
        "savings_rate": savings_rate,
        "financial_runway": runway
    }


# ===============================
# CASH FLOW CHART
# ===============================
@router.get("/cash-flow")
def cash_flow(
    days: int = Query(30, enum=[30, 60, 90]),
    db: Session = Depends(get_db),
):
    today = date.today()
    start_date = today - timedelta(days=days - 1)

    # 1️⃣ Create continuous date range
    days_map = {}
    for i in range(days):
        d = start_date + timedelta(days=i)
        days_map[d.isoformat()] = {
            "date": d.isoformat(),
            "income": 0,
            "expense": 0,
            "net": 0,
        }

    # 2️⃣ Fetch DB data
    results = (
        db.query(
            func.date(Transaction.date).label("day"),
            func.sum(
                case((Transaction.type == "Income", Transaction.amount), else_=0)
            ).label("income"),
            func.sum(
                case((Transaction.type == "Expense", Transaction.amount), else_=0)
            ).label("expense"),
        )
        .filter(Transaction.date >= start_date)
        .group_by(func.date(Transaction.date))
        .all()
    )

    # 3️⃣ Merge real values
    for r in results:
        key = r.day.isoformat()
        income = float(r.income or 0)
        expense = float(r.expense or 0)

        days_map[key]["income"] = income
        days_map[key]["expense"] = expense
        days_map[key]["net"] = income - expense

    return list(days_map.values())

# ===============================
# ALERTS TABLE 
# ===============================
    
    
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = []

    # Reuse financial metrics logic
    metrics = financial_metrics(db)

    # 🔴 Negative cash flow
    if metrics["net_cash_flow"] < 0:
        alerts.append({
            "type": "danger",
            "title": "Negative Cash Flow",
            "message": "Your expenses exceed your income in the selected period."
        })

    # ⚠️ Low savings rate
    if metrics["savings_rate"] < 20:
        alerts.append({
            "type": "warning",
            "title": "Low Savings Rate",
            "message": "Your savings rate is below the recommended 20%."
        })

    # ⚠️ High burn rate
    if metrics["daily_burn_rate"] > 2000:  # safe demo threshold
        alerts.append({
            "type": "warning",
            "title": "High Burn Rate",
            "message": "Your daily expenses are higher than usual."
        })

    if not alerts:
        alerts.append({
            "type": "success",
            "title": "All Good",
            "message": "No financial risks detected."
        })

    return alerts

@router.get("/dashboard/expense-trend")
def dashboard_expense_trend(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.date_trunc("week", Transaction.date).label("week"),
            func.sum(Transaction.amount).label("total"),
        )
        .filter(Transaction.type == "Expense")
        .group_by("week")
        .order_by("week")
        .all()
    )

    return [
        {
            "week": f"Week {i + 1}",
            "amount": abs(float(r.total)),
        }
        for i, r in enumerate(rows)
    ]

@router.get("/dashboard/category-spending")
def dashboard_category_spending(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("total"),
        )
        .filter(Transaction.type == "Expense")
        .group_by(Transaction.category)
        .all()
    )

    return [
        {
            "name": r.category or "Uncategorized",
            "value": abs(float(r.total)),
        }
        for r in rows
    ]