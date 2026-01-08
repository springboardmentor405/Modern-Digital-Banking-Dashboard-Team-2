import requests
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/currency", tags=["Currency"])

@router.get("/summary")
def currency_summary():
    try:
        response = requests.get(
            "https://api.exchangerate.host/latest",
            params={"base": "INR", "symbols": "USD,EUR"},
            timeout=5
        )

        if response.status_code != 200:
            raise Exception("API not reachable")

        data = response.json()

        # Safety check
        if "rates" not in data:
            raise Exception("Invalid response")

        return {
            "base": "INR",
            "rates": {
                "USD": data["rates"].get("USD", 0),
                "EUR": data["rates"].get("EUR", 0)
            }
        }

    except Exception as e:
        # 🔹 FALLBACK (VERY IMPORTANT)
        return {
            "base": "INR",
            "rates": {
                "USD": 0.012,
                "EUR": 0.011
            },
            "note": "Fallback values used (API unavailable)"
        }
