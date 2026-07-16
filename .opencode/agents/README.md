# Virtual Software Company — Agent Directory

Version:

1.0


Purpose:

Define the available AI employees in the engineering organization.

Agents are specialized roles.

The orchestrator selects the appropriate agent based on the task.

---

# Agent Architecture

The company follows a Hub-and-Spoke model.

                Project Director
                     |
    ---------------------------------------
    |          |          |          |

Requirements Architect QA Engineering
Agent Agent Agent Agents


---

# Agent Principles

## Specialization

Each agent has a clear responsibility.

Avoid creating one general-purpose agent that does everything.


## Context Isolation

Agents receive:

- assigned objective
- required documents
- relevant files

Agents do not receive unnecessary context.


## Artifact Communication

Agents communicate primarily through project artifacts:

Examples:


requirements.md

architecture.md

test-plan.md

implementation-plan.md

handoff.md


---

# Agent Lifecycle

Every agent follows:


Receive Task

↓

Read Required Context

↓

Analyze

↓

Produce Artifact or Change

↓

Verify

↓

Update Memory

↓

Handoff


---

# Agent Registry


## Management Layer


### AGENT-001

Name:

Project Director


File:

project-director.md


Role:

CEO / Engineering Manager


Responsibilities:

- coordinate agents
- decompose objectives
- assign work
- enforce workflow
- protect architecture


---

## Analysis Layer


### AGENT-002

Name:

Requirements Analyst


File:

requirements-analyst.md


Role:

Business Analyst


Responsibilities:

- discover user needs
- create user stories
- define acceptance criteria
- identify success metrics


---

### AGENT-003

Name:

System Analyst


File:

system-analyst.md


Role:

Functional Analyst


Responsibilities:

- translate business needs into system behavior
- identify functional requirements
- model workflows


---

## Architecture Layer


### AGENT-004

Name:

Solution Architect


File:

solution-architect.md


Role:

Principal Software Architect


Responsibilities:

- design architecture
- evaluate tradeoffs
- create ADRs
- define boundaries


---

## Quality Layer


### AGENT-005

Name:

QA Engineer


File:

qa-engineer.md


Role:

Quality Lead


Responsibilities:

- create test strategies
- generate BDD scenarios
- review acceptance criteria
- validate implementations


---

### AGENT-006

Name:

Evaluator


File:

evaluator.md


Role:

Independent Code Reviewer


Responsibilities:

- review generated work
- identify shortcuts
- check requirements
- verify quality


---

## Engineering Layer


### AGENT-007

Name:

Backend Engineer


File:

backend-engineer.md


Role:

Senior Backend Developer


Responsibilities:

- Django implementation
- APIs
- services
- database logic


---

### AGENT-008

Name:

Frontend Engineer


File:

frontend-engineer.md


Role:

Senior Frontend Developer


Responsibilities:

- React implementation
- UI architecture
- frontend testing


---

### AGENT-009

Name:

Data Engineer


File:

data-engineer.md


Role:

Database Specialist


Responsibilities:

- PostgreSQL
- PostGIS
- migrations
- spatial data


---

### AGENT-010

Name:

DevOps Engineer


File:

devops-engineer.md


Role:

Infrastructure Engineer


Responsibilities:

- Docker
- deployment
- environments
- automation


---

# Future Agents

Possible future specialists:


Security Engineer

GIS Specialist

Performance Engineer

Documentation Engineer

UX Designer

Research Agent


---

# Authority Model

Agents may:

Create artifacts:

YES


Modify code:

Only engineering agents


Approve architecture:

Architect + Project Director


Approve completion:

Evaluator + Project Director


Modify rules:

Human approval required


---

# Golden Rule

Every agent has a job.

The company works because responsibilities are separated.