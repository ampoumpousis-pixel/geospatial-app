# Security Rules

Version: 1.0

Purpose:
Define security expectations for all code and configuration produced by AI agents.

---

# Rule 1 — Authentication

All API endpoints except explicitly public resource access must require authentication.

Default: deny unauthenticated access.

---

# Rule 2 — Authorization

Access control must be enforced server-side.

Client-side permission hiding is not sufficient — API endpoints must verify permissions on every request.

---

# Rule 3 — Secrets Management

No secrets (passwords, API keys, tokens, database credentials) may be hard-coded in source code.

Use environment variables or a secrets management system.

---

# Rule 4 — Input Validation

All user input must be validated and sanitized server-side.

Do not rely solely on client-side validation.

---

# Rule 5 — SQL Injection Prevention

Use Django ORM parameterized queries exclusively.

Do not use raw SQL with string concatenation.

---

# Rule 6 — Cross-Site Scripting (XSS)

User-supplied content rendered in the UI must be properly escaped.

React handles this by default — do not use dangerouslySetInnerHTML without review.

---

# Rule 7 — Cross-Site Request Forgery (CSRF)

Django CSRF protection must be enabled for all session-authenticated views.

API endpoints using token authentication should implement appropriate CSRF exemptions.

---

# Rule 8 — File Upload Security

Validate uploaded file types against an allowlist.

Scan file sizes and reject files exceeding configured limits.

Store uploaded files outside the web root.

---

# Rule 9 — HTTPS

All production traffic must use HTTPS.

Development environments may use HTTP.

---

# Rule 10 — Audit Logging

All resource mutations (create, update, delete, permission change) must be logged with:

- user identifier
- timestamp
- action type
- affected resource
- previous state (for updates)

---

# Rule 11 — Dependency Security

Before adding a new dependency:

- Verify it is actively maintained
- Check for known vulnerabilities
- Prefer well-established libraries over obscure ones

---

# Rule 12 — Data Protection

Sensitive data (passwords, personal information) must be:

- encrypted at rest
- transmitted over TLS
- not logged in plain text

Passwords must be hashed using a strong algorithm (Django's default PBKDF2 is acceptable).

---

# Rule 13 — Session Management

Sessions must expire after a configurable period of inactivity.

Users must be able to invalidate all active sessions (force logout).
