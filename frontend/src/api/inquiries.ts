import { apiFetch } from './client';

export type InquiryPayload = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  customerType: string;
  productInterest: string;
  projectSize?: string;
  message: string;
};

export type InquiryResponse = {
  success: boolean;
  message: string;
};

export function sendInquiry(payload: InquiryPayload) {
  return apiFetch<InquiryResponse>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
