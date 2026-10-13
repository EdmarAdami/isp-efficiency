# Security baseline (MVP)

## API authorization
- `/v1/audits` requires a bearer token supplied through `API_SERVICE_TOKEN` (minimum 32 characters).
- The tenant is resolved from the trusted server-side `API_TENANT_ID`, never from a user-supplied tenant ID.
- All database reads are filtered by tenant.
- This is a **single-tenant development service-token bridge**, not production-ready end-user authentication.
- Do not embed the token in frontend JavaScript or `NEXT_PUBLIC_*` variables.
- Do not expose the protected API to the internet until OIDC/Entra ID, scoped identities, RBAC, rate limiting, audit logs and tenant authorization are implemented.

## Data protection
- No real customer information should be ingested into the demonstration environment.
- Secrets must be injected through a secret manager in production.
- Plan encryption, retention periods, deletion workflows and LGPD governance before rollout.

## Next security milestone
Implement Entra ID OIDC with JWKS validation, tenant memberships, per-role permissions, request correlation IDs, rate limiting and automated cross-tenant integration tests.
