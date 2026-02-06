# SmartBank (Student A Implementation + Agentic AI)

This repo implements **Student A** stories end-to-end:(Project)

- Angular: Customer registration/profile, KYC upload UI, Customer dashboard + validations
- Spring Boot: customer-service (CRUD + KYC APIs + dashboard aggregation + profile completion score)
- Docker: Dockerfiles + docker-compose (Angular → Nginx)
- Kubernetes: manifests for customer-service + ai-agent-service + frontend
- Agentic AI: ai-agent-service calls customer-service tools + audit logs + transfer confirmation guardrail pattern (starter)

## Local Run (Docker Compose)

Prereqs: Docker Desktop

```bash
cd docker
docker compose up --build
```

Open:

- Frontend: http://localhost:4200
- AI Agent: http://localhost:8090
- Customer API: http://localhost:8082

## Agentic AI demo

In UI, go to **Ask SmartBank** and try:

- `kyc status`
- `submit kyc pan`
- `show my dashboard`

Audit log:

- `docker/logs/agent_audit.jsonl`

## Notes

This package focuses on Student A scope + Agentic AI integration to customer-service.
Other services (accounts/loans/auth/admin) can be added later following the same patterns.
