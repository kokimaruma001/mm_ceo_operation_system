# Marker Media Agent System

A Python-based multi-agent operating system for Marker Media, built from the document "Marker Media Agent System".

This project implements the Master Orchestrator and the nine specialist agents defined in the client journey and operating playbook.

## Included agents

1. Master Orchestrator
2. Client Relations Agent
3. Operations Manager Agent
4. Creative Lead Agent
5. Photographer/Videographer Agent
6. Senior Editor Agent
7. Marketing & Client Acquisition Agent
8. Financial Management Agent
9. Social Media & Content Agent

## Project structure

- `marker_media_agents.py` — core agent definitions, mission statements, prompts, KPIs, and routing logic
- `agent_cli.py` — terminal interface for listing agents and routing tasks
- `web_dashboard.py` — dashboard-facing payload helpers
- `app.py` — Flask web dashboard
- `tests/test_agents.py` — validation tests for routing and metadata

## Setup

From the project root:

```bash
python -m venv .venv
.venv\Scripts\activate
python -m pip install -U pip
python -m pip install flask pytest
```

## Run the terminal CLI

```bash
.venv\Scripts\python.exe agent_cli.py --list
.venv\Scripts\python.exe agent_cli.py --task "new lead inquiry"
```

## Run the dashboard

```bash
.venv\Scripts\python.exe app.py
```

Then open:

```text
http://127.0.0.1:5000/
```

## How routing works

The Master Orchestrator evaluates a task description and routes it to the most relevant specialist agent based on keywords such as:

- inquiry / lead / proposal -> Client Relations Agent
- booking / contract / deposit / pre-shoot -> Operations Manager Agent
- shoot / footage / location -> Photographer/Videographer Agent
- edit / raw / proof / gallery -> Senior Editor Agent
- marketing / outreach / pitch -> Marketing & Client Acquisition Agent
- finance / invoice / payment -> Financial Management Agent
- social / content / calendar / post -> Social Media & Content Agent

## Validation

Run tests with:

```bash
.venv\Scripts\python.exe -m pytest -q
```

## Notes

This is a structured starter implementation based on the Marker Media specification and is designed to be extended for real CRM, Notion, Gmail, Google Drive, and finance integrations.
