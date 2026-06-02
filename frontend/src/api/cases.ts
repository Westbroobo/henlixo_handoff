import { apiFetch } from './client';
import type { ApplicationScenario } from '../types/case';

export function fetchCases() {
  return apiFetch<ApplicationScenario[]>('/cases');
}
