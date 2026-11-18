import type {
  OrganData,
  OrganId,
  DiseaseRecord,
  QuizQuestion,
  SearchResults,
} from '../types/anatomy';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchOrgans(category = 'all'): Promise<OrganData[]> {
  const qs = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  const data = await fetchJson<{ organs: OrganData[] }>(`/api/organs${qs}`);
  return data.organs;
}

export async function fetchOrganById(id: OrganId): Promise<OrganData> {
  const data = await fetchJson<{ organ: OrganData }>(`/api/organs/${encodeURIComponent(id)}`);
  return data.organ;
}

export async function fetchDiseases(organId = 'all'): Promise<DiseaseRecord[]> {
  const qs = organId && organId !== 'all' ? `?organId=${encodeURIComponent(organId)}` : '';
  const data = await fetchJson<{ diseases: DiseaseRecord[] }>(`/api/diseases${qs}`);
  return data.diseases;
}

export async function fetchOrganDiseases(organId: OrganId): Promise<DiseaseRecord[]> {
  const data = await fetchJson<{ diseases: DiseaseRecord[] }>(
    `/api/organs/${encodeURIComponent(organId)}/diseases`,
  );
  return data.diseases;
}

export async function searchAnatomyApi(query: string): Promise<SearchResults> {
  const data = await fetchJson<SearchResults>(
    `/api/search?q=${encodeURIComponent(query)}`,
  );
  return data;
}

export async function fetchQuizzes(
  category = 'All',
  organId = 'all',
): Promise<QuizQuestion[]> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (organId && organId !== 'all') params.set('organId', organId);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchJson<{ questions: QuizQuestion[] }>(`/api/quizzes${qs}`);
  return data.questions;
}
