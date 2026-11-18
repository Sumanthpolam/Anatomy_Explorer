export type OrganId =
  | 'heart'
  | 'brain'
  | 'lungs'
  | 'liver'
  | 'kidneys'
  | 'eye'
  | 'intestines'
  | 'pancreas'
  | 'skin';

export type OrganCategory =
  | 'cardiovascular'
  | 'nervous'
  | 'respiratory'
  | 'digestive'
  | 'renal'
  | 'sensory'
  | 'endocrine'
  | 'integumentary';

export type LanguageCode = 'en' | 'es' | 'fr';

export interface PhysiologyStep {
  step: number;
  title: string;
  detail: string;
  flowType?: 'deoxygenated' | 'oxygenated' | 'air' | 'filtrate' | 'neural' | 'digestive';
}

export interface OrganMetric {
  label: string;
  value: string;
  unit: string;
}

export interface DiagramHotspot {
  partId: string;
  label: string;
  xPct: number;
  yPct: number;
  note: string;
}

export interface MicroscopicInfo {
  title: string;
  magnification: string;
  structures: string[];
  description: string;
}

export interface AnatomicalPart {
  id: string;
  organId: OrganId;
  name: string;
  parentDivision: string;
  categoryLabel: string;
  location: string;
  structure: string;
  functionSummary: string;
  detailedExplanation: string;
  activitiesControlled: string[];
  damageConsequences: string;
  illustrationUrl?: string;
  illustrationCaption?: string;
  relatedDiseaseIds: string[];
  interestingFacts: string[];
  colorHex: string;
}

export interface OrganData {
  id: OrganId;
  name: string;
  poeticSubtitle: string;
  system: string;
  category: OrganCategory;
  tagline: string;
  locationSummary: string;
  weightOrSize: string;
  medicalImportance: string;
  overviewSimple: string;
  overviewDetailed: string;
  anatomySummary: string;
  functionSummary: string;
  physiologySteps: PhysiologyStep[];
  metrics: OrganMetric[];
  illustrationUrl: string;
  illustrationCaption: string;
  hasUploadedPlate: boolean;
  diagramHotspots: DiagramHotspot[];
  microscopicView: MicroscopicInfo;
  relatedSystems: string[];
  interestingFacts: string[];
  parts: AnatomicalPart[];
}

export interface DiseaseRecord {
  id: string;
  name: string;
  organId: OrganId;
  organName: string;
  affectedStructures: string[];
  shortExplanation: string;
  detailedExplanation: string;
  symptoms: string[];
  causesAndRiskFactors: string[];
  diagnosticMethods: string[];
  treatmentOptions: string[];
  prognosisCategory: string;
  treatmentDistinction: string;
  preventionMeasures: string[];
}

export interface QuizQuestion {
  id: string;
  category: 'Organ Identification' | 'Anatomy' | 'Disease Awareness';
  organId: OrganId;
  difficulty: 'Foundation' | 'Intermediate';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SearchResults {
  query: string;
  organs: Array<{
    id: OrganId;
    name: string;
    system: string;
    tagline: string;
  }>;
  parts: Array<{
    id: string;
    organId: OrganId;
    organName: string;
    name: string;
    parentDivision: string;
    location: string;
  }>;
  diseases: Array<{
    id: string;
    organId: OrganId;
    organName: string;
    name: string;
    affectedStructures: string[];
    shortExplanation: string;
  }>;
}
