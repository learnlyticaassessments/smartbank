import os
import re
import httpx
from fastapi import HTTPException

CUSTOMER_BASE = os.getenv("CUSTOMER_BASE", "http://customer-service:8082")


def infer_role(username: str) -> str:
    return "ROLE_CUSTOMER"


async def call_tool(method: str, url: str, json_body=None, token: str | None = None):
    headers = {}
    if token:
        headers["X-Auth-Token"] = token
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.request(method, url, json=json_body, headers=headers)
        return r


async def handle_message(username: str, message: str, token: str | None = None):
    text = (message or "").strip().lower()
    role = infer_role(username)
    actions = []

    if "dashboard" in text or ("kyc" in text and "status" in text):
        intent = "DASHBOARD_SUMMARY"
        url = f"{CUSTOMER_BASE}/api/customer/dashboard/summary?username={username}"
        r = await call_tool("GET", url, token=token)
        actions.append({"tool": "get_customer_dashboard_summary", "method": "GET", "url": url, "status": r.status_code})
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail="Failed to fetch dashboard summary")
        data = r.json()
        reply = f"KYC: {data.get('kycStatus')}. Profile completion: {data.get('profileCompletion')}%."
        return {"reply": reply, "actions": actions, "intent": intent, "role": role, "requiresConfirmation": False}

    if "submit" in text and "kyc" in text:
        intent = "KYC_SUBMIT"
        doc_type = "PAN"
        m = re.search(r"(aadhaar|pan|passport)", text)
        if m:
            doc_type = m.group(1).upper()
        url = f"{CUSTOMER_BASE}/api/customer/kyc/submit"
        r = await call_tool("POST", url, {"username": username, "docType": doc_type}, token=token)
        actions.append({"tool": "submit_kyc", "method": "POST", "url": url, "status": r.status_code})
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail="Failed to submit KYC")
        return {"reply": f"KYC submitted ({doc_type}). Status is now PENDING_REVIEW.", "actions": actions, "intent": intent, "role": role, "requiresConfirmation": False}

    reply = "I can help with: `show my dashboard`, `kyc status`, `submit kyc pan`."
    return {"reply": reply, "actions": actions, "intent": "HELP", "role": role, "requiresConfirmation": False}
