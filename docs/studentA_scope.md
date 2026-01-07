# Student A Stories — Implemented

## Angular
- Customer registration form (with validations)
- Profile edit page
- KYC upload UI (simulated upload + KYC submit API)
- Customer dashboard (summary + profile completion)

## Spring Boot (customer-service)
- Customer registration API
- Profile CRUD APIs
- KYC status management API
- Dashboard aggregation API
- Profile completion scoring logic

## Docker
- customer-service Dockerfile (multi-stage Maven build)
- Angular build → Nginx container
- docker-compose to run full stack

## Kubernetes
- customer-service deployment/service + readiness/liveness probes
- ai-agent-service deployment/service
- frontend deployment/service

## Agentic AI
- ai-agent-service calls customer-service tools:
  - dashboard summary
  - KYC submit
