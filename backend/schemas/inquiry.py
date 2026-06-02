from pydantic import BaseModel, EmailStr


class InquiryRequest(BaseModel):
    name: str
    company: str | None = None
    email: EmailStr
    phone: str | None = None
    country: str | None = None
    customerType: str
    productInterest: str
    projectSize: str | None = None
    message: str


class InquiryResponse(BaseModel):
    success: bool
    message: str
