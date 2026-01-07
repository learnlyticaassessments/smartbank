import json, os, uuid
from datetime import datetime, timezone

LOG_PATH = os.getenv("AGENT_AUDIT_LOG", "./logs/agent_audit.jsonl")

def write_audit_event(actor: str, role: str, intent: str, user_message: str, actions: list, final_reply: str, safety: dict):
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "requestId": str(uuid.uuid4()),
        "actor": actor,
        "role": role,
        "intent": intent,
        "userMessage": user_message,
        "actions": actions,
        "finalReply": final_reply,
        "safety": {
            "requiresConfirmation": bool(safety.get("requiresConfirmation")),
            "confirmationProvided": bool(safety.get("confirmationProvided")),
            "blockedReason": safety.get("blockedReason"),
        }
    }
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")
