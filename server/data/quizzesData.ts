import type { QuizQuestion } from '../../src/types/anatomy';

export const QUIZZES_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Anatomy',
    organId: 'heart',
    difficulty: 'Foundation',
    question: 'Which layer of the heart wall is composed of thick cardiac muscle responsible for pumping contractions?',
    options: ['Endocardium', 'Myocardium', 'Epicardium', 'Fibrous pericardium'],
    correctIndex: 1,
    explanation:
      'The myocardium is the muscular middle layer of the heart wall that contracts rhythmically to propel blood through the chambers.',
  },
  {
    id: 'q2',
    category: 'Anatomy',
    organId: 'heart',
    difficulty: 'Intermediate',
    question: 'Which vessel carries deoxygenated blood from the right ventricle toward the lungs?',
    options: ['Aorta', 'Pulmonary veins', 'Pulmonary arteries', 'Superior vena cava'],
    correctIndex: 2,
    explanation:
      'Pulmonary arteries carry deoxygenated blood away from the right ventricle to the lungs for oxygenation.',
  },
  {
    id: 'q3',
    category: 'Organ Identification',
    organId: 'heart',
    difficulty: 'Foundation',
    question: 'Which heart valve prevents oxygen-rich blood in the left ventricle from leaking backward into the left atrium?',
    options: ['Tricuspid valve', 'Pulmonary valve', 'Mitral (bicuspid) valve', 'Aortic valve'],
    correctIndex: 2,
    explanation:
      'The mitral (bicuspid) valve sits between the left atrium and left ventricle and seals tightly during ventricular contraction.',
  },
  {
    id: 'q4',
    category: 'Anatomy',
    organId: 'brain',
    difficulty: 'Foundation',
    question: 'In standard neuroanatomy, the medulla oblongata is a subdivision of which major brain division?',
    options: ['Cerebellum', 'Cerebrum', 'Brainstem', 'Occipital lobe'],
    correctIndex: 2,
    explanation:
      'The three major brain divisions are the cerebrum, cerebellum, and brainstem. The brainstem consists of the midbrain, pons, and medulla oblongata.',
  },
  {
    id: 'q5',
    category: 'Organ Identification',
    organId: 'brain',
    difficulty: 'Foundation',
    question: 'Which cerebral lobe at the back of the head is primarily responsible for processing vision?',
    options: ['Frontal lobe', 'Temporal lobe', 'Parietal lobe', 'Occipital lobe'],
    correctIndex: 3,
    explanation:
      'The occipital lobe houses the primary visual cortex, interpreting color, shape, depth, and motion from the eyes.',
  },
  {
    id: 'q6',
    category: 'Anatomy',
    organId: 'brain',
    difficulty: 'Foundation',
    question: 'Damage to the cerebellum typically leads to which set of symptoms?',
    options: [
      'Loss of balance, posture, and smooth movement coordination (ataxia)',
      'Loss of vision in both eyes',
      'Immediate loss of memory for new words',
      'Complete paralysis of one arm',
    ],
    correctIndex: 0,
    explanation:
      'The cerebellum coordinates balance, posture, and fine motor control; injury causes clumsy, uncoordinated movements without paralyzing muscles.',
  },
  {
    id: 'q7',
    category: 'Organ Identification',
    organId: 'brain',
    difficulty: 'Intermediate',
    question: 'Which deep limbic structure converts short-term experiences into long-term memories?',
    options: ['Pons', 'Hippocampus', 'Parietal cortex', 'Medulla oblongata'],
    correctIndex: 1,
    explanation:
      'The curved hippocampus inside the medial temporal lobe consolidates new facts and experiences into long-term memory.',
  },
  {
    id: 'q8',
    category: 'Disease Awareness',
    organId: 'brain',
    difficulty: 'Intermediate',
    question: 'Which statement accurately describes current medical treatment for Alzheimer’s disease?',
    options: [
      'A single antibiotic course permanently cures Alzheimer’s disease',
      'There is currently no established cure, though medications and supportive care can ease symptoms or modestly slow decline',
      'Surgery on the cerebellum reverses all memory loss',
      'Alzheimer’s disease only affects the brainstem',
    ],
    correctIndex: 1,
    explanation:
      'Alzheimer’s disease currently has no established cure; treatments focus on symptom support, modest disease-modifying therapy in early stages, and caregiver care.',
  },
  {
    id: 'q9',
    category: 'Anatomy',
    organId: 'lungs',
    difficulty: 'Foundation',
    question: 'How many lobes do the human right and left lungs have respectively?',
    options: [
      'Right: 2 lobes, Left: 3 lobes',
      'Right: 3 lobes, Left: 2 lobes',
      'Right: 3 lobes, Left: 3 lobes',
      'Right: 1 lobe, Left: 2 lobes',
    ],
    correctIndex: 1,
    explanation:
      'The right lung has upper, middle, and lower lobes, whereas the left lung has upper and lower lobes to accommodate the heart’s cardiac notch.',
  },
  {
    id: 'q10',
    category: 'Organ Identification',
    organId: 'lungs',
    difficulty: 'Foundation',
    question: 'In which microscopic lung structures does oxygen enter the bloodstream and carbon dioxide leave?',
    options: ['Tracheal rings', 'Pleural membranes', 'Alveoli', 'Diaphragm'],
    correctIndex: 2,
    explanation:
      'Alveoli are tiny thin-walled air sacs wrapped in pulmonary capillaries where rapid O2 and CO2 gas exchange takes place.',
  },
  {
    id: 'q11',
    category: 'Disease Awareness',
    organId: 'lungs',
    difficulty: 'Foundation',
    question: 'During an asthma flare-up, which change primarily causes wheezing and difficulty exhaling?',
    options: [
      'Smooth muscle tightening and inflammation narrowing the bronchioles',
      'Hard mineral stones blocking the trachea',
      'Over-expansion of the diaphragm muscle',
      'Fluid accumulation in the pericardial sac',
    ],
    correctIndex: 0,
    explanation:
      'Asthma triggers inflammation, excess mucus, and smooth-muscle constriction around the small bronchioles.',
  },
  {
    id: 'q12',
    category: 'Anatomy',
    organId: 'kidneys',
    difficulty: 'Foundation',
    question: 'What is the microscopic functional filtration unit of the kidney?',
    options: ['Ureter', 'Renal capsule', 'Nephron', 'Major calyx'],
    correctIndex: 2,
    explanation:
      'Each kidney contains roughly one million nephrons consisting of a glomerulus, Bowman’s capsule, convoluted tubules, Loop of Henle, and collecting duct.',
  },
  {
    id: 'q13',
    category: 'Organ Identification',
    organId: 'kidneys',
    difficulty: 'Intermediate',
    question: 'In a coronal kidney cutaway, urine drips from the tips of renal pyramids (papillae) directly into which structures?',
    options: ['Renal arteries', 'Minor calyces', 'Renal capsule', 'Glomeruli'],
    correctIndex: 1,
    explanation:
      'Urine exits the renal papillae into cup-shaped minor calyces, which merge into major calyces, the renal pelvis, and the ureter.',
  },
  {
    id: 'q14',
    category: 'Disease Awareness',
    organId: 'kidneys',
    difficulty: 'Intermediate',
    question: 'What are the two most common underlying risk factors leading to Chronic Kidney Disease (CKD)?',
    options: [
      'Asthma and migraine headaches',
      'Diabetes and uncontrolled high blood pressure',
      'Seasonal allergies and low vitamin C',
      'Myocarditis and pericarditis',
    ],
    correctIndex: 1,
    explanation:
      'Diabetes and chronic hypertension place damaging strain on delicate glomerular capillaries inside the nephrons over time.',
  },
  {
    id: 'q15',
    category: 'Anatomy',
    organId: 'heart',
    difficulty: 'Intermediate',
    question: 'Which coronary vessel collects spent deoxygenated blood from cardiac veins and empties directly into the right atrium?',
    options: ['Left anterior descending artery', 'Circumflex artery', 'Coronary sinus', 'Pulmonary trunk'],
    correctIndex: 2,
    explanation:
      'The coronary sinus sits in the posterior atrioventricular groove, gathering blood from the great, middle, and small cardiac veins back into the right atrium.',
  },
  {
    id: 'q16',
    category: 'Anatomy',
    organId: 'liver',
    difficulty: 'Foundation',
    question: 'Which blood vessel delivers ~75% of the liver’s blood supply rich in newly absorbed nutrients from the intestines?',
    options: ['Hepatic portal vein', 'Inferior vena cava', 'Coronary sinus', 'Renal artery'],
    correctIndex: 0,
    explanation:
      'The hepatic portal vein carries nutrient-rich venous blood from the stomach, intestines, pancreas, and spleen straight into liver sinusoids for processing.',
  },
  {
    id: 'q17',
    category: 'Disease Awareness',
    organId: 'liver',
    difficulty: 'Intermediate',
    question: 'What causes the yellowing of eyes and skin (jaundice) when the common bile duct is blocked or hepatocytes are inflamed?',
    options: [
      'Excess urea accumulation',
      'Bilirubin pigment backing up into the bloodstream',
      'Overproduction of insulin',
      'Too many red blood cells in the spleen',
    ],
    correctIndex: 1,
    explanation:
      'Normally the liver excretes bilirubin in bile through the common bile duct; blockage or hepatitis causes bilirubin to build up in blood and tissues.',
  },
  {
    id: 'q18',
    category: 'Organ Identification',
    organId: 'eye',
    difficulty: 'Foundation',
    question: 'Which transparent structure at the very front of the eye performs roughly two-thirds of all light refraction?',
    options: ['Sclera', 'Retina', 'Cornea', 'Optic nerve'],
    correctIndex: 2,
    explanation:
      'The curved, crystal-clear cornea bends incoming light first, while the crystalline lens fine-tunes focus for near and far objects.',
  },
  {
    id: 'q19',
    category: 'Disease Awareness',
    organId: 'eye',
    difficulty: 'Foundation',
    question: 'Why is glaucoma often called the "silent thief of sight"?',
    options: [
      'It only affects people while asleep',
      'Early open-angle pressure damages peripheral optic nerve fibers gradually without pain',
      'It turns the cornea bright red immediately',
      'It only blurs near reading text',
    ],
    correctIndex: 1,
    explanation:
      'Elevated eye pressure slowly compresses peripheral optic nerve axons without causing pain, making routine eye exams vital for early detection.',
  },
  {
    id: 'q20',
    category: 'Anatomy',
    organId: 'intestines',
    difficulty: 'Foundation',
    question: 'Which microscopic finger-like projections multiply the small intestine’s absorptive surface area roughly 600-fold?',
    options: ['Alveoli', 'Nephrons', 'Intestinal villi & microvilli', 'Purkinje fibers'],
    correctIndex: 2,
    explanation:
      'Millions of villi and brush-border microvilli line the jejunum and ileum so sugars, amino acids, vitamins, and fats absorb rapidly.',
  },
  {
    id: 'q21',
    category: 'Organ Identification',
    organId: 'pancreas',
    difficulty: 'Foundation',
    question: 'Which specialized endocrine cell clusters inside the pancreas secrete insulin and glucagon into the bloodstream?',
    options: ['Islets of Langerhans', 'Hepatic lobules', 'Renal pyramids', 'Dermal papillae'],
    correctIndex: 0,
    explanation:
      'Beta cells and alpha cells inside the Islets of Langerhans act as the body’s blood-sugar thermostat via insulin and glucagon.',
  },
  {
    id: 'q22',
    category: 'Anatomy',
    organId: 'skin',
    difficulty: 'Foundation',
    question: 'Which layer of the skin houses blood vessels, collagen fibers, hair follicles, sweat glands, and touch receptors?',
    options: ['Stratum corneum', 'Epidermis', 'Dermis', 'Hypodermis only'],
    correctIndex: 2,
    explanation:
      'The avascular outer epidermis forms the waterproof shield, while the vascular dermis beneath supplies nourishment, strength, and sensory detection.',
  },
];

