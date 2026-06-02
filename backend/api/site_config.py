from fastapi import APIRouter

from schemas.site_config import SiteConfig
from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["site-config"])


@router.get("/site-config", response_model=SiteConfig)
def get_site_config() -> SiteConfig:
    return SiteConfig.model_validate(load_json_file("site-config.json"))
