import type { DiseaseRecord } from '../../src/types/anatomy';

export const DISEASES_DATA: DiseaseRecord[] = [
  // BRAIN - CEREBRUM
  {
    id: 'stroke',
    name: 'Cerebral Stroke (Ischemic & Hemorrhagic)',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebrum (Frontal, Parietal, Temporal, Occipital Lobes)', 'Thalamus'],
    shortExplanation:
      'A sudden interruption of blood flow to part of the cerebrum—either from a blocked artery (ischemic) or a ruptured blood vessel (hemorrhagic)—causing brain cells to lose oxygen within minutes.',
    detailedExplanation:
      'Ischemic strokes account for ~85% of cases when a clot occludes a cerebral artery; hemorrhagic strokes occur when bleeding damages surrounding tissue and raises pressure.',
    symptoms: [
      'Sudden face drooping on one side',
      'Arm or leg weakness/numbness (usually one-sided)',
      'Slurred speech or difficulty understanding language',
      'Sudden vision loss or severe unexplained headache',
    ],
    causesAndRiskFactors: [
      'High blood pressure (leading modifiable risk factor)',
      'Atrial fibrillation, atherosclerosis, smoking, and diabetes',
    ],
    diagnosticMethods: [
      'Emergency brain CT scan (to rule in/out bleeding immediately)',
      'Brain MRI, CT angiography, carotid ultrasound, and ECG',
    ],
    treatmentOptions: [
      'Time-critical clot-busting medication (thrombolytics) within narrow early window for eligible ischemic strokes',
      'Mechanical thrombectomy (catheter clot retrieval) for large-vessel blockages',
      'Blood pressure control or neurosurgical intervention for hemorrhagic strokes',
      'Long-term physical, occupational, and speech rehabilitation plus preventive antiplatelet/anticoagulant therapy',
    ],
    prognosisCategory: 'Emergency / Time-Critical Intervention',
    treatmentDistinction:
      'Stroke treatment depends strictly on type (clot vs bleed) and timing ("time is brain"). Emergency intervention limits permanent brain damage, while rehabilitation helps surviving neural pathways relearn lost skills; lost neurons do not regrow.',
    preventionMeasures: [
      'Control blood pressure, cholesterol, and blood sugar',
      'Avoid smoking, stay physically active, and manage atrial fibrillation',
    ],
  },
  {
    id: 'epilepsy',
    name: 'Epilepsy',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebrum (especially Temporal & Frontal Lobes)', 'Hippocampus', 'Amygdala'],
    shortExplanation:
      'A chronic neurological condition characterized by recurrent, unprovoked seizures caused by sudden bursts of abnormal electrical activity in cortical neurons.',
    detailedExplanation:
      'Seizures may stay localized to one lobe (focal seizures) or spread across both cerebral hemispheres (generalized seizures).',
    symptoms: [
      'Temporary confusion or staring spells',
      'Uncontrollable jerking movements of arms and legs',
      'Brief loss of awareness or consciousness',
      'Sudden unusual sensory feelings (auras) such as déjà vu or odd smells',
    ],
    causesAndRiskFactors: [
      'Genetic predisposition, prior head trauma, or stroke scars',
      'Brain infections, developmental variations, or unknown (idiopathic) causes',
    ],
    diagnosticMethods: [
      'Electroencephalogram (EEG) to record brain electrical patterns',
      'High-resolution brain MRI and detailed clinical seizure history',
    ],
    treatmentOptions: [
      'Daily anti-seizure medications (effective in controlling seizures for ~70% of patients)',
      'Ketogenic medical nutrition therapy in select cases',
      'Epilepsy surgery or vagus nerve stimulation (VNS) for drug-resistant focal epilepsy',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'For many individuals, anti-seizure medications provide long-term seizure control rather than an instant cure; a subset of patients remain seizure-free after targeted surgery or outgrow childhood syndromes.',
    preventionMeasures: [
      'Wear helmets to prevent head injury and take prescribed medications consistently',
      'Maintain regular sleep schedules to reduce seizure triggers',
    ],
  },
  {
    id: 'alzheimers-disease',
    name: "Alzheimer's Disease",
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Hippocampus', 'Temporal Lobe', 'Frontal & Parietal Lobes'],
    shortExplanation:
      'A progressive neurodegenerative disorder that gradually damages neurons involved in memory, thinking, language, and daily independence.',
    detailedExplanation:
      'Abnormal accumulation of amyloid plaques and tau tangles disrupts synaptic communication, typically starting in the hippocampus and spreading across the cerebral cortex.',
    symptoms: [
      'Forgetting recently learned information and repeating questions',
      'Disorientation in time or familiar places',
      'Difficulty finding words, planning tasks, or managing finances',
      'Changes in mood, judgment, or personality in later stages',
    ],
    causesAndRiskFactors: [
      'Advancing age and genetic susceptibility (e.g., APOE variants)',
      'Cardiovascular risk factors, head trauma history, and family history',
    ],
    diagnosticMethods: [
      'Cognitive and neurological memory assessments',
      'Brain MRI, specialized PET imaging, and cerebrospinal fluid/blood biomarker testing',
    ],
    treatmentOptions: [
      'Medications that temporarily support neurotransmitter signaling (cholinesterase inhibitors, memantine)',
      'Targeted anti-amyloid antibody therapies in eligible early-stage cases to modestly slow progression',
      'Structured cognitive routines, caregiver support, and safe home adaptations',
    ],
    prognosisCategory: 'No Established Cure — Supportive & Disease-Modifying Care',
    treatmentDistinction:
      "Alzheimer's disease currently has no established permanent cure. Available medications, disease-modifying therapies in early stages, and supportive care aim to ease symptoms, modestly slow decline, and preserve quality of life.",
    preventionMeasures: [
      'Regular aerobic exercise, heart-healthy diet, blood pressure management, and lifelong cognitive/social engagement',
    ],
  },
  {
    id: 'brain-tumors',
    name: 'Brain Tumors',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebrum', 'Thalamus', 'Hypothalamus', 'Cerebellum'],
    shortExplanation:
      'Abnormal growths of cells inside the skull that can be non-cancerous (benign) or cancerous (malignant), placing pressure on nearby brain structures.',
    detailedExplanation:
      'Primary tumors originate in brain tissue or meninges, whereas metastatic tumors spread from cancers elsewhere in the body. Even benign tumors can cause serious symptoms by compressing vital areas within the rigid skull.',
    symptoms: [
      'New or worsening headaches (often worse in the morning)',
      'New-onset seizures, nausea, or blurred/double vision',
      'Progressive weakness, speech changes, or personality shifts depending on location',
    ],
    causesAndRiskFactors: [
      'Mostly sporadic genetic mutations in cell-growth control',
      'Prior high-dose cranial radiation or rare inherited syndromes',
    ],
    diagnosticMethods: [
      'Contrast-enhanced brain MRI and CT imaging',
      'Stereotactic biopsy or surgical pathology to determine tumor grade',
    ],
    treatmentOptions: [
      'Neurosurgical resection when safely accessible',
      'Targeted radiation therapy (stereotactic radiosurgery or fractionated radiation)',
      'Chemotherapy, targeted molecular drugs, and corticosteroids to reduce swelling',
    ],
    prognosisCategory: 'Curable in Early Stages / Chronic Management',
    treatmentDistinction:
      'Some slow-growing benign tumors (such as accessible meningiomas) can be cured completely by surgery, whereas high-grade malignant gliomas are managed with surgery, radiation, and chemotherapy to control growth rather than guaranteeing a permanent cure.',
    preventionMeasures: [
      'Avoid unnecessary ionizing radiation exposure; most primary brain tumors have no known lifestyle prevention',
    ],
  },
  {
    id: 'traumatic-brain-injury',
    name: 'Traumatic Brain Injury (TBI)',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Frontal Lobe', 'Temporal Lobe', 'Parietal Lobe', 'Hippocampus'],
    shortExplanation:
      'Brain dysfunction caused by an external impact, jolt, or penetrating injury—ranging from mild concussions to severe bruising and swelling.',
    detailedExplanation:
      'Sudden acceleration-deceleration forces can bruise cortical tissue against the inside of the skull and stretch delicate nerve axons (diffuse axonal injury).',
    symptoms: [
      'Headache, dizziness, nausea, or temporary confusion',
      'Loss of consciousness, memory gaps around the event, or light sensitivity',
      'Difficulty concentrating, balance trouble, or mood irritability',
    ],
    causesAndRiskFactors: [
      'Falls, road traffic collisions, sports impacts, and workplace accidents',
    ],
    diagnosticMethods: [
      'Glasgow Coma Scale and neurological examination',
      'Head CT scan (for bleeding/fractures) and brain MRI',
    ],
    treatmentOptions: [
      'Gradual physical and cognitive rest followed by guided return-to-activity for mild concussion',
      'Emergency ICU monitoring, intracranial pressure control, or neurosurgery for severe bleeds',
      'Multidisciplinary neuro-rehabilitation (physical, speech, and cognitive therapy)',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Mild TBIs (concussions) typically recover fully with proper rest and medical supervision, whereas severe TBIs require emergency stabilization and long-term neuro-rehabilitation to adapt around injured pathways.',
    preventionMeasures: [
      'Always wear seatbelts and properly fitted helmets during cycling, skating, or contact sports',
      'Prevent falls with home lighting and railings',
    ],
  },
  {
    id: 'aphasia',
    name: 'Aphasia',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Frontal Lobe (Broca’s Area)', 'Temporal Lobe (Wernicke’s Area)'],
    shortExplanation:
      'A language disorder resulting from damage to the brain’s language networks, impairing speaking, understanding speech, reading, or writing without affecting intelligence.',
    detailedExplanation:
      'Expressive (Broca’s) aphasia causes effortful, halted speech with intact comprehension; receptive (Wernicke’s) aphasia impairs understanding spoken or written words.',
    symptoms: [
      'Trouble finding the right words or speaking in short, incomplete phrases',
      'Speaking sentences that sound fluent but contain unintended or nonsensical words',
      'Difficulty understanding spoken conversations or reading text',
    ],
    causesAndRiskFactors: [
      'Left-hemisphere stroke (most common cause)',
      'Head trauma, brain tumors, or progressive neurodegenerative conditions',
    ],
    diagnosticMethods: [
      'Standardized speech-language pathologist evaluation',
      'Brain MRI or CT to identify the underlying lesion',
    ],
    treatmentOptions: [
      'Intensive speech-language therapy to rebuild communication pathways',
      'Communication aids, visual boards, and family conversation training',
      'Treating the underlying cause (such as stroke prevention)',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Rehabilitation through targeted speech-language therapy helps the brain reorganize language networks over months to years; recovery varies with lesion size and cause.',
    preventionMeasures: ['Prevent stroke and head injury by controlling blood pressure and using safety gear'],
  },

  // BRAIN - CEREBELLUM
  {
    id: 'cerebellar-ataxia',
    name: 'Cerebellar Ataxia',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebellum'],
    shortExplanation:
      'Loss of smooth muscle coordination, balance, and precise timing caused by dysfunction of the cerebellum or its connecting nerve tracts.',
    detailedExplanation:
      'Patients retain normal muscle strength, but movements overshoot or undershoot targets because cerebellar error-correction signals are disrupted.',
    symptoms: [
      'Unsteady, wide-based staggering walk',
      'Clumsy hand coordination and tremor when reaching for objects',
      'Slurred, uneven speech (dysarthria) and rapid jerky eye movements',
    ],
    causesAndRiskFactors: [
      'Inherited genetic forms, alcohol toxicity, vitamin deficiencies (B12/E), or autoimmune reactions',
      'Cerebellar stroke, infection, or medication side effects',
    ],
    diagnosticMethods: [
      'Coordination and gait neurological tests (finger-to-nose, heel-to-shin)',
      'Brain MRI, blood metabolic/vitamin panels, and genetic testing',
    ],
    treatmentOptions: [
      'Treating reversible triggers (vitamin replacement, stopping toxins)',
      'Physical therapy, balance training, weighted utensils, and assistive walking devices',
      'Speech therapy for articulation clarity',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Reversible forms caused by vitamin deficiency or medication toxicity can improve markedly once treated; inherited forms are managed long-term through physical rehabilitation and mobility support.',
    preventionMeasures: ['Avoid excessive alcohol, maintain balanced nutrition, and review medications with a physician'],
  },
  {
    id: 'cerebellar-degeneration',
    name: 'Cerebellar Degeneration',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebellum'],
    shortExplanation:
      'Gradual shrinkage and loss of Purkinje neurons inside the cerebellum, leading to progressive loss of balance and coordination.',
    detailedExplanation:
      'Slow loss of cerebellar cortex neurons impairs the timing circuits needed for posture, walking, and coordinated speech.',
    symptoms: [
      'Slowly worsening balance and frequent stumbling',
      'Tremor during intentional movement',
      'Gradual slurring of speech and difficulty with fine finger tasks',
    ],
    causesAndRiskFactors: [
      'Spinocerebellar genetic disorders, chronic alcohol exposure, or paraneoplastic autoimmune syndromes',
    ],
    diagnosticMethods: [
      'Brain MRI revealing cerebellar atrophy',
      'Genetic screening, autoimmune antibody panels, and neurological workup',
    ],
    treatmentOptions: [
      'Immunotherapy or treating underlying triggers in autoimmune forms',
      'Ongoing physical, occupational, and speech rehabilitation to maintain independence',
      'Home fall-proofing and adaptive mobility tools',
    ],
    prognosisCategory: 'No Established Cure — Supportive & Disease-Modifying Care',
    treatmentDistinction:
      'Most genetic and degenerative forms have no permanent cure; stopping toxic or autoimmune causes can halt progression, while rehabilitation maximizes function and safety.',
    preventionMeasures: ['Avoid chronic heavy alcohol use and seek early care for progressive balance loss'],
  },
  {
    id: 'cerebellar-stroke',
    name: 'Cerebellar Stroke',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Cerebellum'],
    shortExplanation:
      'A blocked or bleeding blood vessel supplying the cerebellum, causing sudden severe dizziness, vomiting, and loss of balance.',
    detailedExplanation:
      'Because the cerebellum sits inside a tight lower compartment of the skull (posterior fossa), post-stroke swelling can dangerously compress the adjacent brainstem.',
    symptoms: [
      'Sudden intense vertigo (spinning sensation) and nausea',
      'Inability to stand or walk without falling to one side',
      'Sudden severe headache at the back of the head and uncoordinated limb movement',
    ],
    causesAndRiskFactors: [
      'Hypertension, arterial embolism, vertebral artery dissection, and atherosclerosis',
    ],
    diagnosticMethods: [
      'Urgent brain MRI (more sensitive than CT in the posterior fossa) and emergency CT to exclude hemorrhage',
    ],
    treatmentOptions: [
      'Emergency clot-dissolving or endovascular stroke care if ischemic and within window',
      'Close ICU monitoring for cerebellar swelling, with surgical decompression if brainstem pressure rises',
      'Targeted vestibular and balance physical rehabilitation',
    ],
    prognosisCategory: 'Emergency / Time-Critical Intervention',
    treatmentDistinction:
      'Requires immediate emergency medical treatment to restore blood flow or relieve swelling; subsequent balance rehabilitation helps patients regain walking stability.',
    preventionMeasures: ['Manage blood pressure, cholesterol, and avoid smoking or neck trauma'],
  },

  // BRAIN - BRAINSTEM
  {
    id: 'brainstem-stroke',
    name: 'Brainstem Stroke',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Midbrain', 'Pons', 'Medulla Oblongata'],
    shortExplanation:
      'Interruption of blood supply to the midbrain, pons, or medulla oblongata, disrupting vital relays between the brain and body.',
    detailedExplanation:
      'Because densely packed nerve tracts and cranial nerve nuclei run through the brainstem, even a small stroke here can affect breathing, swallowing, eye movement, and limb strength.',
    symptoms: [
      'Sudden double vision, dizziness, or severe imbalance',
      'Difficulty swallowing (dysphagia) or slurred speech',
      'Weakness or numbness affecting one or both sides of the body',
      'Irregular breathing or altered consciousness in severe cases',
    ],
    causesAndRiskFactors: [
      'Basilar or vertebral artery blockages, severe hypertension, and atherosclerosis',
    ],
    diagnosticMethods: [
      'Emergency CT/CTA angiogram and diffusion-weighted brain MRI',
    ],
    treatmentOptions: [
      'Emergency thrombolysis or mechanical clot removal when eligible',
      'Airway protection, breathing/swallowing support, and intensive ICU care',
      'Specialized swallowing, speech, and physical rehabilitation',
    ],
    prognosisCategory: 'Emergency / Time-Critical Intervention',
    treatmentDistinction:
      'Time-critical emergency care determines survival and limits permanent deficits; recovery relies on medical stabilization and structured neuro-rehabilitation.',
    preventionMeasures: ['Control hypertension, diabetes, and cholesterol; seek urgent care at first stroke signs'],
  },
  {
    id: 'brainstem-tumors',
    name: 'Brainstem Tumors',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Midbrain', 'Pons', 'Medulla Oblongata'],
    shortExplanation:
      'Abnormal cell growths located within the midbrain, pons, or medulla oblongata that press on vital nerve pathways and cranial nerves.',
    detailedExplanation:
      'Because the brainstem controls breathing and heart rate, tumors here pose unique surgical challenges depending on whether they are focal (localized) or diffuse.',
    symptoms: [
      'Double vision, facial weakness, or drooping eyelid',
      'Difficulty swallowing, hoarse voice, and clumsy walking',
      'Morning headaches and nausea from blocked cerebrospinal fluid',
    ],
    causesAndRiskFactors: [
      'Spontaneous cellular genetic alterations; some pediatric/adult types linked to specific molecular mutations',
    ],
    diagnosticMethods: [
      'High-resolution brain MRI with contrast',
      'Careful stereotactic biopsy in select cases for molecular classification',
    ],
    treatmentOptions: [
      'Precision radiation therapy to shrink or control tumor growth',
      'Microsurgery for well-defined focal tumors; CSF shunt if fluid builds up',
      'Targeted molecular trials and supportive symptom/rehabilitation care',
    ],
    prognosisCategory: 'Curable in Early Stages / Chronic Management',
    treatmentDistinction:
      'Well-circumscribed low-grade focal tumors may be controlled long-term or removed surgically, whereas diffuse brainstem tumors currently rely on radiation and supportive management to slow progression.',
    preventionMeasures: ['No established primary prevention; early evaluation of persistent cranial nerve symptoms aids prompt diagnosis'],
  },
  {
    id: 'brainstem-injury',
    name: 'Brainstem Injury',
    organId: 'brain',
    organName: 'Human Brain',
    affectedStructures: ['Midbrain', 'Pons', 'Medulla Oblongata'],
    shortExplanation:
      'Severe mechanical trauma, compression, or oxygen deprivation affecting the midbrain, pons, or medulla oblongata.',
    detailedExplanation:
      'Can result from severe head trauma, brain herniation pushing downward on the brainstem, or prolonged oxygen loss.',
    symptoms: [
      'Decreased consciousness or coma',
      'Abnormal pupil responses and absent gag or cough reflexes',
      'Unstable breathing pattern, heart rate, or blood pressure',
    ],
    causesAndRiskFactors: [
      'High-energy motor vehicle accidents, severe falls, or uncontrolled brain swelling',
    ],
    diagnosticMethods: [
      'Emergency trauma neurological exam, CT scan, and MRI',
    ],
    treatmentOptions: [
      'Immediate mechanical ventilation and ICU life support',
      'Emergency treatment to relieve brain swelling or pressure',
      'Long-term neuro-rehabilitation and supportive care if stabilized',
    ],
    prognosisCategory: 'Emergency / Time-Critical Intervention',
    treatmentDistinction:
      'Life-threatening emergency requiring immediate airway and pressure stabilization; long-term recovery depends heavily on severity and secondary swelling control.',
    preventionMeasures: ['Use seatbelts, airbags, and certified helmets in high-risk activities'],
  },

  // HEART DISEASES
  {
    id: 'coronary-artery-disease',
    name: 'Coronary Artery Disease (CAD)',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Epicardium (Coronary Vessels)', 'Myocardium', 'Left Ventricle'],
    shortExplanation:
      'Narrowing of the coronary arteries by fatty cholesterol plaques (atherosclerosis), reducing oxygen delivery to the myocardium and risking a heart attack.',
    detailedExplanation:
      'When plaque ruptures, a sudden blood clot blocks blood flow, starving cardiomyocytes of oxygen and causing myocardial infarction.',
    symptoms: [
      'Chest pressure, tightness, or pain (angina), especially during exertion',
      'Shortness of breath, fatigue, or pain radiating to arm, jaw, or back',
    ],
    causesAndRiskFactors: [
      'High LDL cholesterol, hypertension, smoking, diabetes, and family history',
    ],
    diagnosticMethods: [
      'Electrocardiogram (ECG), troponin blood tests, stress testing, and coronary angiography',
    ],
    treatmentOptions: [
      'Lifestyle modifications and cholesterol/blood-pressure medications (statins, aspirin, beta-blockers)',
      'Angioplasty with stent placement or coronary artery bypass grafting (CABG)',
      'Cardiac rehabilitation to rebuild safe exercise tolerance',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'While atherosclerosis cannot be erased overnight, medications, stents/bypass surgery, and lifestyle management effectively restore blood flow and prevent future heart attacks.',
    preventionMeasures: ['Heart-healthy nutrition, regular aerobic exercise, zero tobacco, and blood pressure/lipid control'],
  },
  {
    id: 'heart-failure',
    name: 'Heart Failure',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Myocardium', 'Left Ventricle', 'Right Ventricle'],
    shortExplanation:
      'A chronic condition in which the heart muscle cannot pump or fill effectively enough to meet the body’s oxygen demands.',
    detailedExplanation:
      'Does not mean the heart has stopped; rather, weakened or stiff myocardium causes fluid to back up into the lungs or legs.',
    symptoms: [
      'Shortness of breath during activity or when lying flat',
      'Swelling in ankles, feet, or abdomen and persistent fatigue',
    ],
    causesAndRiskFactors: [
      'Prior heart attack, chronic high blood pressure, valve disease, or cardiomyopathy',
    ],
    diagnosticMethods: [
      'Echocardiogram (to measure ejection fraction), BNP blood test, chest X-ray, and ECG',
    ],
    treatmentOptions: [
      'Guideline-directed medications that reduce heart strain and fluid overload',
      'Implanted pacemakers/defibrillators or valve repair when indicated',
      'Daily sodium/fluid monitoring and supervised cardiac rehabilitation',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Heart failure is usually a long-term chronic condition managed with daily medications and lifestyle care; treating reversible causes can sometimes significantly improve pumping strength.',
    preventionMeasures: ['Treat hypertension early, prevent coronary disease, and limit excess sodium and alcohol'],
  },
  {
    id: 'arrhythmia',
    name: 'Cardiac Arrhythmia',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Right Atrium (SA Node)', 'Endocardium (Purkinje Fibers)', 'Septum'],
    shortExplanation:
      'Irregular, overly fast (tachycardia), or overly slow (bradycardia) heartbeats caused by disrupted electrical signaling.',
    detailedExplanation:
      'Abnormal electrical circuits in the atria (such as atrial fibrillation) or ventricles impair coordinated chamber pumping.',
    symptoms: [
      'Fluttering, racing, or skipped heartbeat sensation (palpitations)',
      'Dizziness, lightheadedness, shortness of breath, or fainting',
    ],
    causesAndRiskFactors: [
      'Coronary ischemia, electrolyte imbalances, thyroid disorders, high blood pressure, or scarred myocardium',
    ],
    diagnosticMethods: ['12-lead ECG, wearable Holter monitor, and electrophysiology studies'],
    treatmentOptions: [
      'Rate- or rhythm-controlling medications and blood thinners (for atrial fibrillation stroke prevention)',
      'Catheter ablation to silence faulty electrical pathways, or implanted pacemaker/ICD',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Some arrhythmias can be cured permanently with catheter ablation, while others are safely managed long-term using medication or pacemakers.',
    preventionMeasures: ['Control blood pressure, moderate caffeine/alcohol, and treat sleep apnea'],
  },
  {
    id: 'valvular-heart-disease',
    name: 'Valvular Heart Disease',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Mitral Valve', 'Aortic Valve', 'Tricuspid Valve', 'Pulmonary Valve'],
    shortExplanation:
      'Narrowing (stenosis) or backward leakage (regurgitation) of one or more heart valves, forcing the heart chambers to work harder.',
    detailedExplanation:
      'Age-related calcium buildup, congenital bicuspid valves, or past infections stiffen or deform valve leaflets.',
    symptoms: [
      'Heart murmur heard on exam, fatigue, and breathlessness on exertion',
      'Chest discomfort, ankle swelling, or dizziness',
    ],
    causesAndRiskFactors: [
      'Aging calcification, congenital valve variants, untreated strep/rheumatic fever, or infective endocarditis',
    ],
    diagnosticMethods: ['Transthoracic echocardiogram (ultrasound of moving valves), ECG, and cardiac MRI'],
    treatmentOptions: [
      'Regular echocardiogram monitoring and symptom-relieving medications in mild cases',
      'Surgical or catheter-based valve repair or replacement (e.g., TAVR) for severe disease',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Medications ease workload but cannot physically open a calcified valve; mechanical or bioprosthetic valve replacement/repair provides definitive structural correction.',
    preventionMeasures: ['Promptly treat bacterial strep throat infections and maintain good dental/cardiac hygiene'],
  },
  {
    id: 'pericarditis',
    name: 'Pericarditis',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Pericardium', 'Epicardium'],
    shortExplanation:
      'Inflammation of the protective pericardial sac surrounding the heart, causing sharp chest pain as the irritated layers rub together.',
    detailedExplanation:
      'Often triggered by viral infections or autoimmune inflammation, pericarditis may produce excess fluid around the heart (pericardial effusion).',
    symptoms: [
      'Sharp, stabbing chest pain that worsens when lying down and improves when leaning forward',
      'Mild fever, fatigue, and a scratchy friction rub heard on stethoscope exam',
    ],
    causesAndRiskFactors: ['Viral respiratory infections, post-heart-attack inflammation, autoimmune conditions'],
    diagnosticMethods: ['ECG changes, echocardiogram (to check pericardial fluid), and inflammatory blood markers'],
    treatmentOptions: [
      'Anti-inflammatory medications (NSAIDs and colchicine) plus rest from strenuous exercise',
      'Fluid drainage (pericardiocentesis) if large fluid buildup compresses the heart',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Most acute viral pericarditis cases resolve completely within weeks with anti-inflammatory therapy, though recurrent cases require longer preventive treatment.',
    preventionMeasures: ['Complete prescribed anti-inflammatory courses and rest during recovery to prevent recurrence'],
  },
  {
    id: 'myocarditis',
    name: 'Myocarditis',
    organId: 'heart',
    organName: 'Human Heart',
    affectedStructures: ['Myocardium'],
    shortExplanation:
      'Inflammation of the heart’s muscular middle layer (myocardium), which can temporarily weaken pumping strength or disturb heart rhythm.',
    detailedExplanation:
      'Usually results from the immune system responding to a viral infection or inflammatory trigger within heart muscle tissue.',
    symptoms: [
      'Chest pain, unusual fatigue, and shortness of breath',
      'Rapid or irregular heartbeat and swollen ankles in severe cases',
    ],
    causesAndRiskFactors: ['Viral infections, certain autoimmune conditions, or toxin/drug reactions'],
    diagnosticMethods: ['Cardiac MRI, troponin blood test, ECG, and echocardiogram'],
    treatmentOptions: [
      'Rest and avoiding intense athletics during healing',
      'Heart-protective medications to support pumping and calm inflammation',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Many mild cases recover completely with rest and supportive therapy, while severe inflammation requires long-term heart-failure management.',
    preventionMeasures: ['Follow recommended vaccinations, practice hygiene against viral illnesses, and avoid unprescribed stimulants'],
  },

  // LUNG DISEASES
  {
    id: 'asthma',
    name: 'Asthma',
    organId: 'lungs',
    organName: 'Human Lungs',
    affectedStructures: ['Bronchioles', 'Main Bronchi'],
    shortExplanation:
      'A chronic inflammatory airway condition in which the bronchioles swell, produce extra mucus, and tighten their smooth muscle rings, narrowing airflow.',
    detailedExplanation:
      'Triggers cause reversible bronchospasm, making exhalation wheezy and effortful.',
    symptoms: [
      'High-pitched wheezing when breathing out',
      'Shortness of breath, chest tightness, and coughing (often worse at night or during exercise)',
    ],
    causesAndRiskFactors: [
      'Allergens (pollen, dust mites), viral colds, cold air, smoke, and genetic predisposition',
    ],
    diagnosticMethods: ['Spirometry lung function testing (before and after bronchodilator) and peak flow tracking'],
    treatmentOptions: [
      'Quick-relief rescue inhalers (short-acting bronchodilators) to relax bronchiole muscles',
      'Daily controller inhalers (inhaled corticosteroids) to calm chronic airway inflammation',
      'Trigger avoidance and written asthma action plans',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'While asthma has no single permanent cure for adults, consistent controller medication and trigger control allow most people to live symptom-free, active lives.',
    preventionMeasures: ['Avoid tobacco smoke and known allergens; use prescribed preventive inhalers regularly'],
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    organId: 'lungs',
    organName: 'Human Lungs',
    affectedStructures: ['Alveoli', 'Right & Left Lung Lobes'],
    shortExplanation:
      'An infection that inflames the alveoli in one or both lungs, causing the air sacs to fill with fluid or pus and blocking oxygen transfer.',
    detailedExplanation:
      'Fluid inside alveoli lengthens the diffusion path between inhaled air and capillary blood, lowering blood oxygen saturation.',
    symptoms: [
      'Productive cough with phlegm, fever, and chills',
      'Shortness of breath and sharp chest pain when breathing deeply',
    ],
    causesAndRiskFactors: [
      'Bacteria (such as Streptococcus pneumoniae), respiratory viruses, or fungi; higher risk in older adults or weakened immunity',
    ],
    diagnosticMethods: ['Chest X-ray, pulse oximetry, blood tests, and sputum culture'],
    treatmentOptions: [
      'Targeted antibiotics for bacterial pneumonia',
      'Antivirals or supportive hydration, fever care, and supplemental oxygen when needed',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Bacterial and mild viral pneumonias are usually curable with prompt targeted antibiotics and supportive care; severe cases require hospital oxygen support.',
    preventionMeasures: ['Pneumococcal and annual influenza vaccinations, handwashing, and avoiding smoking'],
  },
  {
    id: 'copd',
    name: 'Chronic Obstructive Pulmonary Disease (COPD)',
    organId: 'lungs',
    organName: 'Human Lungs',
    affectedStructures: ['Alveoli', 'Bronchioles', 'Main Bronchi'],
    shortExplanation:
      'A progressive lung condition combining chronic airway inflammation (bronchitis) and destruction of elastic alveolar walls (emphysema), trapping stale air in the lungs.',
    detailedExplanation:
      'Loss of alveolar elastic recoil causes small bronchioles to collapse early during exhalation, reducing gas-exchange surface area.',
    symptoms: [
      'Persistent cough with mucus ("smoker’s cough")',
      'Gradually worsening breathlessness during everyday activities and frequent chest infections',
    ],
    causesAndRiskFactors: [
      'Tobacco smoking (primary cause), long-term air pollution or occupational dust exposure, and rare alpha-1 antitrypsin deficiency',
    ],
    diagnosticMethods: ['Spirometry airflow testing, chest CT/X-ray, and arterial oxygen assessment'],
    treatmentOptions: [
      'Complete smoking cessation (most effective step to slow decline)',
      'Long-acting bronchodilator inhalers, pulmonary rehabilitation, and vaccinations',
      'Supplemental home oxygen in advanced hypoxemia',
    ],
    prognosisCategory: 'No Established Cure — Supportive & Disease-Modifying Care',
    treatmentDistinction:
      'Existing structural alveolar damage in COPD cannot be cured or reversed, but quitting smoking, inhalers, and pulmonary rehabilitation dramatically relieve breathlessness and slow progression.',
    preventionMeasures: ['Never start smoking or quit promptly; wear protective masks around industrial dust and fumes'],
  },
  {
    id: 'lung-cancer',
    name: 'Lung Cancer',
    organId: 'lungs',
    organName: 'Human Lungs',
    affectedStructures: ['Main Bronchi', 'Right & Left Lung Lobes', 'Pleural Membranes'],
    shortExplanation:
      'Uncontrolled growth of abnormal cells in the bronchial linings or lung tissue, forming tumors that obstruct airways or spread.',
    detailedExplanation:
      'Divided broadly into non-small cell lung cancer (NSCLC) and small cell lung cancer (SCLC), arising from accumulated DNA damage in respiratory cells.',
    symptoms: [
      'Persistent or worsening cough, coughing up blood, or unexplained weight loss',
      'Chest pain, hoarseness, and recurring pneumonia in the same lung lobe',
    ],
    causesAndRiskFactors: [
      'Tobacco smoke, secondhand smoke, radon gas exposure, asbestos, and genetic mutations',
    ],
    diagnosticMethods: ['Low-dose chest CT scan, bronchoscopy, tissue biopsy, and molecular biomarker testing'],
    treatmentOptions: [
      'Surgical lobe removal in early localized stages',
      'Precision radiation therapy, chemotherapy, targeted gene-mutation drugs, and immunotherapy',
    ],
    prognosisCategory: 'Curable in Early Stages / Chronic Management',
    treatmentDistinction:
      'Early-stage localized lung cancer can often be cured surgically; advanced stages are treated with targeted therapies, immunotherapy, and radiation to control disease and extend life.',
    preventionMeasures: ['Avoid tobacco and secondhand smoke, test homes for radon, and follow recommended screening for high-risk adults'],
  },

  // KIDNEY DISEASES
  {
    id: 'kidney-stones',
    name: 'Kidney Stones (Nephrolithiasis)',
    organId: 'kidneys',
    organName: 'Human Kidneys',
    affectedStructures: ['Renal Calyces', 'Renal Pelvis', 'Ureter'],
    shortExplanation:
      'Hard mineral and salt crystals that form inside the kidney’s calyces or pelvis when urine becomes overly concentrated.',
    detailedExplanation:
      'Commonly made of calcium oxalate or uric acid, stones cause intense pain when they move out of the renal pelvis and stretch or block the narrow ureter.',
    symptoms: [
      'Severe, wave-like pain in the side/back radiating toward the lower abdomen or groin',
      'Pink, red, or cloudy urine, nausea, and urgent or painful urination',
    ],
    causesAndRiskFactors: [
      'Low daily water intake (dehydration), high sodium/oxalate diets, and metabolic predisposition',
    ],
    diagnosticMethods: ['Non-contrast abdominal CT scan, kidney ultrasound, urinalysis, and stone composition analysis'],
    treatmentOptions: [
      'Hydration and pain/muscle-relaxing medications for small stones likely to pass naturally',
      'Shock-wave lithotripsy (sound waves breaking stones into dust) or ureteroscopy for larger/blocking stones',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Existing stones can be passed or removed definitively, while dietary hydration adjustments are needed long-term to prevent new stones from forming.',
    preventionMeasures: ['Drink plenty of water throughout the day, moderate sodium, and follow stone-specific dietary guidance'],
  },
  {
    id: 'kidney-infection',
    name: 'Kidney Infection (Pyelonephritis)',
    organId: 'kidneys',
    organName: 'Human Kidneys',
    affectedStructures: ['Renal Pelvis', 'Renal Medulla', 'Renal Cortex', 'Ureter'],
    shortExplanation:
      'A bacterial urinary tract infection that travels upward from the bladder through the ureter into the renal pelvis and kidney tissue.',
    detailedExplanation:
      'Requires prompt medical antibiotics to clear bacteria before inflammation scars nephrons or enters the bloodstream.',
    symptoms: [
      'High fever, chills, and aching flank or lower-back pain',
      'Burning urination, frequent urgency, nausea, and cloudy or foul-smelling urine',
    ],
    causesAndRiskFactors: [
      'Ascending bacteria (most commonly E. coli), urinary obstruction (such as kidney stones), or incomplete bladder emptying',
    ],
    diagnosticMethods: ['Urinalysis and urine culture, blood tests, and kidney ultrasound if blockage is suspected'],
    treatmentOptions: [
      'Full course of prescribed oral or intravenous antibiotics',
      'Hydration and clearing any underlying urinary blockage',
    ],
    prognosisCategory: 'Manageable / Treatable',
    treatmentDistinction:
      'Prompt antibiotic treatment typically cures acute kidney infections completely without lasting kidney damage.',
    preventionMeasures: ['Stay well hydrated, treat lower bladder infections promptly, and do not delay urination'],
  },
  {
    id: 'chronic-kidney-disease',
    name: 'Chronic Kidney Disease (CKD)',
    organId: 'kidneys',
    organName: 'Human Kidneys',
    affectedStructures: ['Nephron', 'Renal Cortex', 'Renal Medulla', 'Renal Artery'],
    shortExplanation:
      'Gradual, long-term loss of nephron filtration capacity over months or years, allowing fluid and metabolic wastes to accumulate in the blood.',
    detailedExplanation:
      'Early stages often produce zero symptoms because healthy remaining nephrons work overtime; advanced loss impairs blood pressure, red blood cell production, and electrolyte balance.',
    symptoms: [
      'Often silent in early stages; later fatigue, ankle swelling, and foamy or changed urine output',
      'Loss of appetite, nausea, high blood pressure, and muscle cramps in advanced stages',
    ],
    causesAndRiskFactors: [
      'Diabetes (leading cause) and uncontrolled high blood pressure (second leading cause)',
      'Glomerular inflammation, polycystic kidney disease, or long-term overuse of certain painkillers (NSAIDs)',
    ],
    diagnosticMethods: [
      'Blood creatinine test (to calculate eGFR filtration rate)',
      'Urine albumin-to-creatinine ratio (checking protein leakage) and kidney ultrasound',
    ],
    treatmentOptions: [
      'Strict blood pressure and blood glucose control plus kidney-protective medications (ACE inhibitors, SGLT2 inhibitors)',
      'Tailored sodium, protein, and potassium nutrition planning',
      'Dialysis or kidney transplantation if disease progresses to end-stage kidney failure',
    ],
    prognosisCategory: 'No Established Cure — Supportive & Disease-Modifying Care',
    treatmentDistinction:
      'Lost nephrons cannot be regenerated, so CKD does not have a drug cure; however, early medical management can dramatically slow or halt progression for decades, and transplantation restores full filtration function.',
    preventionMeasures: ['Manage diabetes and blood pressure, stay hydrated, avoid unnecessary NSAID painkillers, and get periodic screening if at risk'],
  },

  // LIVER DISEASES
  {
    id: 'fatty-liver-disease',
    name: 'Metabolic Dysfunction-Associated Steatotic Liver Disease (Fatty Liver)',
    organId: 'liver',
    organName: 'Human Liver',
    affectedStructures: ['Right Hepatic Lobe', 'Left Hepatic Lobe'],
    shortExplanation:
      'Excess triglyceride fat accumulates inside hepatocyte liver cells, which can remain mild or progress to liver inflammation (steatohepatitis) and scarring.',
    detailedExplanation:
      'Closely linked with insulin resistance, excess body weight, and elevated blood lipids; often produces no early pain because liver parenchyma lacks pain nerves.',
    symptoms: [
      'Frequently silent in early stages',
      'Mild fatigue or dull right-upper-quadrant fullness',
      'Elevated liver enzymes detected on routine blood work',
    ],
    causesAndRiskFactors: [
      'Insulin resistance, Type 2 diabetes, obesity, high triglycerides, and sedentary habits',
    ],
    diagnosticMethods: [
      'Liver blood panel (ALT/AST), abdominal ultrasound, and transient elastography (FibroScan) stiffness measurement',
    ],
    treatmentOptions: [
      'Gradual weight management, balanced Mediterranean-style nutrition, and regular aerobic/resistance exercise',
      'Managing blood sugar and cholesterol; avoiding excess alcohol',
    ],
    prognosisCategory: 'Manageable / Reversible in Early Stages',
    treatmentDistinction:
      'Early fat accumulation inside hepatocytes is often reversible through sustained nutrition, exercise, and metabolic control before permanent scar tissue forms.',
    preventionMeasures: ['Balanced nutrition, regular physical activity, limiting added sugars, and moderating or avoiding alcohol'],
  },
  {
    id: 'hepatitis',
    name: 'Viral & Inflammatory Hepatitis',
    organId: 'liver',
    organName: 'Human Liver',
    affectedStructures: ['Right Hepatic Lobe', 'Left Hepatic Lobe', 'Common Bile Duct'],
    shortExplanation:
      'Inflammation of liver tissue—most often caused by hepatitis viruses A, B, or C, medications, or autoimmune reactions—impairing bilirubin and toxin processing.',
    detailedExplanation:
      'Swollen hepatocytes release liver enzymes into blood and can slow bile drainage, turning skin and eye whites yellow (jaundice).',
    symptoms: [
      'Yellowing of eyes and skin (jaundice) and dark tea-colored urine',
      'Fatigue, nausea, loss of appetite, and right upper abdominal discomfort',
    ],
    causesAndRiskFactors: [
      'Hepatitis A (contaminated food/water), Hepatitis B & C (blood/body fluid exposure), alcohol, or autoimmune triggers',
    ],
    diagnosticMethods: ['Viral serology blood tests, liver function panel, and hepatic ultrasound'],
    treatmentOptions: [
      'Supportive hydration and rest for acute Hepatitis A',
      'Direct-acting antiviral cures for Hepatitis C (>95% cure rate) and long-term viral suppression for chronic Hepatitis B',
    ],
    prognosisCategory: 'Curable / Manageable Depending on Type',
    treatmentDistinction:
      'Hepatitis C is now curable in most patients with short oral antiviral courses, Hepatitis A usually resolves completely, and chronic Hepatitis B is controlled long-term with antiviral therapy.',
    preventionMeasures: ['Hepatitis A and B vaccinations, safe food/water hygiene, and sterile medical/needle practices'],
  },
  {
    id: 'cirrhosis',
    name: 'Liver Cirrhosis',
    organId: 'liver',
    organName: 'Human Liver',
    affectedStructures: ['Right Hepatic Lobe', 'Left Hepatic Lobe', 'Hepatic Portal Vein'],
    shortExplanation:
      'Advanced, widespread scar tissue (fibrosis) replacing healthy soft liver lobules, stiffening the liver and obstructing portal blood flow.',
    detailedExplanation:
      'As scar nodules compress sinusoids, pressure backs up inside the hepatic portal vein (portal hypertension), causing abdominal fluid buildup (ascites) and impaired clotting.',
    symptoms: [
      'Abdominal swelling (ascites), leg edema, and easy bruising',
      'Jaundice, spider-like skin vessels, fatigue, and confusion from toxin buildup',
    ],
    causesAndRiskFactors: [
      'Chronic untreated viral hepatitis, long-term heavy alcohol use, and advanced fatty liver inflammation',
    ],
    diagnosticMethods: ['Liver elastography, ultrasound/CT/MRI, blood clotting/albumin tests, and endoscopy'],
    treatmentOptions: [
      'Treating the underlying cause immediately (antivirals, stopping alcohol) to halt further scarring',
      'Medications to lower portal pressure, diuretics for fluid, and liver transplantation in end-stage failure',
    ],
    prognosisCategory: 'No Established Drug Cure for Scar Tissue — Manageable & Transplantable',
    treatmentDistinction:
      'Dense established cirrhosis scarring cannot be erased by pills, though removing the root injury lets remaining healthy hepatocytes function stably for years; liver transplantation replaces a failing organ.',
    preventionMeasures: ['Vaccinate against Hepatitis B, avoid heavy alcohol, and treat fatty liver or Hepatitis C early'],
  },

  // EYE DISEASES
  {
    id: 'myopia-refractive-error',
    name: 'Myopia (Nearsightedness) & Refractive Errors',
    organId: 'eye',
    organName: 'Human Eye',
    affectedStructures: ['Cornea', 'Crystalline Lens', 'Retina'],
    shortExplanation:
      'An optical mismatch where eyeball length or corneal curvature focuses distant light slightly in front of the retina instead of directly onto the macula.',
    detailedExplanation:
      'Nearby objects focus sharply while distant signs appear blurred; usually develops during childhood and stabilizes in early adulthood.',
    symptoms: [
      'Blurred distant vision when reading whiteboards or road signs',
      'Squinting, eye strain, and mild headaches after prolonged visual tasks',
    ],
    causesAndRiskFactors: [
      'Genetic eye-growth traits combined with prolonged near-focus screen/reading time and limited outdoor daylight in childhood',
    ],
    diagnosticMethods: ['Visual acuity chart exam and phoropter refraction testing'],
    treatmentOptions: [
      'Prescription eyeglasses or contact lenses to redirect focal point onto the retina',
      'Laser corneal reshaping (LASIK/PRK) in eligible adults',
    ],
    prognosisCategory: 'Correctable Optical Condition',
    treatmentDistinction:
      'Glasses and contacts instantly correct focus while worn; refractive laser surgery permanently reshapes the cornea in suitable adult eyes.',
    preventionMeasures: ['Encourage daily outdoor daylight time in children and regular 20-20-20 screen breaks'],
  },
  {
    id: 'cataracts',
    name: 'Cataracts',
    organId: 'eye',
    organName: 'Human Eye',
    affectedStructures: ['Crystalline Lens'],
    shortExplanation:
      'Gradual clouding of proteins inside the eye’s natural crystalline lens, scattering incoming light and dimming colors and night vision.',
    detailedExplanation:
      'Normally transparent lens crystallin proteins clump with age or UV exposure, turning the lens hazy yellow-white.',
    symptoms: [
      'Cloudy, hazy, or washed-out vision like looking through frosted glass',
      'Glare and halos around headlights at night',
    ],
    causesAndRiskFactors: [
      'Natural aging, cumulative UV sunlight exposure, diabetes, smoking, and prolonged steroid medications',
    ],
    diagnosticMethods: ['Slit-lamp biomicroscope examination and dilated retinal check'],
    treatmentOptions: [
      'Updated glasses and brighter lighting in early mild clouding',
      'Outpatient cataract surgery replacing the cloudy natural lens with a crystal-clear artificial intraocular lens (IOL)',
    ],
    prognosisCategory: 'Curable Surgically',
    treatmentDistinction:
      'No eye drops dissolve cataracts, but brief modern lens-replacement surgery permanently cures the clouding and restores clear vision.',
    preventionMeasures: ['Wear UV-blocking sunglasses outdoors, avoid smoking, and manage blood sugar'],
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    organId: 'eye',
    organName: 'Human Eye',
    affectedStructures: ['Optic Nerve', 'Retina', 'Iris & Pupil'],
    shortExplanation:
      'A group of eye conditions—often linked to elevated fluid pressure inside the eye—that gradually damages optic nerve fibers and peripheral vision.',
    detailedExplanation:
      'Because central vision stays clear until late stages, open-angle glaucoma is often called the "silent thief of sight" without routine eye exams.',
    symptoms: [
      'Often zero pain or early warning in open-angle glaucoma',
      'Gradual blind spots in side (peripheral) vision; sudden severe eye pain and halos in acute angle-closure emergencies',
    ],
    causesAndRiskFactors: [
      'Impaired aqueous humor drainage raising intraocular pressure, advancing age, and family history',
    ],
    diagnosticMethods: ['Tonometry (eye pressure check), optic nerve OCT imaging, and peripheral visual field testing'],
    treatmentOptions: [
      'Daily pressure-lowering prescription eye drops',
      'Laser trabeculoplasty or micro-drainage surgery to protect remaining optic nerve axons',
    ],
    prognosisCategory: 'No Cure for Lost Nerve Fibers — Preventable Progression via Management',
    treatmentDistinction:
      'Existing optic nerve damage cannot be reversed, so early screening and lifelong pressure-lowering treatment are essential to preserve remaining sight.',
    preventionMeasures: ['Schedule regular dilated eye exams including eye pressure and optic nerve checks'],
  },

  // INTESTINAL DISEASES
  {
    id: 'celiac-disease',
    name: 'Celiac Disease',
    organId: 'intestines',
    organName: 'Human Intestines',
    affectedStructures: ['Duodenum', 'Jejunum & Ileum'],
    shortExplanation:
      'An autoimmune reaction triggered by eating gluten (a protein in wheat, barley, and rye) that inflames and flattens absorptive villi in the small intestine.',
    detailedExplanation:
      'Without intact finger-like villi, the small intestine struggles to absorb iron, calcium, vitamins, and calories.',
    symptoms: [
      'Bloating, chronic diarrhea or abdominal pain, and unexplained weight loss',
      'Iron-deficiency anemia, fatigue, and delayed growth in children',
    ],
    causesAndRiskFactors: ['Genetic HLA-DQ2/DQ8 susceptibility plus dietary gluten exposure'],
    diagnosticMethods: ['Blood tissue transglutaminase antibody (tTG-IgA) test and upper endoscopy small-bowel biopsy'],
    treatmentOptions: [
      'Strict lifelong gluten-free diet allowing small-intestinal villi to heal completely',
      'Targeted iron, vitamin D, and B12 supplementation during recovery',
    ],
    prognosisCategory: 'Manageable / Complete Mucosal Healing with Diet',
    treatmentDistinction:
      'While the autoimmune predisposition remains lifelong, strict avoidance of gluten completely heals the intestinal lining and eliminates symptoms.',
    preventionMeasures: ['Careful label reading and cross-contamination avoidance after diagnosis'],
  },
  {
    id: 'inflammatory-bowel-disease',
    name: 'Inflammatory Bowel Disease (Crohn’s & Ulcerative Colitis)',
    organId: 'intestines',
    organName: 'Human Intestines',
    affectedStructures: ['Jejunum & Ileum', 'Ascending, Transverse & Descending Colon', 'Sigmoid Colon & Rectum'],
    shortExplanation:
      'Chronic immune-mediated inflammation of the digestive tract causing recurring episodes of intestinal ulceration, cramping, and diarrhea.',
    detailedExplanation:
      'Ulcerative colitis affects the continuous inner lining of the colon and rectum, whereas Crohn’s disease can cause deep patchy inflammation anywhere along the GI tract, especially the terminal ileum.',
    symptoms: [
      'Persistent diarrhea (sometimes with blood), abdominal cramping, and urgent bowel movements',
      'Fatigue, weight loss, and anemia during flare-ups',
    ],
    causesAndRiskFactors: ['Dysregulated gut immune response, genetic predisposition, and microbiome/environmental triggers'],
    diagnosticMethods: ['Colonoscopy with biopsies, stool calprotectin inflammation marker, and MRI enterography'],
    treatmentOptions: [
      'Targeted anti-inflammatory and biologic immunomodulator medications to achieve remission',
      'Nutritional therapy and surgical resection for strictures or severe refractory colon disease',
    ],
    prognosisCategory: 'Chronic Relapsing-Remitting — Manageable into Remission',
    treatmentDistinction:
      'Modern biologic therapies induce long-term mucosal remission rather than a one-time medication cure; colectomy can cure ulcerative colitis of the colon itself.',
    preventionMeasures: ['Consistent maintenance medication, smoke avoidance (especially in Crohn’s), and routine colon surveillance'],
  },
  {
    id: 'appendicitis',
    name: 'Acute Appendicitis',
    organId: 'intestines',
    organName: 'Human Intestines',
    affectedStructures: ['Cecum & Appendix'],
    shortExplanation:
      'Sudden blockage and bacterial inflammation of the appendix lumen in the lower right abdomen, risking rupture if left untreated.',
    detailedExplanation:
      'Swelling cuts off blood supply to the appendix wall; prompt surgical removal prevents abdominal infection (peritonitis).',
    symptoms: [
      'Pain starting near the belly button and shifting sharply to the lower right abdomen',
      'Nausea, loss of appetite, low-grade fever, and rebound tenderness',
    ],
    causesAndRiskFactors: ['Hardened stool (fecalith) or swollen lymphoid tissue blocking the appendix opening'],
    diagnosticMethods: ['Clinical abdominal exam, white blood cell test, abdominal ultrasound, or CT scan'],
    treatmentOptions: [
      'Prompt laparoscopic appendectomy (minimally invasive surgical removal) with antibiotics',
      'Selected uncomplicated cases may be evaluated for antibiotic-first protocols under surgical supervision',
    ],
    prognosisCategory: 'Emergency / Curable Surgically',
    treatmentDistinction:
      'Urgent appendectomy provides a rapid, complete permanent cure with full return to normal digestion.',
    preventionMeasures: ['No guaranteed prevention; seek prompt medical evaluation for worsening lower-right abdominal pain'],
  },

  // PANCREAS DISEASES
  {
    id: 'diabetes-mellitus',
    name: 'Diabetes Mellitus (Type 1 & Type 2)',
    organId: 'pancreas',
    organName: 'Human Pancreas',
    affectedStructures: ['Islets of Langerhans', 'Pancreatic Body & Tail'],
    shortExplanation:
      'A chronic metabolic disorder in which blood glucose stays elevated because pancreatic beta cells produce too little insulin (Type 1) or body tissues resist insulin (Type 2).',
    detailedExplanation:
      'Persistently high blood sugar gradually injures microscopic capillaries in the kidneys, retina, nerves, and coronary arteries.',
    symptoms: [
      'Increased thirst, frequent urination, and unexplained fatigue',
      'Blurred vision, slow-healing cuts, or unexplained weight loss (especially Type 1)',
    ],
    causesAndRiskFactors: [
      'Type 1: Autoimmune destruction of islet beta cells; Type 2: Insulin resistance linked to genetics, visceral weight, and inactivity',
    ],
    diagnosticMethods: ['Fasting blood glucose, Hemoglobin A1c (3-month average), and oral glucose tolerance testing'],
    treatmentOptions: [
      'Insulin therapy (essential in Type 1) via pens, pumps, and continuous glucose monitors',
      'Nutrition planning, regular physical activity, and glucose-lowering medications (metformin, SGLT2 inhibitors, GLP-1 therapies) for Type 2',
    ],
    prognosisCategory: 'Manageable Chronic Condition (Type 2 Remission Possible)',
    treatmentDistinction:
      'Type 1 diabetes requires lifelong insulin replacement; early Type 2 diabetes can often enter long-term medication-free remission with sustained metabolic and weight management.',
    preventionMeasures: ['Type 2 risk drops dramatically with regular exercise, high-fiber balanced meals, and healthy weight maintenance'],
  },
  {
    id: 'pancreatitis',
    name: 'Pancreatitis (Acute & Chronic)',
    organId: 'pancreas',
    organName: 'Human Pancreas',
    affectedStructures: ['Main Pancreatic Duct (Duct of Wirsung)', 'Pancreatic Head & Neck', 'Pancreatic Body & Tail'],
    shortExplanation:
      'Painful inflammation caused when digestive enzymes activate prematurely inside the pancreas itself rather than waiting until reaching the duodenum.',
    detailedExplanation:
      'Gallstones blocking the shared bile-pancreatic ampulla or heavy alcohol intake are the two leading triggers.',
    symptoms: [
      'Severe upper abdominal pain radiating straight through to the back',
      'Nausea, vomiting, fever, and rapid pulse',
    ],
    causesAndRiskFactors: ['Gallstones obstructing the pancreatic duct, heavy alcohol use, and very high triglycerides'],
    diagnosticMethods: ['Elevated blood lipase/amylase tests, abdominal ultrasound, and contrast CT scan'],
    treatmentOptions: [
      'Hospital IV fluids, pain management, bowel rest, and removing obstructing gallstones via ERCP',
      'Alcohol cessation and oral pancreatic enzyme replacement capsules if chronic damage reduces enzyme output',
    ],
    prognosisCategory: 'Acute Forms Recover / Chronic Requires Management',
    treatmentDistinction:
      'Mild acute pancreatitis resolves completely once gallstones or triggers are removed, whereas chronic pancreatitis causes lasting scarring managed with pain care and enzyme pills.',
    preventionMeasures: ['Moderate or avoid alcohol, manage triglycerides, and treat symptomatic gallstones'],
  },

  // SKIN DISEASES
  {
    id: 'eczema',
    name: 'Atopic Dermatitis (Eczema)',
    organId: 'skin',
    organName: 'Human Skin',
    affectedStructures: ['Epidermis', 'Dermis'],
    shortExplanation:
      'A common inflammatory condition weakening the epidermis’s moisture barrier, causing dry, itchy, red patches prone to flares.',
    detailedExplanation:
      'Defects in barrier proteins like filaggrin let water escape and allow irritants and allergens to trigger dermal immune inflammation.',
    symptoms: [
      'Intense itching, dry scaly skin, and inflamed patches inside elbows, behind knees, or on hands',
    ],
    causesAndRiskFactors: ['Genetic skin-barrier sensitivity, dry weather, harsh soaps, allergens, and family history of asthma/allergies'],
    diagnosticMethods: ['Clinical dermatological exam and allergy/patch testing when needed'],
    treatmentOptions: [
      'Daily fragrance-free thick ceramide moisturizers to rebuild the epidermal barrier',
      'Short-course topical corticosteroids, non-steroidal anti-inflammatory creams, or biologics for severe flares',
    ],
    prognosisCategory: 'Manageable / Often Improves With Age',
    treatmentDistinction:
      'Many children outgrow eczema; in persistent cases, consistent barrier moisturizing and targeted anti-inflammatory creams keep skin clear and comfortable.',
    preventionMeasures: ['Use lukewarm showers, gentle soap-free cleansers, and apply moisturizer immediately after bathing'],
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    organId: 'skin',
    organName: 'Human Skin',
    affectedStructures: ['Epidermis', 'Dermis'],
    shortExplanation:
      'An immune-mediated condition speeding up epidermal keratinocyte turnover from ~28 days to just 3–5 days, piling up thick silvery-white plaques.',
    detailedExplanation:
      'Overactive immune cytokines stimulate dermal capillaries and rapid epidermal cell growth, commonly on elbows, knees, and scalp.',
    symptoms: [
      'Raised red plaques topped with silvery scales on elbows, knees, scalp, or lower back',
      'Nail pitting or joint stiffness in associated psoriatic arthritis',
    ],
    causesAndRiskFactors: ['Genetic immune signaling variants, strep infections, skin injury, and stress'],
    diagnosticMethods: ['Clinical dermatology inspection and occasional skin biopsy'],
    treatmentOptions: [
      'Topical vitamin D analogs and corticosteroids, narrowband UVB phototherapy',
      'Targeted systemic biologic medications blocking IL-17/IL-23 pathways for moderate-to-severe disease',
    ],
    prognosisCategory: 'Manageable Long-Term — High Clearance With Modern Therapy',
    treatmentDistinction:
      'Although psoriasis has a chronic genetic predisposition, modern targeted biologics and phototherapy frequently achieve near-total skin clearance.',
    preventionMeasures: ['Avoid skin trauma/sunburn, manage stress, avoid smoking, and maintain consistent dermatologic care'],
  },
  {
    id: 'melanoma',
    name: 'Melanoma',
    organId: 'skin',
    organName: 'Human Skin',
    affectedStructures: ['Epidermis', 'Dermis', 'Hypodermis (Subcutaneous Layer)'],
    shortExplanation:
      'The most serious form of skin cancer, arising from UV-damaged pigment-producing melanocytes in the basal epidermis.',
    detailedExplanation:
      'While highly curable when caught thin inside the epidermis, deeper invasion into the dermis grants access to blood and lymphatic vessels.',
    symptoms: [
      'A new or changing mole following the ABCDE rule: Asymmetry, irregular Border, varied Color, Diameter >6 mm, or Evolving size/shape',
    ],
    causesAndRiskFactors: ['Cumulative ultraviolet sunlight or tanning-bed exposure, blistering childhood sunburns, and fair/sun-sensitive skin'],
    diagnosticMethods: ['Dermoscopy magnification exam and full excisional skin biopsy'],
    treatmentOptions: [
      'Wide surgical excision cures early thin melanomas completely',
      'Sentinel lymph node staging, immunotherapy, and targeted BRAF/MEK inhibitors for deeper or metastatic stages',
    ],
    prognosisCategory: 'Curable in Early Stages / Immunotherapy in Advanced Stages',
    treatmentDistinction:
      'Early localized melanoma is routinely cured by simple surgical removal; survival depends strongly on catching suspicious moles early before dermal spread.',
    preventionMeasures: ['Apply broad-spectrum SPF 30+ sunscreen, wear UPF hats/clothing, avoid tanning beds, and monitor moles'],
  },
];

