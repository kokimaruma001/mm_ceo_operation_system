from __future__ import annotations

import argparse
from typing import Type

from marker_media_agents import Agent, AGENT_CLASSES, MasterOrchestrator


def list_agents() -> None:
    print("Available Marker Media agents:")
    for idx, agent_cls in enumerate(AGENT_CLASSES, start=1):
        print(f"{idx}. {agent_cls.name}")


def route_task(task: str) -> Type[Agent]:
    orchestrator = MasterOrchestrator()
    return orchestrator.route_task(task)


def show_agent_details(agent_cls: Type[Agent]) -> None:
    instance = agent_cls()
    print(f"Agent: {instance.name}")
    print(f"Mission: {instance.mission}")
    print("Responsibilities:")
    for responsibility in instance.responsibilities:
        print(f"- {responsibility}")
    print("KPIs:")
    for kpi in instance.kpis:
        print(f"- {kpi}")
    print("\nDeployment Prompt:")
    print(instance.prompt)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Route client tasks to the right Marker Media agent.")
    parser.add_argument("--list", action="store_true", help="List all agents in the system.")
    parser.add_argument("--task", type=str, help="Describe the task to route through the Master Orchestrator.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.list:
        list_agents()
        return

    if not args.task:
        parser.print_help()
        return

    agent_cls = route_task(args.task)
    print(f"Task: {args.task}")
    print(f"Selected agent: {agent_cls.name}")
    print("\n--- Agent details ---")
    show_agent_details(agent_cls)


if __name__ == "__main__":
    main()
