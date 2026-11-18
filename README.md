# Human Anatomy Explorer

An interactive full-stack 3D anatomy atlas and medical science education platform built with **React**, **TypeScript**, **Three.js**, **Tailwind CSS**, and **Node.js / Express**.

Styled with an archival editorial gallery aesthetic inspired by interactive anatomy atlases, designed for classroom science exhibitions, academic demonstrations, and self-paced human biology study.

## Key Features

- **Nine Interactive 3D Organ Modules**: **Heart**, **Brain**, **Lungs**, **Liver**, **Kidneys**, **Eye**, **Intestines**, **Pancreas**, and **Skin**, plus a clickable **Full Human Body** overview.
- **Labelled Reference Plates (`public/images/`)**: High-resolution labelled anatomical plates for `heart-anatomy.png`, `lungs-anatomy.png`, `brain-anatomy.png`, and `kidney-anatomy.png` with aspect-ratio preservation, lightbox enlargement, and clickable hotspot markers synced bidirectionally with the 3D viewer—plus interactive museum SVG schematics for Liver, Eye, Intestines, Pancreas, and Skin.
- **Interactive 3D Workbench**: Orbit, zoom (`+`/`-` & scroll), clickable 3D hotspot dots, **Isolate** structure, **Cross-section** cutaway clipping, **Layers** exploded view, physiological animations, and side-by-side **Compare Organs**.
- **Comprehensive Heart Vasculature & Layers**: Independently selectable **Pericardium**, **Epicardium**, **Myocardium**, **Endocardium**, 4 chambers, atrial **Auricle**, septum, 4 valves, 5 great vessels, and coronary vasculature (**Right coronary artery**, **Left coronary artery**, **Circumflex artery**, **Left anterior descending artery**, **Great cardiac vein**, **Coronary sinus**).
- **Anatomically Accurate Brain Divisions**: **Cerebrum** (Frontal, Parietal, Temporal, Occipital lobes), **Cerebellum**, and **Brainstem** (explicitly subdivided into **Midbrain**, **Pons**, and **Medulla Oblongata**), plus deep **Thalamus**, **Hypothalamus**, **Hippocampus**, and **Amygdala**.
- **Guided Lessons, Clinical Notes & 22-Question Quiz**: Step-by-step physiological lessons per organ, microscopic histology notes, responsible clinical condition guides distinguishing cures from management, multilingual UI support (`EN` / `ES` / `FR`), and instant-feedback quizzes.
- **One-Click Project ZIP Export**: Download the complete runnable project archive directly from the header (`Download ZIP` -> `/api/export-zip`).

## 3D Modeling Note

To guarantee fast loading on standard laptops, clean licensing, and zero external CDN failures, all 3D anatomical specimens and surface textures are procedurally sculpted in Three.js (`src/three/`) using physically based materials (`MeshPhysicalMaterial`), studio `RoomEnvironment` lighting, coronal clipping planes, and paired with the labelled reference diagrams in `public/images/`.

## Local Installation (VS Code Terminal)

1. Extract the downloaded ZIP folder and open it in **Visual Studio Code**.
2. Open the integrated terminal and run:

```bash
npm install
npm run dev
```

3. Open your browser to:
   - **Application URL**: `http://localhost:3000`
   - **API Health Check**: `http://localhost:3000/api/health`

### Production Build

```bash
npm run build
npm start
```

## REST API Endpoints

- `GET /api/health` — Server and dataset summary
- `GET /api/organs` — List all 9 organs (optional `?category=`)
- `GET /api/organs/:id` — Detailed organ overview, microscopic view, and diagram hotspots
- `GET /api/organs/:id/parts` — Selectable anatomical structures for an organ
- `GET /api/organs/:id/diseases` — Conditions linked to an organ
- `GET /api/diseases` — Complete clinical notes & pathology dataset (optional `?organId=`)
- `GET /api/diseases/:id` — Individual disease details
- `GET /api/search?q=` — Cross-search organs, body systems, anatomical structures, and diseases
- `GET /api/quizzes` — Educational quiz questions (optional `?category=` and `?organId=`)
- `GET /api/export-zip` — Download complete project archive as `.zip`

## Educational Disclaimer

All anatomical explanations, disease summaries, and treatment overviews in Human Anatomy Explorer are provided strictly for science education and academic study. They do not constitute medical diagnosis or clinical advice.
