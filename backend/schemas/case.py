from pydantic import BaseModel


class ApplicationScenario(BaseModel):
    id: str
    kind: str
    title: str
    audience: str
    summary: str
    image: str
    imageFallback: str
    recommendedProducts: list[str]
    keyPoints: list[str]
