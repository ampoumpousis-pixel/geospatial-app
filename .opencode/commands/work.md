# Command: Work

Version:

2.0

Command ID:

CMD-101


# Purpose

Universal entry point for all engineering interactions.

The user does not need to decide whether a request is:

- feature
- task
- bug
- question
- discussion
- operational change
- research

This command delegates the request to:

AGENT-101 — Work Intake


# Core Rule

This command does not make decisions.

It does not classify.

It does not analyze.

It does not plan.

It only activates the correct agent.


# Execution

When invoked:

1. Activate AGENT-101 — Work Intake.

2. Pass the user's request unchanged.

3. Allow AGENT-101 to classify and route the request.

4. Return the Work Summary produced by AGENT-101.


# Forbidden Actions

This command MUST NOT:

- classify requests
- read project documents
- create tasks
- create features
- modify files
- suggest implementation


# User Examples
/work Add raster preview

/work Explain Django serializers

/work Create a folder for tests

/work Search fails with Greek filenames

/work Should we use Celery?



# Completion

The command is complete when:

AGENT-101 has produced a valid Work Summary or requested clarification.


# Golden Rule

The command opens the engineering workflow.

The Work Intake Agent decides where the work goes.