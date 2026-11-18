import type { LanguageCode } from '../types/anatomy';

export interface UiDictionary {
  brand: string;
  nav: {
    explore: string;
    systems: string;
    lessons: string;
    library: string;
    notes: string;
  };
  searchPlaceholder: string;
  downloadZip: string;
  packaging: string;
  hints: {
    drag: string;
    scroll: string;
    clickDot: string;
  };
  controls: {
    fullBody: string;
    isolate: string;
    crossSection: string;
    layers: string;
    compare: string;
    autoRotate: string;
    hotspots: string;
    reset: string;
    zoomIn: string;
    zoomOut: string;
  };
  tabs: {
    overview: string;
    anatomy: string;
    function: string;
    diseases: string;
    treatment: string;
    facts: string;
  };
  studentMode: string;
  detailedMode: string;
  viewLesson: string;
  enlargeDiagram: string;
  backToBody: string;
}

export const TRANSLATIONS: Record<LanguageCode, UiDictionary> = {
  en: {
    brand: 'Human Anatomy Explorer',
    nav: {
      explore: 'Explore',
      systems: 'Systems',
      lessons: 'Lessons',
      library: 'Library',
      notes: 'Notes',
    },
    searchPlaceholder: 'Search organs, structures, systems, or diseases...',
    downloadZip: 'Download ZIP',
    packaging: 'Packaging...',
    hints: {
      drag: 'Drag to pan',
      scroll: 'Scroll to zoom',
      clickDot: 'Click an organ or dot to explore',
    },
    controls: {
      fullBody: 'Full Body',
      isolate: 'Isolate',
      crossSection: 'Cross-section',
      layers: 'Layers',
      compare: 'Compare',
      autoRotate: 'Rotate',
      hotspots: 'Dots',
      reset: 'Reset',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
    },
    tabs: {
      overview: 'Overview',
      anatomy: 'Anatomy',
      function: 'Function',
      diseases: 'Diseases',
      treatment: 'Treatment',
      facts: 'Interesting Facts',
    },
    studentMode: 'Student',
    detailedMode: 'Detailed',
    viewLesson: 'View Lesson',
    enlargeDiagram: 'Enlarge Diagram',
    backToBody: 'Full Body',
  },
  es: {
    brand: 'Explorador de Anatomía Humana',
    nav: {
      explore: 'Explorar',
      systems: 'Sistemas',
      lessons: 'Lecciones',
      library: 'Biblioteca',
      notes: 'Notas',
    },
    searchPlaceholder: 'Buscar órganos, estructuras, sistemas o enfermedades...',
    downloadZip: 'Descargar ZIP',
    packaging: 'Empaquetando...',
    hints: {
      drag: 'Arrastra para mover',
      scroll: 'Desplaza para zoom',
      clickDot: 'Haz clic en un órgano o punto',
    },
    controls: {
      fullBody: 'Cuerpo completo',
      isolate: 'Aislar',
      crossSection: 'Corte transversal',
      layers: 'Capas',
      compare: 'Comparar',
      autoRotate: 'Rotar',
      hotspots: 'Puntos',
      reset: 'Reiniciar',
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
    },
    tabs: {
      overview: 'Resumen',
      anatomy: 'Anatomía',
      function: 'Función',
      diseases: 'Enfermedades',
      treatment: 'Tratamiento',
      facts: 'Datos curiosos',
    },
    studentMode: 'Estudiante',
    detailedMode: 'Detallado',
    viewLesson: 'Ver lección',
    enlargeDiagram: 'Ampliar diagrama',
    backToBody: 'Cuerpo completo',
  },
  fr: {
    brand: 'Explorateur d’Anatomie Humaine',
    nav: {
      explore: 'Explorer',
      systems: 'Systèmes',
      lessons: 'Leçons',
      library: 'Bibliothèque',
      notes: 'Notes',
    },
    searchPlaceholder: 'Rechercher organes, structures, systèmes ou maladies...',
    downloadZip: 'Télécharger ZIP',
    packaging: 'Préparation...',
    hints: {
      drag: 'Glisser pour déplacer',
      scroll: 'Molette pour zoomer',
      clickDot: 'Cliquer sur un organe ou point',
    },
    controls: {
      fullBody: 'Corps entier',
      isolate: 'Isoler',
      crossSection: 'Coupe',
      layers: 'Couches',
      compare: 'Comparer',
      autoRotate: 'Rotation',
      hotspots: 'Points',
      reset: 'Réinitialiser',
      zoomIn: 'Zoom +',
      zoomOut: 'Zoom -',
    },
    tabs: {
      overview: 'Aperçu',
      anatomy: 'Anatomie',
      function: 'Fonction',
      diseases: 'Maladies',
      treatment: 'Traitement',
      facts: 'Faits notables',
    },
    studentMode: 'Étudiant',
    detailedMode: 'Détaillé',
    viewLesson: 'Voir la leçon',
    enlargeDiagram: 'Agrandir le schéma',
    backToBody: 'Corps entier',
  },
};
