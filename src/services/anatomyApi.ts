
import {
  ORGANS_DATA,
  DISEASES_DATA,
  QUIZZES_DATA,
} from '../../server/data/index';

import type {
  OrganData,
  OrganId,
  DiseaseRecord,
  QuizQuestion,
  SearchResults,
} from '../types/anatomy';

// Get all organs or filter by category
export async function fetchOrgans(
  category = 'all'
): Promise<OrganData[]> {
  const normalized = category.trim().toLowerCase();

  if (!normalized || normalized === 'all') {
    return ORGANS_DATA;
  }

  return ORGANS_DATA.filter(
    organ => organ.category === normalized
  );
}

// Get an individual organ
export async function fetchOrganById(
  id: OrganId
): Promise<OrganData> {
  const organ = ORGANS_DATA.find(
    item => item.id === id
  );

  if (!organ) {
    throw new Error(`Organ '${id}' not found`);
  }

  return organ;
}

// Get diseases, optionally filtered by organ
export async function fetchDiseases(
  organId = 'all'
): Promise<DiseaseRecord[]> {
  if (!organId || organId === 'all') {
    return DISEASES_DATA;
  }

  return DISEASES_DATA.filter(
    disease => disease.organId === organId
  );
}

// Get diseases associated with an organ
export async function fetchOrganDiseases(
  organId: OrganId
): Promise<DiseaseRecord[]> {
  return DISEASES_DATA.filter(
    disease => disease.organId === organId
  );
}

// Search organs, anatomical parts and diseases
export async function searchAnatomyApi(
  query: string
): Promise<SearchResults> {
  const q = query.trim().toLowerCase();

  if (!q) {
    return {
      query: '',
      organs: [],
      parts: [],
      diseases: [],
    };
  }

  const organs = ORGANS_DATA.filter(
    organ =>
      organ.name.toLowerCase().includes(q) ||
      organ.system.toLowerCase().includes(q) ||
      organ.category.toLowerCase().includes(q) ||
      organ.poeticSubtitle.toLowerCase().includes(q) ||
      organ.relatedSystems.some(
        system => system.toLowerCase().includes(q)
      ) ||
      organ.tagline.toLowerCase().includes(q)
  ).map(organ => ({
    id: organ.id,
    name: organ.name,
    system: organ.system,
    tagline: organ.tagline,
  }));

  const parts: SearchResults['parts'] = [];

  for (const organ of ORGANS_DATA) {
    for (const part of organ.parts) {
      if (
        part.name.toLowerCase().includes(q) ||
        part.parentDivision.toLowerCase().includes(q) ||
        part.functionSummary.toLowerCase().includes(q) ||
        part.location.toLowerCase().includes(q)
      ) {
        parts.push({
          id: part.id,
          organId: organ.id,
          organName: organ.name,
          name: part.name,
          parentDivision: part.parentDivision,
          location: part.location,
        });
      }
    }
  }

  const diseases = DISEASES_DATA.filter(
    disease =>
      disease.name.toLowerCase().includes(q) ||
      disease.shortExplanation.toLowerCase().includes(q) ||
      disease.affectedStructures.some(
        structure => structure.toLowerCase().includes(q)
      )
  ).map(disease => ({
    id: disease.id,
    organId: disease.organId,
    organName: disease.organName,
    name: disease.name,
    affectedStructures: disease.affectedStructures,
    shortExplanation: disease.shortExplanation,
  }));

  return {
    query: q,
    organs,
    parts,
    diseases,
  };
}

// Get quizzes, optionally filtered by category and organ
export async function fetchQuizzes(
  category = 'All',
  organId = 'all'
): Promise<QuizQuestion[]> {
  return QUIZZES_DATA.filter(question => {
    const categoryMatch =
      category === 'All' ||
      question.category === category;

    const organMatch =
      organId === 'all' ||
      question.organId === organId;

    return categoryMatch && organMatch;
  });
}
