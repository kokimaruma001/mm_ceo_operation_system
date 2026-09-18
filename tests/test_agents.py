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
