CATEGORY_RULES = {
    "Food": ["swiggy", "zomato", "restaurant"],
    "Transport": ["uber", "ola", "cab"],
    "Shopping": ["amazon", "flipkart"],
    "Entertainment": ["netflix", "spotify"],
    "Salary": ["salary", "credited"],
}

def auto_categorize(description: str) -> str:
    desc = description.lower()
    for category, keywords in CATEGORY_RULES.items():
        for word in keywords:
            if word in desc:
                return category
    return "Uncategorized"
