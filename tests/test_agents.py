from marker_media_agents import (
    Agent,
    MasterOrchestrator,
    ClientRelationsAgent,
    OperationsManagerAgent,
    CreativeLeadAgent,
    PhotographerVideographerAgent,
    SeniorEditorAgent,
    MarketingClientAcquisitionAgent,
    FinancialManagementAgent,
    SocialMediaContentAgent,
)
from web_dashboard import get_agent_catalog, route_task_payload


def test_master_orchestrator_routes_by_stage():
    orchestrator = MasterOrchestrator()
    assert orchestrator.route_task("new lead inquiry") == ClientRelationsAgent
    assert orchestrator.route_task("booking confirmation") == OperationsManagerAgent
    assert orchestrator.route_task("shoot day execution") == PhotographerVideographerAgent
    assert orchestrator.route_task("first edit") == SeniorEditorAgent
    assert orchestrator.route_task("social media posting") == SocialMediaContentAgent
    assert orchestrator.route_task("finance invoice") == FinancialManagementAgent


def test_agents_have_required_metadata():
    for agent in [
        ClientRelationsAgent,
        OperationsManagerAgent,
        CreativeLeadAgent,
        PhotographerVideographerAgent,
        SeniorEditorAgent,
        MarketingClientAcquisitionAgent,
        FinancialManagementAgent,
        SocialMediaContentAgent,
    ]:
        instance = agent()
        assert isinstance(instance, Agent)
        assert instance.name
        assert instance.mission
        assert instance.prompt
        assert instance.kpis
        assert instance.responsibilities


def test_dashboard_catalog_and_routing():
    catalog = get_agent_catalog()
    assert catalog[0]["name"] == "Master Orchestrator"
    assert len(catalog) == 9

    payload = route_task_payload("new lead inquiry")
    assert payload["selected_agent"] == "Client Relations Agent"
    assert payload["task"] == "new lead inquiry"
