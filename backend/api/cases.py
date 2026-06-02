from fastapi import APIRouter

from schemas.case import ApplicationScenario
from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["cases"])


@router.get("/cases", response_model=list[ApplicationScenario])
def list_cases() -> list[ApplicationScenario]:
    return [
        ApplicationScenario.model_validate(item)
        for item in load_json_file("cases.json")
    ]
