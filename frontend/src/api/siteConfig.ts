import { apiFetch } from './client';
import type { SiteConfig } from '../types/site';

export function fetchSiteConfig() {
  return apiFetch<SiteConfig>('/site-config');
}
