from pydantic import BaseModel


class BrandConfig(BaseModel):
    name: str
    logoMark: str
    tagline: str


class ContactConfig(BaseModel):
    emailMain: str
    phone: str
    phoneRaw: str
    address: str
    alibabaUrl: str


class SiteConfig(BaseModel):
    brand: BrandConfig
    contact: ContactConfig
    certifications: list[str]
