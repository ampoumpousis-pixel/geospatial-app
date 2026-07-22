# Command: Bootstrap

Version: 1.0

Command ID: CMD-102

---

# Purpose

Bootstrap the platform development environment — extract the full tech stack from architecture docs, install prerequisites, scaffold all project directories and configuration files, and verify the environment is ready for feature implementation.

This command transforms the project from "planning phase" to "development ready."

The command does NOT implement any features.

The result is:
- Complete tech stack extracted and confirmed
- All prerequisites installed (Docker, Python, Node, etc.)
- Platform scaffold generated (Django backend, React frontend, Docker infrastructure)
- Developer tooling configured (linting, formatting, pre-commit hooks)
- Verification that all services start and respond

---

# When To Use

Use this command when:
- Starting development on the platform for the first time
- Re-building the development environment after a reset
- Verifying the environment is healthy after dependency changes

Do not use this command for:
- Feature implementation
- Bug fixes
- Adding new technologies (that requires updating architecture docs first)

---

# Golden Rule

**Tech stack definition lives in architecture docs, not in this command.** This command reads the docs and generates configuration from them. If you want to change the tech stack, update `PROJECT_FACTS.md`, `system-overview.md`, `component-design.md`, or ADRs first, then re-run this command.

---

# Execution Model

```
Phase A — Tech Stack Extraction (DISPLAY ONLY, NO ACTIONS)
    ↓
Human Confirmation Gate
    ↓
Phase B — Environment Audit
    ↓
Phase C — Prerequisite Installation (with confirmation)
    ↓
Phase D — File Generation
    ↓
Phase E — Verification
    ↓
Phase F — Memory Update
```

---

# IMPORTANT: Phase A Must Complete Before Any Action

**DO NOT run any installation commands, create any files, or modify any system state during Phase A.** Phase A is read-only. Its sole purpose is to display the extracted tech stack to the user and wait for confirmation.

---

# Phase A — Tech Stack Extraction (READ-ONLY, DISPLAY ONLY)

## A1 — Read Source Documents

Read the following files to extract the complete technology stack:

```
docs/project/PROJECT_FACTS.md
docs/architecture/system-overview.md
docs/architecture/component-design.md
docs/analysis/non-functional-requirements.md
docs/adr/ADR-001-resource-centric-domain.md
docs/adr/ADR-002-modular-monolith.md
docs/adr/ADR-003-django-rest-framework.md
docs/adr/ADR-004-plugin-viewers.md
docs/adr/ADR-005-abstracted-publishing.md
docs/adr/ADR-006-flexible-metadata.md
docs/engineering/technical-plans/F-001/technical-design.md
```

## A2 — Extract Tech Stack Categories

From these documents, extract and categorize:

### Docker Services (docker-compose)
Identify every service that must run as a container:
- PostgreSQL version + PostGIS extension
- Redis version
- GeoServer version
- MinIO (S3-compatible object storage for development)
- Mailhog (email capture for development)
- Backend (Django — custom Dockerfile)
- Frontend (Vite + React — custom Dockerfile for dev)
- Celery Worker (same image as backend)

For each service, determine:
- Docker image or Dockerfile path
- Ports
- Volumes (data persistence)
- Environment variables
- Dependencies between services
- Health check endpoints

### Backend Python Packages
Extract every Python dependency mentioned in the architecture:
- Django version
- Django REST Framework
- Database drivers (psycopg2)
- Celery + Redis
- Password hashing (argon2-cffi)
- Storage (django-storages, boto3)
- CORS handling (django-cors-headers)
- Environment config (django-environ)
- API documentation (drf-spectacular)
- Filtering (django-filter)
- Image processing (Pillow)
- Geospatial processing (GDAL Python bindings)
- Any other libraries referenced in the technical design

### Frontend npm Packages
Extract every JavaScript/TypeScript dependency:
- React version
- TypeScript
- Vite
- Material UI version
- React Router
- HTTP client (axios)
- State management (zustand)
- Data fetching (react-query)
- MapStore (2D map viewer)
- CesiumJS (3D globe)
- Potree (point cloud viewer)
- Any other libraries referenced

### System Packages
Identify native system packages needed:
- GDAL development libraries
- PostgreSQL client libraries
- Python development headers
- Build essentials (gcc, make, etc.)

### Developer Tooling
- Python: ruff (lint + format), mypy (type checking)
- JavaScript: eslint (lint), prettier (format)
- pre-commit hooks

## A3 — Display the Tech Stack

**IMPORTANT: Format the output clearly. Display the complete tech stack as a structured summary, exactly as shown below:**

```
═══════════════════════════════════════════════════════════
                    PROPOSED TECH STACK
                  (extracted from architecture docs)
═══════════════════════════════════════════════════════════

## Docker Services (8 containers)

  1. PostgreSQL 16 + PostGIS     postgis/postgis:16-3.4
  2. Redis 7                     redis:7-alpine
  3. GeoServer 2.25.x            geosolutionsit/geoserver:2.25.x
  4. MinIO (object storage)      minio/minio:latest
  5. Mailhog (email dev)         mailhog/mailhog:latest
  6. Backend (Django 5)          platform/backend/Dockerfile
  7. Frontend (Vite + React)     platform/frontend/Dockerfile
  8. Celery Worker               platform/backend/Dockerfile

## Backend — Python Packages (pip)

  django~=5.0, djangorestframework, django-cors-headers,
  django-environ, django-storages, django-filter,
  drf-spectacular, django-extensions, psycopg2-binary,
  celery[redis], redis, argon2-cffi, boto3, Pillow
  (GDAL via system python3-gdal package, not pip)

## Frontend — npm Packages

  react, react-dom, react-router-dom,
  @mui/material, @mui/icons-material, @emotion/react, @emotion/styled,
  axios, zustand, @tanstack/react-query,
  cesium, potree-core, mapstore

## System Packages (apt)

  gdal-bin, libgdal-dev, python3-dev, python3-venv,
  build-essential, libpq-dev

## Developer Tooling

  Python:     ruff (lint+format), mypy (type check)
  JavaScript: eslint, prettier
  Shared:     pre-commit hooks

## Directory Structure

  platform/
    backend/
    frontend/
    docker/

═══════════════════════════════════════════════════════════
```

## A4 — Wait for Confirmation

After displaying the tech stack, ask the user:

**"Does this tech stack look correct? Proceed with installation? [Y/n]"**

- If user says **Yes/Y/Enter** → proceed to Phase B
- If user says **No/N** → ask "What should be changed?" and apply adjustments, then re-display
- DO NOT proceed past Phase A without explicit user confirmation

---

# Phase B — Environment Audit

## B1 — Detect Operating System

Run: `uname -s` and read `/etc/os-release` (Linux) or `/etc/os-release` equivalent.

Determine:
- OS family (Linux, macOS, Windows/MINGW)
- Distribution (Ubuntu, Debian, Fedora, Arch, macOS, etc.)
- Package manager (apt, dnf, pacman, brew, winget, choco)

If OS cannot be determined, report: "Unknown OS. Cannot auto-install prerequisites. Will generate files only. Proceed? [Y/n]"

## B2 — Check Prerequisites

Check for each required tool. Use `which`, `command -v`, or version checks:

| Tool | Check command | Minimum version | Install tier |
|------|--------------|-----------------|-------------|
| Docker | `docker --version` | 24.0 | Complex |
| Docker Compose | `docker compose version` | 2.20 | Moderate |
| Python 3 | `python3 --version` | 3.12 | Simple |
| pip | `pip3 --version` or `python3 -m pip --version` | (latest) | Simple |
| Node.js | `node --version` | 20.x | Moderate |
| npm | `npm --version` | 10.x | Simple (with node) |
| GDAL | `gdal-config --version` | 3.8 | Simple |

For each tool present, record the version. For each missing tool, record it as unavailable.

## B3 — Display Audit Results

Show a clear table:

```
## Environment Audit

  ✅ Docker 26.1.4
  ✅ Docker Compose 2.27.1
  ✅ Python 3.12.3
  ✅ pip 24.0
  ❌ Node.js 20.x — not found
  ✅ npm 10.8.1
  ✅ GDAL 3.8.5

  Summary: 6/7 prerequisites available
```

---

# Phase C — Prerequisite Installation

## C1 — Installation Strategy by Tier

### Simple Tier (Python, pip, GDAL libs, Node via apt)
- Show the single installation command (e.g., `sudo apt install -y python3.12 python3-pip gdal-bin libgdal-dev`)
- Ask: **"Install [tool name]? [Y/n]"**
- If yes → run the command, verify installation succeeded
- If no → mark as unavailable, will skip relevant verifications

### Moderate Tier (Node via nvm, Docker Compose plugin)
- Show the 2-3 step installation sequence
- Ask: **"Install Node.js 20 via nvm? (2 steps) [Y/n]"**
- If yes → run each step, verify after each
- If a step fails → report and ask whether to continue or skip

### Complex Tier (Docker Engine)
- Show the full installation procedure (4-7 steps depending on OS)
- Ask: **"Docker requires several manual steps. Show them? [Y/n/skip]"**
- If yes → display step 1, ask "Execute step 1? [Y/n/skip-steps]" → repeat for each step
- If no/skip → mark as unavailable, note that Docker verification will be skipped

**IMPORTANT RULES:**
- NEVER run `sudo` without explicit user confirmation (one confirmation, one command)
- NEVER replace existing versions (e.g., if user has Python 3.13, don't force 3.12)
- If a version is newer than required, mark it as compatible (e.g., Python 3.13 >= 3.12 → OK)
- If a version is older than required, warn but don't override automatically

## C2 — Installation Commands by OS

### Ubuntu/Debian (apt)

```
Simple:
  sudo apt update && sudo apt install -y python3 python3-pip python3-venv python3-dev gdal-bin libgdal-dev libpq-dev build-essential

Moderate (Node via nvm):
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  source ~/.bashrc
  nvm install 20
  nvm use 20

Complex (Docker):
  Step 1: sudo apt update && sudo apt install -y ca-certificates curl
  Step 2: sudo install -m 0755 -d /etc/apt/keyrings
  Step 3: sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  Step 4: echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list
  Step 5: sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  Step 6: sudo usermod -aG docker $USER
  Step 7: newgrp docker (or log out and back in)
```

### Fedora/RHEL (dnf)

```
Simple:
  sudo dnf install -y python3 python3-pip python3-devel gdal gdal-devel libpq-devel gcc gcc-c++ make

Moderate:
  sudo dnf install -y nodejs npm
  (if version too old: use nvm approach as above)

Complex (Docker):
  sudo dnf remove docker-*    (if old versions)
  sudo dnf -y install dnf-plugins-core
  sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
  sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo systemctl enable docker --now
  sudo usermod -aG docker $USER
  newgrp docker
```

### Arch (pacman)

```
Simple:
  sudo pacman -S --noconfirm python python-pip python-virtualenv gdal

Moderate:
  sudo pacman -S --noconfirm nodejs npm
  (if version too old: use nvm approach as above)

Complex (Docker):
  sudo pacman -S --noconfirm docker docker-compose
  sudo systemctl enable docker --now
  sudo usermod -aG docker $USER
  newgrp docker
```

### macOS (brew)

```
All:
  brew install python@3.12 node@20 gdal
  brew install --cask docker
  (follow Docker Desktop setup prompts)
```

## C3 — After Installation

After each successful installation:
- Re-check the tool version
- Confirm it meets the minimum version
- Update the audit display

After all installations:
- Display final audit summary
- If Docker was installed, remind user: "You may need to log out and back in for Docker group permissions to take effect."

---

# Phase D — File Generation

## D0 — Pre-Generation Checks

Before creating any files:
1. Check if `platform/` directory exists. If it, `backend/`, and `frontend/` exist at root level, move them into `platform/`.
2. If `platform/backend/config/settings/base.py` already exists, this is a re-run. Ask: "Bootstrap files already exist. Skip generation and go to verification? [Y/n]" (If no, regenerate, overwriting existing files.)

## D1 — Directory Structure

Create the following directory structure under the project root. Do not create `platform/docker/` if it is being consolidated into root-level config files.

```
platform/
  backend/
    config/
      settings/
        __init__.py
        base.py
        development.py
        production.py
      __init__.py
      wsgi.py
      asgi.py
      urls.py
      celery.py
    Dockerfile
    requirements.txt
    manage.py
    .env.example

  frontend/
    src/
      theme.ts
      App.tsx
      main.tsx
      vite-env.d.ts
    public/
    index.html
    package.json
    vite.config.ts
    tsconfig.json
    tsconfig.node.json
    Dockerfile
    .eslintrc.cjs
    .prettierrc

scripts/
  verify-bootstrap.sh

(Existing directories to move into platform/ if they exist at root:
 backend/ → platform/backend/
 frontend/ → platform/frontend/
 docker/ → platform/docker/)
```

Root-level files to create:
```
.gitignore
.pre-commit-config.yaml
ruff.toml
mypy.ini
```

## D2 — File Contents

### Root `.gitignore`

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
*.egg-info/
dist/
build/
.eggs/
*.egg
.venv/
venv/
env/

# Django
*.log
local_settings.py
db.sqlite3
media/
staticfiles/
static/

# Node
node_modules/
dist/
build/
.cache/

# TypeScript
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml

# Testing
.coverage
htmlcov/
.pytest_cache/
coverage.xml
```

### Root `.pre-commit-config.yaml`

Implement the content now by reading the tech stack from Phase A and using ruff, eslint, prettier configurations. Do NOT hardcode generic template; adapt based on extracted tech stack.

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=10000']
      - id: detect-private-key

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.11.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.15.0
    hooks:
      - id: mypy
        args: [--config-file=mypy.ini]
        additional_dependencies:
          - django-stubs
          - djangorestframework-stubs
          - types-redis
        pass_filenames: false
        files: ^platform/backend/

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.23.0
    hooks:
      - id: eslint
        files: \.(js|jsx|ts|tsx)$
        args: [--fix]
        additional_dependencies:
          - eslint
          - '@typescript-eslint/parser'
          - '@typescript-eslint/eslint-plugin'
          - eslint-plugin-react
          - eslint-plugin-react-hooks
          - eslint-config-prettier

  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        files: \.(js|jsx|ts|tsx|css|json|md|yaml|yml)$
```

### Root `ruff.toml`

```toml
target-version = "py312"

line-length = 100

[lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "N",   # pep8-naming
    "UP",  # pyupgrade
    "B",   # flake8-bugbear
    "SIM", # flake8-simplify
    "C4",  # flake8-comprehensions
]
ignore = []

[format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"

[lint.isort]
known-first-party = ["config", "users", "resources", "metadata", "attachments", "permissions", "publishing", "visualization", "search", "jobs"]
```

### Root `mypy.ini`

```ini
[mypy]
python_version = 3.12
warn_return_any = True
warn_unused_configs = True
warn_unused_ignores = True
disallow_untyped_defs = True
disallow_incomplete_defs = True
check_untyped_defs = True
no_implicit_optional = True
strict_optional = True
warn_redundant_casts = True
warn_no_return = True

[mypy.plugins.django-stubs]
django_settings_module = config.settings.base

[mypy-*.migrations.*]
ignore_errors = True

[mypy-celery.*]
ignore_missing_imports = True

[mypy-gdal.*]
ignore_missing_imports = True

[mypy-boto3.*]
ignore_missing_imports = True
```

### `platform/backend/manage.py`

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
```

### `platform/backend/requirements.txt`

Implement the content now by reading the tech stack from Phase A and using the list of Python packages extracted from the documentation.

```text
Django>=5.0,<5.1
djangorestframework>=3.15,<3.16
django-cors-headers>=4.4,<5.0
django-environ>=0.11,<0.12
django-storages>=1.14,<2.0
django-filter>=24.1,<25.0
drf-spectacular>=0.28,<1.0
django-extensions>=3.2,<4.0

psycopg2-binary>=2.9,<3.0
celery[redis]>=5.4,<6.0
redis>=5.2,<6.0
argon2-cffi>=23.1,<24.0
boto3>=1.35,<2.0
Pillow>=11.0,<12.0

# GDAL is provided by system python3-gdal, not pip

```

### `platform/backend/.env.example`

```
# Django
DJANGO_SECRET_KEY=change-me-to-a-random-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://platform:platform@localhost:5432/platform

# Redis
REDIS_URL=redis://localhost:6379/0

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1

# Email (development uses console backend)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Object Storage (development uses local filesystem)
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_ENDPOINT_URL=http://localhost:9000

# GeoServer
GEOSERVER_URL=http://localhost:8080/geoserver
GEOSERVER_USER=admin
GEOSERVER_PASSWORD=geoserver

# Frontend
FRONTEND_URL=http://localhost:5173
```

### `platform/backend/config/__init__.py` — blank file

### `platform/backend/config/settings/__init__.py` — blank file

### `platform/backend/config/settings/base.py`

```python
import os
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", default="insecure-development-key")

DEBUG = env.bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",

    # Third party
    "rest_framework",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "storages",

    # Local apps
    "users",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": env.db_url("DATABASE_URL", default="postgres://platform:platform@localhost:5432/platform")
}
DATABASES["default"]["ENGINE"] = "django.contrib.gis.db.backends.postgis"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

# DRF
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}

# CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["http://localhost:5173"])
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=["http://localhost:5173"])

# Celery
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://localhost:6379/1")
CELERY_RESULT_BACKEND = env("CELERY_BROKER_URL", default="redis://localhost:6379/1")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# S3 / MinIO
USE_S3 = env.bool("USE_S3", default=False)
if USE_S3:
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
        },
    }
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_ENDPOINT_URL = env("AWS_S3_ENDPOINT_URL", default="http://localhost:9000")
    AWS_S3_USE_SSL = env.bool("AWS_S3_USE_SSL", default=False)

# GeoServer
GEOSERVER_URL = env("GEOSERVER_URL", default="http://localhost:8080/geoserver")
GEOSERVER_USER = env("GEOSERVER_USER", default="admin")
GEOSERVER_PASSWORD = env("GEOSERVER_PASSWORD", default="geoserver")

# Password hashing
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
]

# Session configuration
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_AGE = 1800  # 30 minutes default
CSRF_COOKIE_HTTPONLY = False  # SPA needs JS access
CSRF_COOKIE_SAMESITE = "Lax"

# Password reset
PASSWORD_RESET_TIMEOUT = 86400  # 24 hours

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "auth.security": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
```

### `platform/backend/config/settings/development.py`

```python
from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

INSTALLED_APPS += [  # noqa: F405
    "django_extensions",
]

CORS_ALLOW_ALL_ORIGINS = True
```

### `platform/backend/config/settings/production.py`

```python
from .base import *  # noqa: F403

DEBUG = False

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")  # noqa: F405

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
```

### `platform/backend/config/wsgi.py`

```python
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")

application = get_wsgi_application()
```

### `platform/backend/config/asgi.py`

```python
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")

application = get_asgi_application()
```

### `platform/backend/config/urls.py`

```python
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
```

### `platform/backend/config/celery.py`

```python
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("platform")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

### `platform/backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gdal-bin \
    libgdal-dev \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -u 1000 django && chown -R django:django /app
USER django

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### `platform/frontend/package.json`

```json
{
  "name": "geospatial-platform-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\""
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "@mui/material": "^5.16.0",
    "@mui/icons-material": "^5.16.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.60.0",
    "cesium": "^1.123.0",
    "potree-core": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0",
    "eslint": "^9.16.0",
    "@typescript-eslint/parser": "^8.18.0",
    "@typescript-eslint/eslint-plugin": "^8.18.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.4.0"
  }
}
```

### `platform/frontend/vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

### `platform/frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### `platform/frontend/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["vite.config.ts"]
}
```

### `platform/frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GeoSpatial Resource Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `platform/frontend/src/main.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### `platform/frontend/src/App.tsx`

```typescript
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>GeoSpatial Resource Platform</h1>
            <p>Platform bootstrapped successfully.</p>
          </div>
        }
      />
    </Routes>
  );
}
```

### `platform/frontend/src/theme.ts`

```typescript
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#388e3c",
      light: "#4caf50",
      dark: "#2e7d32",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
});

export default theme;
```

### `platform/frontend/src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```

### `platform/frontend/.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/prop-types": "off",
  },
};
```

### `platform/frontend/.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

### `platform/frontend/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

### `platform/docker/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: platform
      POSTGRES_USER: platform
      POSTGRES_PASSWORD: platform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U platform"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  geoserver:
    image: kartoza/geoserver:2.25.0
    ports:
      - "8080:8080"
    environment:
      GEOSERVER_ADMIN_USER: admin
      GEOSERVER_ADMIN_PASSWORD: geoserver
    volumes:
      - geoserver_data:/opt/geoserver/data_dir
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "curl -f -u admin:geoserver http://localhost:8080/geoserver/rest/about/version.xml"]
      interval: 10s
      timeout: 10s
      retries: 10
      start_period: 60s

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 5

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"
      - "8025:8025"
    healthcheck:
      test: ["CMD", "true"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    command: python manage.py runserver 0.0.0.0:8000
    ports:
      - "8000:8000"
    volumes:
      - ../backend:/app
    env_file:
      - ../backend/.env.example
    environment:
      DATABASE_URL: postgres://platform:platform@postgres:5432/platform
      REDIS_URL: redis://redis:6379/0
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "python -c \"import urllib.request; r=urllib.request.urlopen('http://localhost:8000/admin/login/'); exit(0) if r.getcode()==200 else exit(1)\""]
      interval: 10s
      timeout: 5s
      retries: 5

  celery:
    build:
      context: ../backend
      dockerfile: Dockerfile
    command: celery -A config worker -l info
    volumes:
      - ../backend:/app
    env_file:
      - ../backend/.env.example
    environment:
      DATABASE_URL: postgres://platform:platform@postgres:5432/platform
      REDIS_URL: redis://redis:6379/0
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ../frontend:/app
      - /app/node_modules
    depends_on:
      backend:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
  geoserver_data:
  minio_data:
```

### `scripts/verify-bootstrap.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0
skip=0

check() {
    local name="$1"
    local url="$2"
    local expected="$3"
    echo -n "  $name ... "
    if ! command -v curl &>/dev/null; then
        echo -e "${YELLOW}SKIP (curl missing)${NC}"
        ((skip++))
        return
    fi
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
    if [[ "$response" == "$expected" ]] || [[ "$response" -ge 200 && "$response" -lt 400 && "$expected" == "2xx" ]]; then
        echo -e "${GREEN}OK ($response)${NC}"
        ((pass++))
    else
        echo -e "${RED}FAIL ($response, expected $expected)${NC}"
        ((fail++))
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "              BOOTSTRAP VERIFICATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Docker services
echo "Docker Services:"
check "PostgreSQL  " "http://localhost:5432"    "000"   # raw TCP, curl gets 000 but it's healthy
check "Redis       " "http://localhost:6379"    "000"
check "GeoServer   " "http://localhost:8080/geoserver/" "2xx"
check "MinIO       " "http://localhost:9000/minio/health/live" "200"
check "Mailhog     " "http://localhost:8025/"   "2xx"
# Backend
check "Django API  " "http://localhost:8000/api/auth/session/" "2xx"
check "Django Admin" "http://localhost:8000/admin/" "200"
# Frontend
check "Vite Dev    " "http://localhost:5173/"    "2xx"

echo ""
echo "───────────────────────────────────────────────────────────"
echo -e "  ${GREEN}Passed: $pass${NC}  ${RED}Failed: $fail${NC}  ${YELLOW}Skipped: $skip${NC}"
echo "───────────────────────────────────────────────────────────"

if [ "$fail" -gt 0 ]; then
    exit 1
fi
```

## D3 — Update Milestones.md

After all files are generated, update `docs/project/planning/milestones.md` to add Phase B under Milestone 0:

Add a `## Phase B — Platform Bootstrap` section with completion criteria. Mark items as complete as they are achieved during this bootstrapping run.

The Phase B section should include these completion criteria (mark each with ✓ or ☐ depending on success):

```
### Phase B — Platform Bootstrap

Goal: Scaffold the complete platform development environment with all technologies.

#### Backend Scaffold
- [ ] Django project created at platform/backend/
- [ ] Settings split (base / development / production)
- [ ] requirements.txt with all dependencies
- [ ] .env.example with all service credentials
- [ ] manage.py check passes (0 errors)

#### Frontend Scaffold
- [ ] Vite + React + TypeScript project at platform/frontend/
- [ ] Material UI v5 with theme configuration
- [ ] Vite proxy configured for /api/ → Django
- [ ] npm run build succeeds

#### Docker Infrastructure
- [ ] docker-compose.yml with 8 services
- [ ] Dockerfile for backend (Python 3.12)
- [ ] Dockerfile for frontend (Node 20)

#### Developer Tooling
- [ ] .gitignore (Python, Node, Docker, IDE)
- [ ] ruff.toml configured
- [ ] mypy.ini configured
- [ ] .eslintrc.cjs configured
- [ ] .prettierrc configured
- [ ] pre-commit hooks configured

#### Verification
- [ ] verify-bootstrap.sh passes all health checks
- [ ] All docker-compose services healthy
- [ ] Django admin accessible
- [ ] Frontend dev server serves
- [ ] API proxy routes correctly
```

---

# Phase E — Verification

## E1 — Install Python Dependencies

If Python is available:
1. Create a virtual environment: `python3 -m venv platform/backend/.venv`
2. Activate it and install: `pip install -r platform/backend/requirements.txt`
3. Run Django checks: `python platform/backend/manage.py check`
4. Report pass/fail

If Python is NOT available: skip and note which verifications were skipped.

## E2 — Install Frontend Dependencies

If Node is available:
1. Run: `npm install` in `platform/frontend/`
2. Run: `npm run build`
3. Report pass/fail

If Node is NOT available: skip and note which verifications were skipped.

## E3 — Docker Verification

If Docker is available:
1. Run: `docker compose -f platform/docker/docker-compose.yml up -d`
2. Wait for health checks (with timeout)
3. Run: `bash scripts/verify-bootstrap.sh`
4. Report results
5. If all pass: "All services running. Platform is ready for development."

If Docker is NOT available:
- Display: "Docker verification skipped. Install Docker and re-run /bootstrap."
- Run individual verifications for Python and Node (if available) separately.

---

# Phase F — Memory Update

After all phases complete, update:

### `.ai-memory/current-state.md`
Add a bootstrapping section recording:
- Date of bootstrap
- Which prerequisites were installed
- Which verifications passed/skipped
- Current bootstrap status

### `docs/project/planning/milestones.md`
Mark Phase B items as complete (✓) or skipped (☐) based on verification results.

---

# Completion Criteria

The command is complete when:

- [ ] Tech stack displayed and confirmed by user
- [ ] Environment audited
- [ ] Missing prerequisites handled (installed or acknowledged as skipped)
- [ ] All scaffold files generated
- [ ] Milestones.md updated with Phase B status
- [ ] Verification run for all available tools
- [ ] AI memory updated

The bootstrap is considered **fully complete** only when all services pass health checks. Until then, the platform is in a "partially bootstrapped" state — files exist but some services are not verified.

---

# Failure Handling

If any phase fails:
- Do not continue silently
- Report: phase that failed, reason, what is incomplete
- Allow user to fix the issue and re-run `/bootstrap`
- Re-running is safe — file generation is idempotent

---

# Document Preservation Rules

- Never modify architecture docs during bootstrapping
- The tech stack is extracted from docs, not the other way around
- If the tech stack in docs is insufficient or ambiguous, flag it and ask the user to update the docs first
- This command generates configuration FROM documentation — it does not create or modify design decisions

---

# Golden Rule

**The bootstrap reflects the architecture. The architecture does not reflect the bootstrap.** If you want a different tech stack, change the architecture docs and re-run.
