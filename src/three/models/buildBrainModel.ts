import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createFoliaTexture, createGyriTexture } from '../proceduralTextures';

function displaceCortexVertices(geo: THREE.BufferGeometry, seedOffset: number) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const wave =
      Math.sin(x * 11 + seedOffset) * Math.cos(y * 12) * 0.024 +
      Math.sin(z * 13 - seedOffset) * Math.cos(x * 9) * 0.02;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    pos.setXYZ(i, x + (x / len) * wave, y + (y / len) * wave, z + (z / len) * wave);
  }
  geo.computeVertexNormals();
}

export function buildBrainModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const gyri = createGyriTexture('#e5a3b0', '#7f3c4e', maxAnisotropy);
  track(gyri.map);
  track(gyri.bumpMap);

  const folia = createFoliaTexture(maxAnisotropy);
  track(folia.map);
  track(folia.bumpMap);

  const addPart = (
    id: string,
    label: string,
    group: THREE.Group,
    explodeOffset: THREE.Vector3,
    anchorLocal: THREE.Vector3,
    options?: { hideInCutaway?: boolean; fadeInCutaway?: boolean },
  ) => {
    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.layers.enable(1);
        mesh.userData.partId = id;
        mesh.userData.organId = 'brain';
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'brain',
      meshes,
      group,
      basePosition: group.position.clone(),
      explodeOffset,
      anchorLocal,
      hideInCutaway: options?.hideInCutaway,
      fadeInCutaway: options?.fadeInCutaway,
    });
  };

  const makeCortexMat = (tint: number) =>
    track(
      new THREE.MeshPhysicalMaterial({
        map: gyri.map,
        bumpMap: gyri.bumpMap,
        bumpScale: 0.035,
        color: tint,
        roughness: 0.52,
        metalness: 0.02,
        clearcoat: 0.18,
      }),
    );

  // Note: Right hemisphere lobes fade slightly in cutaway mode so deep limbic structures are visible!
  const buildPairedLobe = (
    id: string,
    label: string,
    tint: number,
    buildHalf: (side: -1 | 1) => THREE.BufferGeometry,
    posOffset: [number, number, number],
    explodeOffset: THREE.Vector3,
    anchorLocal: THREE.Vector3,
  ) => {
    const group = new THREE.Group();
    const matLeft = makeCortexMat(tint);
    const matRight = makeCortexMat(tint);
    matRight.transparent = true;

    const geoL = track(buildHalf(-1));
    displaceCortexVertices(geoL, 1.2);
    const meshL = new THREE.Mesh(geoL, matLeft);
    meshL.position.set(-posOffset[0], posOffset[1], posOffset[2]);
    group.add(meshL);

    const geoR = track(buildHalf(1));
    displaceCortexVertices(geoR, 2.7);
    const meshR = new THREE.Mesh(geoR, matRight);
    meshR.position.set(posOffset[0], posOffset[1], posOffset[2]);
    // Tag right hemisphere for cutaway fade
    meshR.userData.cutawayFadeMesh = true;
    group.add(meshR);

    addPart(id, label, group, explodeOffset, anchorLocal, { fadeInCutaway: true });
  };

  // 1. FRONTAL LOBE (+Z is anterior/front)
  buildPairedLobe(
    'frontal-lobe',
    'Frontal Lobe',
    0x93c5fd,
    () => {
      const g = new THREE.SphereGeometry(0.48, 28, 24);
      g.scale(0.78, 0.92, 1.18);
      return g;
    },
    [0.34, 0.34, 0.44],
    new THREE.Vector3(0, 0.32, 0.72),
    new THREE.Vector3(-0.42, 0.48, 0.78),
  );

  // 2. PARIETAL LOBE (superior-posterior)
  buildPairedLobe(
    'parietal-lobe',
    'Parietal Lobe',
    0x67e8f9,
    () => {
      const g = new THREE.SphereGeometry(0.44, 28, 24);
      g.scale(0.82, 0.86, 1.05);
      return g;
    },
    [0.33, 0.48, -0.22],
    new THREE.Vector3(0, 0.65, -0.35),
    new THREE.Vector3(-0.4, 0.72, -0.25),
  );

  // 3. TEMPORAL LOBE (lateral-inferior)
  buildPairedLobe(
    'temporal-lobe',
    'Temporal Lobe',
    0xfdba74,
    (side) => {
      const g = new THREE.SphereGeometry(0.32, 24, 20);
      g.scale(0.72, 0.74, 1.48);
      g.rotateY(side * 0.14);
      return g;
    },
    [0.54, -0.02, 0.1],
    new THREE.Vector3(0, -0.1, 0.15),
    new THREE.Vector3(-0.68, 0.0, 0.18),
  );

  // 4. OCCIPITAL LOBE (posterior pole, -Z)
  buildPairedLobe(
    'occipital-lobe',
    'Occipital Lobe',
    0xd8b4fe,
    () => {
      const g = new THREE.SphereGeometry(0.35, 24, 20);
      g.scale(0.8, 0.84, 0.96);
      return g;
    },
    [0.27, 0.15, -0.72],
    new THREE.Vector3(0, 0.12, -0.75),
    new THREE.Vector3(-0.34, 0.2, -0.92),
  );

  // 5. CEREBELLUM (Major Division: tucked posteriorly beneath occipital lobes)
  const cerebellumGroup = new THREE.Group();
  const cereMat = track(
    new THREE.MeshPhysicalMaterial({
      map: folia.map,
      bumpMap: folia.bumpMap,
      bumpScale: 0.03,
      color: 0xf472b6,
      roughness: 0.48,
      metalness: 0.02,
      clearcoat: 0.2,
    }),
  );
  for (const side of [-1, 1]) {
    const cGeo = track(new THREE.SphereGeometry(0.31, 24, 20));
    cGeo.scale(0.95, 0.74, 0.86);
    const cMesh = new THREE.Mesh(cGeo, cereMat);
    cMesh.position.set(side * 0.24, -0.4, -0.58);
    cerebellumGroup.add(cMesh);
  }
  const vermisGeo = track(new THREE.SphereGeometry(0.18, 16, 14));
  vermisGeo.scale(0.65, 0.85, 0.9);
  const vermisMesh = new THREE.Mesh(vermisGeo, cereMat);
  vermisMesh.position.set(0, -0.4, -0.56);
  cerebellumGroup.add(vermisMesh);
  addPart(
    'cerebellum',
    'Cerebellum',
    cerebellumGroup,
    new THREE.Vector3(0, -0.45, -0.72),
    new THREE.Vector3(0, -0.42, -0.82),
  );

  // 6. BRAINSTEM SUBDIVISIONS (Midbrain, Pons, Medulla Oblongata)
  const makeStemMat = (color: number) =>
    track(
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.4,
        metalness: 0.04,
        clearcoat: 0.25,
      }),
    );

  // Midbrain
  const midbrainGroup = new THREE.Group();
  const midGeo = track(new THREE.CylinderGeometry(0.15, 0.135, 0.22, 18));
  const midMesh = new THREE.Mesh(midGeo, makeStemMat(0x60a5fa));
  midMesh.position.set(0, -0.15, -0.14);
  midMesh.rotation.x = 0.24;
  midbrainGroup.add(midMesh);
  addPart(
    'midbrain',
    'Midbrain (Brainstem)',
    midbrainGroup,
    new THREE.Vector3(0, -0.15, -0.1),
    new THREE.Vector3(0, -0.15, -0.02),
  );

  // Pons (characteristic anterior rounded bridge)
  const ponsGroup = new THREE.Group();
  const ponsGeo = track(new THREE.SphereGeometry(0.2, 20, 18));
  ponsGeo.scale(1.05, 0.92, 1.0);
  const ponsMesh = new THREE.Mesh(ponsGeo, makeStemMat(0x38bdf8));
  ponsMesh.position.set(0, -0.38, -0.16);
  ponsGroup.add(ponsMesh);
  addPart(
    'pons',
    'Pons (Brainstem)',
    ponsGroup,
    new THREE.Vector3(0, -0.42, 0.18),
    new THREE.Vector3(0, -0.38, 0.04),
  );

  // Medulla Oblongata (tapering down into spinal cord)
  const medullaGroup = new THREE.Group();
  const medGeo = track(new THREE.CylinderGeometry(0.135, 0.088, 0.36, 18));
  const medMesh = new THREE.Mesh(medGeo, makeStemMat(0x22d3ee));
  medMesh.position.set(0, -0.7, -0.24);
  medMesh.rotation.x = 0.14;
  medullaGroup.add(medMesh);
  addPart(
    'medulla-oblongata',
    'Medulla Oblongata (Brainstem)',
    medullaGroup,
    new THREE.Vector3(0, -0.75, -0.15),
    new THREE.Vector3(0, -0.72, -0.12),
  );

  // 7. DEEP / LIMBIC STRUCTURES (Thalamus, Hypothalamus, Hippocampus, Amygdala)
  // Thalamus (paired central relay ovals)
  const thalamusGroup = new THREE.Group();
  const thalMat = makeStemMat(0xeab308);
  for (const side of [-1, 1]) {
    const tGeo = track(new THREE.SphereGeometry(0.14, 18, 16));
    tGeo.scale(0.75, 0.85, 1.25);
    const tMesh = new THREE.Mesh(tGeo, thalMat);
    tMesh.position.set(side * 0.11, 0.1, -0.08);
    thalamusGroup.add(tMesh);
  }
  addPart(
    'thalamus',
    'Thalamus',
    thalamusGroup,
    new THREE.Vector3(0, 0.25, 0.05),
    new THREE.Vector3(0.12, 0.12, 0.02),
  );

  // Hypothalamus
  const hypoGroup = new THREE.Group();
  const hypoGeo = track(new THREE.ConeGeometry(0.095, 0.18, 14));
  hypoGeo.rotateX(Math.PI);
  const hypoMesh = new THREE.Mesh(hypoGeo, makeStemMat(0xf59e0b));
  hypoMesh.position.set(0, -0.02, 0.06);
  hypoGroup.add(hypoMesh);
  addPart(
    'hypothalamus',
    'Hypothalamus',
    hypoGroup,
    new THREE.Vector3(0, 0.0, 0.35),
    new THREE.Vector3(0, -0.02, 0.14),
  );

  // Hippocampus (curved C-shaped seahorse arches)
  const hippoGroup = new THREE.Group();
  const hippoMat = makeStemMat(0x10b981);
  for (const side of [-1, 1]) {
    const hCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.24, -0.08, 0.16),
      new THREE.Vector3(side * 0.28, -0.04, -0.04),
      new THREE.Vector3(side * 0.23, 0.12, -0.22),
      new THREE.Vector3(side * 0.12, 0.22, -0.14),
    ]);
    const hMesh = new THREE.Mesh(track(new THREE.TubeGeometry(hCurve, 20, 0.048, 10, false)), hippoMat);
    hippoGroup.add(hMesh);
  }
  addPart(
    'hippocampus',
    'Hippocampus',
    hippoGroup,
    new THREE.Vector3(0, -0.25, 0.25),
    new THREE.Vector3(0.28, -0.04, 0.02),
  );

  // Amygdala (almond nodes anterior to hippocampus)
  const amygGroup = new THREE.Group();
  const amygMat = makeStemMat(0xec4899);
  for (const side of [-1, 1]) {
    const aGeo = track(new THREE.SphereGeometry(0.072, 16, 14));
    aGeo.scale(0.85, 0.9, 1.1);
    const aMesh = new THREE.Mesh(aGeo, amygMat);
    aMesh.position.set(side * 0.24, -0.08, 0.24);
    amygGroup.add(aMesh);
  }
  addPart(
    'amygdala',
    'Amygdala',
    amygGroup,
    new THREE.Vector3(0, -0.2, 0.55),
    new THREE.Vector3(0.25, -0.08, 0.28),
  );

  // Subtle neural impulse wave along deep/brainstem structures when animated
  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    const pulse = animatePhysiology ? (Math.sin(elapsed * 2.8) + 1) * 0.5 : 0;
    root.position.y = animatePhysiology ? Math.sin(elapsed * 1.1) * 0.018 : 0;
    hippoMat.emissiveIntensity = 0.08 + pulse * 0.18;
    thalMat.emissiveIntensity = 0.06 + pulse * 0.15;
  };

  return { root, parts, disposeables, updateAnimation };
}
