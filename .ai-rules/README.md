# AI Rules System

Version:

1.0


Purpose:

Define the instruction hierarchy used by all AI agents working on this project.

AI agents must load the appropriate rules before performing work.

---

# Rule Hierarchy

Rules are organized in layers:

Organization Rules

↓

Team Rules

↓

Project Rules

↓

Task Rules


---

# Organization Rules

Location:


.ai-rules/organization/


Purpose:

Define company-wide AI behavior.

Examples:

- reasoning standards
- documentation requirements
- workflow compliance
- decision boundaries

These rules apply to every agent.

---

# Team Rules

Location:


.ai-rules/team/


Purpose:

Define engineering department conventions.

Examples:

- coding standards
- architecture practices
- review expectations
- testing approaches

---

# Project Rules

Location:


.ai-rules/project/


Purpose:

Define rules specific to the GeoSpatial Resource Platform.

Examples:

- domain rules
- technology decisions
- GIS conventions
- resource model constraints

---

# Testing Rules

Location:


.ai-rules/testing/


Purpose:

Define verification standards.

Examples:

- acceptance testing
- regression testing
- test coverage expectations
- validation workflow

---

# Security Rules

Location:


.ai-rules/security/


Purpose:

Define security expectations.

Examples:

- secrets handling
- permissions
- authentication
- data protection

---

# Agent Loading Order

Every agent should load:

Organization rules
Team rules
Project rules
Task-specific rules

---

# Rule Ownership

| Rule Type | Owner |
|-|-|
| Organization | Project Director |
| Team | Engineering Lead |
| Project | Solution Architect |
| Testing | QA Lead |
| Security | Security Reviewer |

---

# Rule Change Process

Rules should not change casually.

A rule change requires:

1. Reason for change

2. Impact evaluation

3. Documentation

4. Version update


---

# Golden Rule

Rules define behavior.

Documentation defines knowledge.

Memory defines history.

Do not mix them.