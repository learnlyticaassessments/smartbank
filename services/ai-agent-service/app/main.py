import os
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from .audit import write_audit_event
from .agent_rules import handle_message as handle_rules

CUSTOMER_BASE = os.getenv("CUSTOMER_BASE", "http://customer-service:8082")

app = FastAPI(title="SmartBank AI Agent Service")

# Allow CORS from frontend (development). In production restrict this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatReq(BaseModel):
    username: str
    message: str


@app.get("/actuator/health")
def health():
    return {"status": "UP"}


async def validate_token(token: str):
    if not token:
        return None
    async with httpx.AsyncClient(timeout=5) as client:
        try:
            r = await client.get(f"{CUSTOMER_BASE}/api/customer/whoami", headers={"X-Auth-Token": token})
        except Exception:
            return None
        if r.status_code == 200:
            try:
                return r.json().get("username")
            except Exception:
                return None
        return None


@app.post("/api/agent/chat")
async def chat(req: ChatReq, request: Request, x_auth_token: str | None = Header(default=None)):
    # Validate token (if present) and ensure it matches provided username
    valid_user = await validate_token(x_auth_token)
    if valid_user is None:
        # no valid token; reject
        raise HTTPException(status_code=401, detail="Missing or invalid auth token")
    if valid_user != req.username:
        raise HTTPException(status_code=403, detail="Token does not match username")

    mode = os.getenv("AGENT_MODE", "rules").lower()
    try:
        # pass token through via handler param
        result = await handle_rules(req.username, req.message, token=x_auth_token)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        write_audit_event(
            actor=req.username,
            role=result.get("role","UNKNOWN"),
            intent=result.get("intent","UNKNOWN"),
            user_message=req.message,
            actions=result.get("actions",[]),
            final_reply=result.get("reply",""),
            safety={"requiresConfirmation": False, "confirmationProvided": False, "blockedReason": None}
        )
    except Exception:
        pass

    return result
