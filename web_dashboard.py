from __future__ import annotations

from typing import Dict, List

from marker_media_agents import AGENT_CLASSES, MasterOrchestrator


def get_agent_catalog() -> List[Dict[str, object]]:
    catalog: List[Dict[str, object]] = []
    for agent_cls in AGENT_CLASSES:
        instance = agent_cls()
        catalog.append(
            {
                "name": instance.name,
                "mission": instance.mission,
                "kpis": instance.kpis,
                "responsibilities": instance.responsibilities,
            }
        )
    return catalog


def route_task_payload(task: str) -> Dict[str, object]:
    orchestrator = MasterOrchestrator()
    selected_agent_cls = orchestrator.route_task(task)
    selected_instance = selected_agent_cls()
    return {
        "task": task,
        "selected_agent": selected_instance.name,
        "mission": selected_instance.mission,
        "responsibilities": selected_instance.responsibilities,
        "kpis": selected_instance.kpis,
        "prompt": selected_instance.prompt,
    }


if __name__ == "__main__":
    print("Marker Media Agent Dashboard ready")
