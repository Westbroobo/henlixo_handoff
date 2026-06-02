from pydantic import BaseModel


class ProductSpec(BaseModel):
    label: str
    value: str


class Product(BaseModel):
    sku: str
    name: str
    family: str
    subType: str
    application: list[str]
    tier: str
    featured: bool = False
    tagline: str
    intro: str
    image: str
    imageFallback: str
    specs: list[ProductSpec]
    features: list[str]
    accessories: list[str] = []
    leadTime: str
    moq: str
    ctaLabel: str = "Inquire via WhatsApp"
