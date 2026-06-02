from fastapi import APIRouter

from schemas.inquiry import InquiryRequest, InquiryResponse


router = APIRouter(prefix="/api", tags=["inquiries"])


@router.post("/inquiries", response_model=InquiryResponse)
def create_inquiry(payload: InquiryRequest) -> InquiryResponse:
    return InquiryResponse(success=True, message="Inquiry received")
