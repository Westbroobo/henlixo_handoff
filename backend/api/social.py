from typing import Any

from fastapi import APIRouter

from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["social"])


@router.get("/social")
def get_social() -> dict[str, Any]:
    return load_json_file("social.json")
