import { HEART_DATA, BRAIN_DATA } from './heartBrainData';
import { LUNGS_DATA, KIDNEYS_DATA } from './lungsKidneysData';
import {
  LIVER_DATA,
  EYE_DATA,
  INTESTINES_DATA,
  PANCREAS_DATA,
  SKIN_DATA,
} from './additionalOrgansData';
import { DISEASES_DATA } from './diseasesData';
import { QUIZZES_DATA } from './quizzesData';
import type { OrganData } from '../../src/types/anatomy';

export const ORGANS_DATA: OrganData[] = [
  HEART_DATA,
  BRAIN_DATA,
  LUNGS_DATA,
  LIVER_DATA,
  KIDNEYS_DATA,
  EYE_DATA,
  INTESTINES_DATA,
  PANCREAS_DATA,
  SKIN_DATA,
];

export { DISEASES_DATA, QUIZZES_DATA };

