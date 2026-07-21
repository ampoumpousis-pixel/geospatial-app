# F-001 — User Authentication — Implementation Task Plan

**Status:** Complete
**Plan Version:** 1.0
**Owner:** AGENT-105 — Task Planner
**Total Tasks:** 28
**Estimated Complexity:** Large

## 1. Approval Chain Verification

| Check | Status |
|---|---|
| Feature spec exists (`docs/project/features/F-001/feature-spec.md`) | ✅ PASS |
| Technical design exists (`docs/engineering/technical-plans/F-001/technical-design.md`) | ✅ PASS |
| Engineering review exists (`docs/engineering/reviews/F-001/engineering-review.md`) | ✅ PASS |
| Engineering approval exists (`docs/engineering/approvals/F-001/engineering-approval.md`) | ✅ PASS |
| All artifacts reference Feature ID F-001 | ✅ PASS |
| Review source Tech Design v1.0 matches current | ✅ PASS |
| Approval source Tech Design v1.0 matches current | ✅ PASS |
| Approval source Eng Review v2.0 matches current | ✅ PASS |
| Review recommendation: READY FOR APPROVAL | ✅ PASS |
| Blocking findings: 0 | ✅ PASS |
| Approval decision: NOT REQUIRED | ✅ PASS |
| No unresolved HTDs, ADRs, or OTQs | ✅ PASS |

**Result: All checks pass. Proceeding with task decomposition.**

## 2. Design Gap Detection

### Assessment

Each task candidate was evaluated using the semantic-determinism test: *"Must the Developer choose product behavior, architecture, platform technology, or an integration contract?"*

| Potential Ambiguity | Verdict |
|---|---|
| ADR-003 TokenAuth vs design SessionAuthentication — superseded by DEC-004 | ✅ Not a gap |
| Session invalidation not formalized as TD (AD-F001-001) — documented in DM-F001-002 | ✅ Not a gap |
| Login next-URL contract (AD-F001-003) — frontend handles client-side per CMP-F001-007 | ✅ Not a gap |
| must_change_password enforcement (AD-F001-004) — acceptable in F-001 scope | ✅ Not a gap |
| Celery task location — `users/tasks.py` per CMP-F001-001 | ✅ Not a gap |
| Rate limiting thresholds — 10 req/min login, 3/email/hour reset per Section 14 | ✅ Not a gap |
| Security logging — logger name `auth.security`, events + fields per Section 18 | ✅ Not a gap |
| CSRF config — `CSRF_COOKIE_HTTPONLY = False`, `SameSite=Lax` per Section 16 | ✅ Not a gap |
| Session cookie security — HttpOnly, Secure, SameSite per Section 16 | ✅ Not a gap |

**Result: No design gaps detected. The Technical Design is sufficiently determinate for complete task decomposition.**

## 3. Advisory Handling

| Advisory | Handling |
|---|---|
| AD-F001-001 — Formalize session invalidation TD | Cross-feature note. Approach is clear in DM-F001-002. AGENT-103 to formalize in next design revision. |
| AD-F001-002 — Document ADR-003 auth deviation | Cross-feature note. DEC-004 supersedes ADR-003 TokenAuth mention. AGENT-103 to add note in next revision. |
| AD-F001-003 — Clarify login next-URL handling | Addressed in T-F001-3.1. Recommended: omit `next` from login response (frontend handles client-side). |
| AD-F001-004 — Track must_change_password for F-002+ | Cross-feature note. F-002 must implement `ForcePasswordChangeMiddleware` or permission mixin. |

---

## 4. Task Decomposition

Tasks are organized into 8 phases. Each task is atomic, fits within one agent context window, and has explicit traceability.

### Phase 1: Foundation & Project Configuration

---

#### T-F001-1.1 — Create users Django App and Configure AUTH_USER_MODEL

**Description:** Create the `users` Django app for authentication. Add to `INSTALLED_APPS`. Set `AUTH_USER_MODEL = 'users.User'` **before** any migration runs (CRITICAL — must precede first `migrate`). Configure `django.contrib.sessions`, `django.contrib.auth`. Add `users` URL includes to root URL config. Install `argon2-cffi`.

**Files affected:**
- `backend/users/__init__.py` (new)
- `backend/users/apps.py` (new)
- `backend/users/models.py` (new — stub)
- `backend/config/settings.py` (modified — INSTALLED_APPS, AUTH_USER_MODEL, DATABASES)
- `backend/config/urls.py` (modified — include users.urls)
- `requirements.txt` / `pyproject.toml` (modified — add argon2-cffi)

**Dependencies:** None (first task)

**Technical Design References:**
- CMP-F001-001 — Users Django App
- DM-F001-001 — User Model (AUTH_USER_MODEL prerequisite)
- TD-F001-001 — Argon2 password hashing
- Section 19 — Migration (AUTH_USER_MODEL before migrations)

**Acceptance criteria addressed:** AC-F001-001 (prerequisite), AC-F001-012 (prerequisite)

**Completion criteria:**
- [ ] `users` app directory exists with `__init__.py` and `apps.py`
- [ ] `AUTH_USER_MODEL = 'users.User'` set in `settings.py`
- [ ] `users` in `INSTALLED_APPS`
- [ ] `argon2-cffi` installed and listed in dependencies
- [ ] `python manage.py check` passes
- [ ] `python manage.py migrate` runs (Django contrib migrations)
- [ ] Root URL config includes `users.urls`

**Developer verification:**
- [ ] `python manage.py check` — no errors
- [ ] `python manage.py migrate` — all core migrations applied
- [ ] Verify `AUTH_USER_MODEL` in Django shell

---

#### T-F001-1.2 — Configure Password Hashing, Session Backend, and Cookie Security

**Description:** Configure Django settings: Argon2 primary hasher + PBKDF2 fallback, database-backed sessions (`django.contrib.sessions.backends.db`), session cookie security, CSRF for SPA. Add Argon2 availability check to Django's `check` framework.

**Files affected:**
- `backend/config/settings.py` (modified — PASSWORD_HASHERS, SESSION_*, CSRF_*)
- `backend/config/checks.py` (new — Argon2 system check)

**Dependencies:** T-F001-1.1

**Technical Design References:**
- TD-F001-001 — Argon2 password hashing
- TD-F001-003 — Database session backend
- TR-F001-003 — Argon2 startup check
- Section 16 — Security (cookie settings)

**Acceptance criteria addressed:** AC-F001-012 (password hashing), AC-F001-006 (session config)

**Completion criteria:**
- [ ] `PASSWORD_HASHERS`: Argon2 first, then PBKDF2
- [ ] `SESSION_ENGINE = 'django.contrib.sessions.backends.db'`
- [ ] `SESSION_COOKIE_HTTPONLY = True`, `SESSION_COOKIE_SAMESITE = 'Lax'`
- [ ] `CSRF_COOKIE_HTTPONLY = False` (SPA access)
- [ ] Argon2 availability system check registered
- [ ] `python manage.py check` passes

**Developer verification:**
- [ ] Verify settings in Django shell
- [ ] `python manage.py check --deploy`
- [ ] Test Argon2 check with `python manage.py check` when package missing

---

#### T-F001-1.3 — Create Custom User Model and Initial Migration

**Description:** Define `User` model extending `AbstractUser` with `must_change_password` BooleanField. Unique email. Admin registration. Generate + apply migration.

**Files affected:**
- `backend/users/models.py` (modified — User class)
- `backend/users/admin.py` (new — UserAdmin)
- `backend/users/migrations/0001_initial.py` (generated)

**Dependencies:** T-F001-1.1, T-F001-1.2

**Technical Design References:**
- DM-F001-001 — User Model (fields, invariants)
- TD-F001-007 — Integer PK (not UUID)
- CMP-F001-001 — Admin configuration
- Section 19 — Migration strategy

**Acceptance criteria addressed:** AC-F001-001, AC-F001-010, AC-F001-012

**Completion criteria:**
- [ ] `User(AbstractUser)` with `must_change_password` BooleanField
- [ ] `email` field unique
- [ ] Registered in `admin.py` with `UserAdmin`
- [ ] Migration generated and applied
- [ ] `createsuperuser` works
- [ ] `User.must_change_password` default False

**Developer verification:**
- [ ] `python manage.py makemigrations users`
- [ ] `python manage.py migrate users`
- [ ] `python manage.py createsuperuser`

---

### Phase 2: Backend Services & Utilities

---

#### T-F001-2.1 — Implement Password Strength Validators

**Description:** Create `users/validators.py` with custom Django password validators: minimum 8 chars, at least one uppercase, one lowercase, one digit. Also apply Django's `CommonPasswordValidator`. Register in `AUTH_PASSWORD_VALIDATORS`.

**Files affected:**
- `backend/users/validators.py` (new)
- `backend/config/settings.py` (modified — AUTH_PASSWORD_VALIDATORS)

**Dependencies:** T-F001-1.2

**Technical Design References:**
- TD-F001-006 — Password Policy Validation Rules
- FR-F001-014 — Password policy enforcement
- EAF-F001-007 — Password Policy Enforcement
- Section 8 — CMP-F001-001 validators module

**Acceptance criteria addressed:** AC-F001-011

**Completion criteria:**
- [ ] Custom validators for uppercase, lowercase, digit
- [ ] MinimumLengthValidator(8) applied
- [ ] Specific error messages per validator
- [ ] `AUTH_PASSWORD_VALIDATORS` includes all validators

**Developer verification:**
- [ ] Unit test each validator in isolation
- [ ] `python manage.py check`

---

#### T-F001-2.2 — Implement Celery Task for Password Reset Email

**Description:** Create `users/tasks.py` with `send_password_reset_email(user_id, reset_url)` shared task. Uses Django's `send_mail()`. Configure `max_retries=3`, `default_retry_delay=60`, `soft_time_limit=60`.

**Files affected:**
- `backend/users/tasks.py` (new)
- `backend/users/__init__.py` (modified — Celery discovery)

**Dependencies:** T-F001-1.1, T-F001-5.1 (email settings)

**Technical Design References:**
- TD-F001-004 — Celery email task
- CMP-F001-001 — tasks.py module
- INT-F001-001 — Email Service Integration

**Acceptance criteria addressed:** AC-F001-008 (prerequisite)

**Completion criteria:**
- [ ] `@shared_task` with retry config
- [ ] Task retrieves user, constructs email, calls `send_mail()`
- [ ] Handles user-not-found gracefully
- [ ] Celery auto-discovers task

**Developer verification:**
- [ ] Mock email backend test
- [ ] Task retry test

---

#### T-F001-2.3 — Implement Session Utility Functions

**Description:** Create `users/utils.py` with `get_all_sessions_for_user()`, `delete_all_sessions_for_user()`, `delete_all_other_sessions()` helpers using session iteration with `.decoded()`.

**Files affected:**
- `backend/users/utils.py` (new)

**Dependencies:** T-F001-1.3

**Technical Design References:**
- DM-F001-002 — Session iteration approach
- Section 9 — DM-F001-002 lines 484-493

**Acceptance criteria addressed:** AC-F001-004, AC-F001-009, AC-F001-010

**Completion criteria:**
- [ ] All three functions implemented
- [ ] Handles empty/no-session edge cases
- [ ] Preserves current session in delete_all_other

**Developer verification:**
- [ ] Unit test each function

---

### Phase 3: API Endpoints

Each endpoint adds its serializer, view, and URL pattern to shared files. Tasks are sequential to avoid write conflicts.

---

#### T-F001-3.1 — Implement Login Endpoint (POST /api/auth/login/)

**Description:** `LoginSerializer` + `LoginView`. Authenticates via `authenticate()` + `login()`. Sets `remember_me` and `last_activity` in session. Returns user info. Generic 401 for invalid credentials. Per AD-F001-003, omit `next` from response (frontend handles client-side).

**Files affected:**
- `backend/users/serializers.py` (new — LoginSerializer)
- `backend/users/views.py` (new — LoginView)
- `backend/users/urls.py` (new — URL pattern)

**Dependencies:** T-F001-1.3, T-F001-2.1

**Technical Design References:**
- API-F001-001 — Login spec
- TD-F001-002 — Remember Me
- Section 13 — Login Flow
- AD-F001-003 — Next-URL handling

**Acceptance criteria addressed:** AC-F001-001, AC-F001-002, AC-F001-003, AC-F001-005, AC-F001-007

**Completion criteria:**
- [ ] LoginSerializer validates username, password, remember_me
- [ ] Valid: 200 with user object; 401 generic error
- [ ] Session stores remember_me flag + last_activity
- [ ] Remember-me sets extended cookie max_age
- [ ] CSRF cookie set on GET response

**Developer verification:**
- [ ] curl POST with valid/invalid credentials
- [ ] Verify session cookie
- [ ] Verify remember_me behavior

---

#### T-F001-3.2 — Implement Logout Endpoint (POST /api/auth/logout/)

**Description:** `LogoutView` requires auth. Calls `request.session.flush()` + `delete_all_sessions_for_user()`. Idempotent — returns 200.

**Files affected:**
- `backend/users/views.py` (modified — LogoutView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.1, T-F001-2.3

**Technical Design References:**
- API-F001-002 — Logout spec
- FR-F001-004 — Logout invalidates session

**Acceptance criteria addressed:** AC-F001-004

**Completion criteria:**
- [ ] Requires authentication (401 if not)
- [ ] Flushes session, clears cookie
- [ ] Idempotent

**Developer verification:**
- [ ] Authenticated logout → 200
- [ ] Subsequent request → 401

---

#### T-F001-3.3 — Implement Session Check Endpoint (GET /api/auth/session/)

**Description:** `SessionView` returns user info if authenticated, `{authenticated: false, user: null}` if not. Public endpoint. Used as health/liveness probe.

**Files affected:**
- `backend/users/serializers.py` (modified — SessionSerializer)
- `backend/users/views.py` (modified — SessionView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.1, T-F001-4.1

**Technical Design References:**
- API-F001-006 — Session check spec
- Section 18 — Health Signals

**Acceptance criteria addressed:** AC-F001-003, AC-F001-006

**Completion criteria:**
- [ ] Authenticated: returns user + session_expires + remember_me
- [ ] Unauthenticated: returns authenticated: false
- [ ] Always returns 200 (never 401)

**Developer verification:**
- [ ] GET with/without cookie

---

#### T-F001-3.4 — Implement Password Change Endpoint (POST /api/auth/password-change/)

**Description:** `PasswordChangeSerializer` validates current_password + new_password. `PasswordChangeView` sets new password, deletes other sessions, resets `must_change_password`.

**Files affected:**
- `backend/users/serializers.py` (modified — PasswordChangeSerializer)
- `backend/users/views.py` (modified — PasswordChangeView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.1, T-F001-2.1, T-F001-2.3

**Technical Design References:**
- API-F001-005 — Password change spec
- FR-F001-012 — Password change
- ES-F001-004 — Concurrent session invalidation

**Acceptance criteria addressed:** AC-F001-009

**Completion criteria:**
- [ ] Validates current_password match
- [ ] Validates new_password strength
- [ ] On success: set_password, delete_all_other_sessions, must_change_password=False
- [ ] Returns 400 for wrong current or weak new

**Developer verification:**
- [ ] Valid change → 200
- [ ] Wrong current → 400
- [ ] Weak new → 400

---

#### T-F001-3.5 — Implement Password Reset Request (POST /api/auth/password-reset/)

**Description:** `PasswordResetSerializer` with email. Generates token via `PasswordResetTokenGenerator`, enqueues Celery task. Returns 200 regardless (no enumeration).

**Files affected:**
- `backend/users/serializers.py` (modified — PasswordResetSerializer)
- `backend/users/views.py` (modified — PasswordResetView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.1, T-F001-2.2, T-F001-4.3

**Technical Design References:**
- API-F001-003 — Password reset request spec
- DM-F001-003 — Token via PasswordResetTokenGenerator
- FR-F001-009, FR-F001-010 — Reset flow

**Acceptance criteria addressed:** AC-F001-008

**Completion criteria:**
- [ ] Same 200 for existent/non-existent email
- [ ] Generates token, enqueues Celery task
- [ ] Rate limited (3/email/hour)

**Developer verification:**
- [ ] POST valid email → 200
- [ ] POST non-existent email → 200
- [ ] Celery task enqueued

---

#### T-F001-3.6 — Implement Password Reset Confirm (POST /api/auth/password-reset/confirm/)

**Description:** `PasswordResetConfirmSerializer` validates uidb64 + token + new_password. `PasswordResetConfirmView` sets password, deletes all sessions.

**Files affected:**
- `backend/users/serializers.py` (modified — PasswordResetConfirmSerializer)
- `backend/users/views.py` (modified — PasswordResetConfirmView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.5, T-F001-2.1, T-F001-2.3

**Technical Design References:**
- API-F001-004 — Password reset confirm spec
- FR-F001-011 — Token expiry and single-use

**Acceptance criteria addressed:** AC-F001-008

**Completion criteria:**
- [ ] Validates uidb64 decode + token via check_token()
- [ ] Validates new_password strength
- [ ] On success: set_password, delete_all_sessions
- [ ] Invalid/expired token → 400
- [ ] Second use of token → 400

**Developer verification:**
- [ ] Complete reset flow
- [ ] Invalid token → 400

---

#### T-F001-3.7 — Implement Admin User Creation (POST /api/auth/users/)

**Description:** `UserCreateSerializer` with username, email, password (write-only). `UserCreateView` requires IsAdminUser. Returns 201.

**Files affected:**
- `backend/users/serializers.py` (modified — UserCreateSerializer)
- `backend/users/views.py` (modified — UserCreateView)
- `backend/users/urls.py` (modified — URL pattern)
- `backend/users/permissions.py` (new — IsAdminUserForCreation)

**Dependencies:** T-F001-3.1, T-F001-2.1, T-F001-4.4

**Technical Design References:**
- API-F001-007 — Admin user creation spec
- FR-F001-001 — Admin creates user

**Acceptance criteria addressed:** AC-F001-001

**Completion criteria:**
- [ ] Password write-only, validated
- [ ] Requires IsAdminUser
- [ ] 201 on success, 403 for non-admin
- [ ] Security event logged

**Developer verification:**
- [ ] Admin → 201, non-admin → 403

---

#### T-F001-3.8 — Implement Admin Force Password Reset (POST /api/auth/users/{id}/force-reset-password/)

**Description:** `ForcePasswordResetSerializer` with new_password. Sets password + `must_change_password=True`. Deletes ALL sessions.

**Files affected:**
- `backend/users/serializers.py` (modified — ForcePasswordResetSerializer)
- `backend/users/views.py` (modified — ForcePasswordResetView)
- `backend/users/urls.py` (modified — URL pattern)

**Dependencies:** T-F001-3.7, T-F001-2.1, T-F001-2.3, T-F001-4.4

**Technical Design References:**
- API-F001-008 — Force reset spec
- FR-F001-013 — Admin reset
- ES-F001-006 — Force reset during active session

**Acceptance criteria addressed:** AC-F001-010

**Completion criteria:**
- [ ] Admin-only access
- [ ] Sets must_change_password=True
- [ ] Deletes ALL sessions
- [ ] Login response includes must_change_password: true

**Developer verification:**
- [ ] Admin → 200, non-admin → 403

---

### Phase 4: Middleware & Security

---

#### T-F001-4.1 — Implement SessionIdleTimeoutMiddleware

**Description:** Create `users/middleware.py` with `SessionIdleTimeoutMiddleware`. On each authenticated request without `remember_me` flag, check `session['last_activity']` against configured `SESSION_IDLE_TIMEOUT`. If expired, flush session and set `request.session_expired = True`. Position after `AuthenticationMiddleware` in `MIDDLEWARE`.

**Files affected:**
- `backend/users/middleware.py` (new)
- `backend/config/settings.py` (modified — MIDDLEWARE ordering)

**Dependencies:** T-F001-1.3, T-F001-1.2

**Technical Design References:** CMP-F001-002, TD-F001-005, ES-F001-001, Section 16

**Acceptance criteria addressed:** AC-F001-006

**Completion criteria:**
- [ ] Middleware defined with `__call__` method
- [ ] Skips unauthenticated requests and `remember_me=True` sessions
- [ ] Compares `last_activity` against `SESSION_IDLE_TIMEOUT`
- [ ] Flushes session on timeout, sets flag on request
- [ ] Updates `last_activity` on active requests
- [ ] Positioned after `AuthenticationMiddleware` in settings
- [ ] `python manage.py check` passes

---

#### T-F001-4.2 — Configure DRF Authentication Classes and Permissions

**Description:** Set DRF defaults: `DEFAULT_AUTHENTICATION_CLASSES = [SessionAuthentication]`, `DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]`. Configure `SessionAuthentication` as the auth scheme. Ensure CSRF middleware is enabled with SPA-friendly settings.

**Files affected:**
- `backend/config/settings.py` (modified — REST_FRAMEWORK, CSRF_*, cookie settings)

**Dependencies:** T-F001-1.2

**Technical Design References:** CMP-F001-003, Section 16 (Security)

**Acceptance criteria addressed:** AC-F001-003, AC-F001-005

**Completion criteria:**
- [ ] `REST_FRAMEWORK` configured with SessionAuthentication default
- [ ] CSRF cookie settings (`CSRF_COOKIE_HTTPONLY = False`, `SameSite=Lax`)
- [ ] Session cookie security (`HttpOnly=True`, `Secure=True` in production)

---

#### T-F001-4.3 — Implement Rate Limiting for Auth Endpoints

**Description:** Apply DRF throttling to login endpoint (10 req/min per user). Implement custom cache-based throttling for password reset (3 req/email/hour).

**Files affected:**
- `backend/users/throttling.py` (new)
- `backend/config/settings.py` (modified — REST_FRAMEWORK DEFAULT_THROTTLE_*)

**Dependencies:** T-F001-3.1, T-F001-3.5

**Technical Design References:** Section 14 (Performance), Section 16 (Rate Limiting)

**Completion criteria:**
- [ ] Login throttled at 10 req/min per user
- [ ] Password reset throttled at 3 req/email/hour
- [ ] Rate limit exceeded returns 429 with retry-after header
- [ ] Rate limit events logged as WARNING

---

#### T-F001-4.4 — Implement Security Event Logging

**Description:** Configure `auth.security` logger. Add structured logging calls to all auth endpoints for: login success/failure, logout, password change, password reset, admin user creation, admin force reset, session timeout. Use a consistent event field format.

**Files affected:**
- `backend/config/logging.py` (new or modified)
- `backend/users/views.py` (modified — add logging calls)
- `backend/users/middleware.py` (modified — add session timeout logging)

**Dependencies:** T-F001-3.1 through T-F001-3.8, T-F001-4.1

**Technical Design References:** Section 18 (Observability)

**Completion criteria:**
- [ ] `auth.security` logger configured with proper handlers/formatters
- [ ] All security events logged with structured fields per Section 18
- [ ] Login failure logged as INFO (not WARNING — avoids alert fatigue)
- [ ] Password reset email failure logged as WARNING
- [ ] Rate limit exceeded logged as WARNING
- [ ] No plain-text passwords or PII in log messages

---

### Phase 5: Email Configuration

---

#### T-F001-5.1 — Configure Email Backend and Create Email Templates

**Description:** Configure Django email settings for development (console backend) and production (SMTP via env vars). Create password reset email templates (plain text + HTML). Configure `PASSWORD_RESET_TIMEOUT = 86400` (24h).

**Files affected:**
- `backend/config/settings.py` (modified — EMAIL_*, PASSWORD_RESET_TIMEOUT)
- `backend/users/templates/users/password_reset_email.txt` (new)
- `backend/users/templates/users/password_reset_email.html` (new)

**Dependencies:** T-F001-1.1

**Technical Design References:** TD-F001-004, INT-F001-001, Section 9 (Configuration)

**Completion criteria:**
- [ ] Development email backend: console
- [ ] Production SMTP config via environment variables
- [ ] Password reset email templates created (text + HTML)
- [ ] Templates include reset link with uidb64 + token
- [ ] `PASSWORD_RESET_TIMEOUT = 86400`

---

### Phase 6: Frontend Infrastructure

---

#### T-F001-6.1 — Implement Auth Service (authService.ts)

**Description:** Create frontend API client wrapper for all auth endpoints. Handle CSRF token extraction from cookie and `X-CSRFToken` header injection on mutating requests. Configure `withCredentials: true` for session cookies.

**Files affected:**
- `frontend/src/services/authService.ts` (new)
- `frontend/src/services/apiClient.ts` (new)

**Dependencies:** T-F001-1.1 (conceptual, can run parallel)

**Technical Design References:** CMP-F001-004, Section 16 (CSRF handling)

**Completion criteria:**
- [ ] `apiClient` with `baseURL='/api/'`, `withCredentials: true`
- [ ] CSRF token read from `csrftoken` cookie, sent as `X-CSRFToken` header
- [ ] Functions: `login`, `logout`, `checkSession`, `requestPasswordReset`, `confirmPasswordReset`, `changePassword`
- [ ] 401 response interceptor triggers `auth:unauthorized` custom event
- [ ] Typed request/response matching API contracts

---

#### T-F001-6.2 — Implement AuthContext (AuthContext.tsx)

**Description:** React Context + Provider managing auth state. On mount calls `checkSession()`. Provides `user`, `isAuthenticated`, `isLoading`, `sessionExpired` state and `login`, `logout`, `checkSession` methods.

**Files affected:**
- `frontend/src/context/AuthContext.tsx` (new)

**Dependencies:** T-F001-6.1

**Technical Design References:** CMP-F001-005

**Completion criteria:**
- [ ] Context provides user, isAuthenticated, isLoading, sessionExpired
- [ ] On mount: checkSession() restores session from cookie
- [ ] login() updates state on success
- [ ] logout() clears state, navigates to /login
- [ ] Listens for `auth:unauthorized` event
- [ ] Loading state prevents flash of login page on refresh

---

#### T-F001-6.3 — Implement ProtectedRoute Component

**Description:** Route guard component. Shows loading spinner while auth state loads. Redirects to `/login?next={path}` when unauthenticated. Validates `next` param (same-origin only). Redirects to password change when `must_change_password` is true.

**Files affected:**
- `frontend/src/components/auth/ProtectedRoute.tsx` (new)

**Dependencies:** T-F001-6.2

**Technical Design References:** CMP-F001-006, EAF-F001-006, Section 10 (open-redirect prevention)

**Completion criteria:**
- [ ] Loading state shows spinner (no flash)
- [ ] Unauthenticated: redirect to `/login?next=...`
- [ ] `must_change_password`: redirect to `/password-change?forced=true`
- [ ] Authenticated + no flag: render children
- [ ] Open-redirect prevention on `next` param

---

#### T-F001-6.4 — Configure Frontend Routing

**Description:** Set up React Router with auth routes and protected route groups. Configure Vite proxy for `/api/` to Django backend at `localhost:8000`.

**Files affected:**
- `frontend/src/App.tsx` (new or modified)
- `frontend/vite.config.ts` (new or modified)

**Dependencies:** T-F001-6.2, T-F001-6.3

**Technical Design References:** CMP-F001-007, CMP-F001-008, CMP-F001-009

**Completion criteria:**
- [ ] Routes: `/login`, `/forgot-password`, `/reset-password/confirm`, `/password-change`
- [ ] Protected routes wrapped with `<ProtectedRoute>`
- [ ] Vite proxy: `/api/` → `http://localhost:8000`

---

### Phase 7: Frontend Pages

---

#### T-F001-7.1 — Implement Login Page

**Description:** Login form with username, password, "Remember Me" checkbox, "Forgot password" link. Reads `next` param from URL. Calls `authService.login()`. Displays generic error on failure. Redirects on success.

**Files affected:**
- `frontend/src/pages/auth/LoginPage.tsx` (new)

**Dependencies:** T-F001-6.1, T-F001-6.4

**Technical Design References:** CMP-F001-007, API-F001-001

**Acceptance criteria addressed:** AC-F001-001 through AC-F001-005, AC-F001-007

**Completion criteria:**
- [ ] Form with username, password, remember_me, "Forgot password" link
- [ ] Client-side validation (non-empty fields)
- [ ] Calls login API on submit
- [ ] 401: shows generic error
- [ ] Success: redirects to `next` param or `/`
- [ ] Loading state disables form

---

#### T-F001-7.2 — Implement Forgot Password Page

**Description:** Email input form. Calls `authService.requestPasswordReset()`. Shows success message regardless of email existence (no enumeration).

**Files affected:**
- `frontend/src/pages/auth/ForgotPasswordPage.tsx` (new)

**Dependencies:** T-F001-6.1, T-F001-6.4

**Technical Design References:** CMP-F001-008, API-F001-003

**Acceptance criteria addressed:** AC-F001-008

**Completion criteria:**
- [ ] Email form with validation
- [ ] Calls requestPasswordReset API
- [ ] Shows generic success message (always same)
- [ ] Link back to login

---

#### T-F001-7.3 — Implement Password Reset Confirm Page

**Description:** Reads `uidb64` and `token` from URL params. Shows new password form. Calls `authService.confirmPasswordReset()`. On success, navigates to login with message.

**Files affected:**
- `frontend/src/pages/auth/ResetPasswordConfirmPage.tsx` (new)

**Dependencies:** T-F001-6.1, T-F001-6.4

**Technical Design References:** CMP-F001-008, API-F001-004

**Acceptance criteria addressed:** AC-F001-008

**Completion criteria:**
- [ ] Reads uidb64 + token from URL params
- [ ] New password + confirmation form
- [ ] Client-side validation (match, min length)
- [ ] Calls confirmPasswordReset API
- [ ] Success: redirect to login with message
- [ ] Error: show "link invalid or expired"

---

#### T-F001-7.4 — Implement Password Change Page

**Description:** Current password + new password + confirm form. Calls `authService.changePassword()`. Supports `?forced=true` mode (shows banner, hides "skip").

**Files affected:**
- `frontend/src/pages/auth/PasswordChangePage.tsx` (new)

**Dependencies:** T-F001-6.1, T-F001-6.4

**Technical Design References:** CMP-F001-009, API-F001-005

**Acceptance criteria addressed:** AC-F001-009

**Completion criteria:**
- [ ] Current password + new password + confirm form
- [ ] Client-side validation
- [ ] `?forced=true` shows mandatory banner
- [ ] Calls changePassword API
- [ ] Success: confirmation + redirect
- [ ] Error: show field-level or generic error

---

### Phase 8: Testing

---

#### T-F001-8.1 — Backend Unit Tests for Auth Models and Validators

**Description:** Tests for User model (creation, must_change_password, unique constraints), password validators, session utility functions.

**Files affected:**
- `backend/users/tests/test_models.py` (new)
- `backend/users/tests/test_validators.py` (new)
- `backend/users/tests/test_utils.py` (new)

**Dependencies:** T-F001-1.3, T-F001-2.1, T-F001-2.3

**Technical Design References:** DM-F001-001, DM-F001-002, TD-F001-006, TD-F001-007

**Completion criteria:**
- [ ] User model tests (create, unique username/email, must_change_password default)
- [ ] Validator tests (each rule, edge cases)
- [ ] Session utility tests (get/delete sessions, preserve current)
- [ ] All pass: `python manage.py test users.tests.test_models users.tests.test_validators users.tests.test_utils`

---

#### T-F001-8.2 — Backend Integration Tests for Auth Flows

**Description:** End-to-end tests using DRF `APIClient`. Full login/logout/password reset/password change flows. Test all acceptance criteria scenarios.

**Files affected:**
- `backend/users/tests/test_api.py` (new)

**Dependencies:** T-F001-3.1 through T-F001-3.8, T-F001-4.1, T-F001-4.3, T-F001-4.4

**Technical Design References:** All API contracts (Section 10), all Engineering Scenarios (Section 20), all ACs

**Completion criteria:**
- [ ] Login: valid → 200, invalid → 401, inactive → 403
- [ ] Login with remember_me: extended session expiry
- [ ] Logout: 200, session invalidated
- [ ] Session check: authenticated → user, unauthenticated → false
- [ ] Password change: correct → 200, wrong current → 400, weak → 400
- [ ] Password reset request: valid email → 200, non-existent → 200
- [ ] Password reset confirm: valid → 200, expired → 400, reused → 400
- [ ] Admin user creation: admin → 201, non-admin → 403
- [ ] Admin force reset: sets must_change_password, deletes sessions
- [ ] Session idle timeout: expired → 401
- [ ] Rate limiting: exceeded → 429
- [ ] All pass: `python manage.py test users.tests`

---

#### T_F001-8.3 — Frontend Component Tests

**Description:** Tests for AuthContext, ProtectedRoute, LoginPage, PasswordResetPage, PasswordResetConfirmPage, PasswordChangePage using React Testing Library.

**Files affected:**
- `frontend/src/__tests__/` (new test files)

**Dependencies:** T-F001-6.1 through T-F001-6.4, T-F001-7.1 through T-F001-7.4

**Technical Design References:** CMP-F001-005 through CMP-F001-009

**Completion criteria:**
- [ ] AuthContext: initial loading, checkSession, login, logout, 401 event
- [ ] ProtectedRoute: authenticated, unauthenticated, loading, must_change_password
- [ ] LoginPage: renders, submits, errors, redirects
- [ ] ForgotPasswordPage: renders, submits, success message
- [ ] ResetPasswordConfirmPage: URL params, validation, success
- [ ] PasswordChangePage: form, validation, success, forced mode
- [ ] All pass: `npm test`

---

#### T-F001-8.4 — Middleware and Security Tests

**Description:** Tests for SessionIdleTimeoutMiddleware behavior (timeout, active, remember_me skip, edge cases). Tests for rate limiting and security logging.

**Files affected:**
- `backend/users/tests/test_middleware.py` (new)
- `backend/users/tests/test_throttling.py` (new)
- `backend/users/tests/test_logging.py` (new)

**Dependencies:** T-F001-4.1, T-F001-4.3, T-F001-4.4

**Technical Design References:** CMP-F001-002, Section 16, Section 18

**Completion criteria:**
- [ ] Middleware: idle timeout, active session, remember_me skip, missing last_activity
- [ ] Middleware ordering in settings verified
- [ ] Rate limiting: within limit → pass, exceeded → 429
- [ ] Logging: security events logged with correct level + fields
- [ ] All pass

---

## Execution Order

```
Phase 1 — Foundation & Project Configuration (sequential)
 1. T-F001-1.1 — Create users Django App and configure AUTH_USER_MODEL
 2. T-F001-1.2 — Configure password hashing, session backend, and cookie security
 3. T-F001-1.3 — Create custom User model and initial migration

Phase 2 — Backend Services & Utilities (after Phase 1)
 4. T-F001-2.1 — Implement password strength validators
 5. T-F001-2.2 — Implement Celery task for password reset email
 6. T-F001-2.3 — Implement session utility functions
    (T-F001-2.1, T-F001-2.2, T-F001-2.3 can run in parallel)

Phase 3 — API Endpoints (after Phase 1, sequential within)
 7. T-F001-3.1 — Login endpoint
 8. T-F001-3.2 — Logout endpoint
 9. T-F001-3.3 — Session check endpoint
10. T-F001-3.4 — Password change endpoint
11. T-F001-3.5 — Password reset request endpoint
12. T-F001-3.6 — Password reset confirm endpoint
13. T-F001-3.7 — Admin user creation endpoint
14. T-F001-3.8 — Admin force password reset endpoint

Phase 4 — Middleware & Security (parallel with Phase 3)
15. T-F001-4.1 — SessionIdleTimeoutMiddleware
16. T-F001-4.2 — DRF auth classes and permissions config
17. T-F001-4.3 — Rate limiting
18. T-F001-4.4 — Security event logging
    (T-F001-4.1 through T-F001-4.4 can run in parallel)

Phase 5 — Email Configuration (parallel with Phase 3)
19. T-F001-5.1 — Email backend config and templates

Phase 6 — Frontend Infrastructure (parallel with Phase 1/2)
20. T-F001-6.1 — Auth service (authService.ts)
21. T-F001-6.2 — AuthContext (AuthContext.tsx)
22. T-F001-6.3 — ProtectedRoute component
23. T-F001-6.4 — Frontend routing config

Phase 7 — Frontend Pages (after Phase 6)
24. T-F001-7.1 — Login page
25. T-F001-7.2 — Forgot password page
26. T-F001-7.3 — Password reset confirm page
27. T-F001-7.4 — Password change page

Phase 8 — Testing (after all implementation)
28. T-F001-8.1 — Backend unit tests (models, validators, utils)
29. T-F001-8.2 — Backend integration tests (API flows)
30. T-F001-8.4 — Middleware and security tests
```

### Parallel Groups

| Group | Tasks | Rationale |
|---|---|---|
| A | T-F001-1.1 → T-F001-1.2 → T-F001-1.3 | Sequential foundation (must precede everything) |
| B | T-F001-2.1, T-F001-2.2, T-F001-2.3 | Parallel after Phase 1; different file sets |
| C | T-F001-3.1 → T-F001-3.2 → ... → T-F001-3.8 | Sequential (shared files: serializers.py, views.py, urls.py) |
| D | T-F001-4.1, T-F001-4.2, T-F001-4.3, T-F001-4.4 | Parallel with Phase 3; new file each |
| E | T-F001-5.1 | Independent (email templates) |
| F | T-F001-6.1 → T-F001-6.2 → T-F001-6.3, T-F001-6.4 | Sequential frontend infrastructure |
| G | T-F001-7.1, T-F001-7.2, T-F001-7.3, T-F001-7.4 | Parallel after Phase 6; different page files |
| H | T-F001-8.1, T-F001-8.2, T-F001-8.4 | Parallel (different test files) |

## Notes

- **Greenfield project:** No existing backend or frontend code exists. All files listed are new files. No existing code is modified.
- **Initial superuser:** After deployment, run `python manage.py createsuperuser` to create the initial admin account per DEP-F001-002 and EA-F001-004.
- **Redis requirement:** The session backend and Celery broker require a running Redis instance. Development configuration should assume `redis://localhost:6379`.
- **Email configuration:** The password reset flow requires SMTP configuration. For development, set `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` to print emails to the console. For production, configure SMTP settings in environment variables.
- **Session configuration seed data:** After migration, a `data migration` or `post_migrate` signal should create the initial `SessionConfiguration` record with default values (30 min idle, 30 days remember-me).
- **CORS/CSRF in development:** The Vite dev server proxies `/api/` requests to Django at `localhost:8000`. For production, configure `CSRF_TRUSTED_ORIGINS` with the frontend domain.
- **must_change_password enforcement:** The `must_change_password` flag is enforced at the frontend level (ProtectedRoute). Future features (F-002+) must add backend middleware or permission checks per RSK-F001-003.
- **Rollback safety:** Custom User model (`AUTH_USER_MODEL`) must be set before the first migration. This is a one-time architectural decision that cannot be reversed without a database rebuild if data exists.
