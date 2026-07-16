# AI Memory System

Version:

1.0


Purpose:

Provide persistent memory between AI agent sessions.

AI agents are stateless.

This memory system preserves project continuity.

---

# Memory Philosophy

The AI company separates:


Knowledge

↓

Current State

↓

History

↓

Lessons


Each has a different purpose.

---

# Memory Files

## current-state.md

Purpose:

"What is true right now"


Contains:

- current architecture state
- active implementation status
- known limitations
- important context


Updated:

Frequently


Owner:

Lead Agent

---

## handoff.md

Purpose:

"How the next agent continues"


Written before ending a session.

Contains:

- completed work
- unfinished work
- blockers
- next recommended action


Every working agent should update it.

---

## decisions.md

Purpose:

"Important decisions made"


Contains:

- technical decisions
- rejected alternatives
- reasons
- consequences


Major decisions should become ADRs.

---

## errors.md

Purpose:

"What mistakes should never happen again"


Contains:

- repeated failures
- root causes
- prevention rules


Example:

Problem:

Multiple UI pages duplicated loading logic.


Solution:

Use shared AsyncState component.


---

## lessons-learned.md

Purpose:

"Experience gained"


Contains:

- successful approaches
- failed approaches
- workflow improvements

---

# Memory Rules

## Rule 1

Never store temporary conversation text.

Store knowledge.

---

## Rule 2

Memory should be compressed.

Bad:

"Agent spent 4 hours debugging..."


Good:

"PostGIS migration failed because extension was missing."

---

## Rule 3

Facts belong elsewhere.

Do not store:

- architecture facts
- requirements
- coding standards

in memory.

Store them in:


docs/project/

.ai-rules/


---

## Rule 4

Memory Updates Are Required

Before ending a meaningful session:

Update:


handoff.md


---

# Agent Startup Sequence

When an agent starts:

Read:

ENGINEERING_GUIDE.md
.company/
.ai-rules/
docs/project/
.ai-memory/

---

# Agent Shutdown Sequence

Before finishing:

1. Update current state.

2. Record decisions.

3. Record errors.

4. Write handoff.

5. Identify next action.

---

# Memory Quality Rule

The next agent should understand the project without reading the previous agent's conversation.