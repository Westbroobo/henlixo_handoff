import { apiFetch } from './client';
import type { SocialPayload } from '../types/site';

export function fetchSocial() {
  return apiFetch<SocialPayload>('/social');
}
