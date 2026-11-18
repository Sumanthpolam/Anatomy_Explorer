import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createMuscleFiberTexture } from '../proceduralTextures';

const _tempVec = new THREE.Vector3();

export function buildHeartModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const muscleTex = track(createMuscleFiberTexture('#c81e3a', '#7f1d1d', maxAnisotropy));

  const addPart = (
    id: string,
    label: string,
    group: THREE.Group,
    explodeOffset: THREE.Vector3,
    anchorLocal: THREE.Vector3,
    options?: { hideInCutaway?: boolean; fadeInCutaway?: boolean; defaultOpacity?: number },
  ) => {
    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.layers.enable(1);
        mesh.userData.partId = id;
        mesh.userData.organId = 'heart';
        mesh.castShadow = !options?.fadeInCutaway;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'heart',
      meshes,
      group,
      basePosition: group.position.clone(),
      explodeOffset,
      anchorLocal,
      hideInCutaway: options?.hideInCutaway,
      fadeInCutaway: options?.fadeInCutaway,
      defaultOpacity: options?.defaultOpacity ?? 1,
    });
  };

  // Heart anatomical group that beats subtly
  const heartBeatTarget = root;

  // 1. PERICARDIUM (outer protective translucent sac)
  const pericardiumGroup = new THREE.Group();
  const periGeo = track(new THREE.SphereGeometry(1.16, 36, 32));
  periGeo.scale(0.95, 1.18, 0.86);
  const periMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.22,
      metalness: 0.02,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
    }),
  );
  const periMesh = new THREE.Mesh(periGeo, periMat);
  periMesh.position.set(0, -0.05, 0);
  periMesh.rotation.z = 0.18;
  periMesh.renderOrder = 8;
  pericardiumGroup.add(periMesh);
  addPart(
    'pericardium',
    'Pericardium',
    pericardiumGroup,
    new THREE.Vector3(0, 0, 1.05),
    new THREE.Vector3(0.9, -0.4, 0.5),
    { hideInCutaway: true, defaultOpacity: 0.16 },
  );

  // 2. EPICARDIUM (outer visceral heart wall + coronary arteries)
  const epicardiumGroup = new THREE.Group();
  const epiGeo = track(new THREE.SphereGeometry(0.97, 36, 32));
  epiGeo.scale(0.9, 1.14, 0.8);
  const epiMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfb923c,
      roughness: 0.28,
      metalness: 0.04,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      clearcoat: 0.65,
    }),
  );
  const epiMesh = new THREE.Mesh(epiGeo, epiMat);
  epiMesh.position.set(0, -0.08, 0);
  epiMesh.rotation.z = 0.2;
  epiMesh.renderOrder = 6;
  epicardiumGroup.add(epiMesh);
  addPart(
    'epicardium',
    'Epicardium',
    epicardiumGroup,
    new THREE.Vector3(-0.95, 0, 0.55),
    new THREE.Vector3(-0.7, 0.2, 0.65),
    { hideInCutaway: true, defaultOpacity: 0.28 },
  );

  // 2b. CORONARY ARTERIES, CARDIAC VEIN & CORONARY SINUS (individually selectable)
  const corArtMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.45,
    }),
  );
  const corVeinMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.34,
      metalness: 0.06,
      clearcoat: 0.4,
    }),
  );

  // Left Coronary Artery (short main stem)
  const lcaGroup = new THREE.Group();
  const lcaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.06, 0.48, 0.26),
    new THREE.Vector3(0.11, 0.42, 0.48),
    new THREE.Vector3(0.15, 0.36, 0.58),
  ]);
  lcaGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(lcaCurve, 14, 0.032, 10, false)), corArtMat.clone()));
  lcaGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'left-coronary-artery',
    'Left Coronary Artery',
    lcaGroup,
    new THREE.Vector3(0.25, 0.2, 0.55),
    new THREE.Vector3(0.12, 0.42, 0.52),
  );

  // Left Anterior Descending Artery (LAD)
  const ladGroup = new THREE.Group();
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.15, 0.36, 0.58),
    new THREE.Vector3(0.16, 0.1, 0.72),
    new THREE.Vector3(0.22, -0.35, 0.65),
    new THREE.Vector3(0.32, -0.78, 0.38),
  ]);
  ladGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(ladCurve, 28, 0.028, 10, false)), corArtMat.clone()));
  // Diagonal branch
  const diagCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.18, 0.05, 0.71),
    new THREE.Vector3(0.42, -0.18, 0.64),
    new THREE.Vector3(0.58, -0.45, 0.42),
  ]);
  ladGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(diagCurve, 14, 0.018, 8, false)), corArtMat.clone()));
  ladGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'left-anterior-descending-artery',
    'Left Anterior Descending Artery',
    ladGroup,
    new THREE.Vector3(0.25, -0.15, 0.7),
    new THREE.Vector3(0.22, -0.22, 0.68),
  );

  // Circumflex Artery
  const circGroup = new THREE.Group();
  const circCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.15, 0.36, 0.58),
    new THREE.Vector3(0.46, 0.25, 0.52),
    new THREE.Vector3(0.68, 0.14, 0.18),
    new THREE.Vector3(0.62, 0.04, -0.28),
  ]);
  circGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(circCurve, 22, 0.026, 10, false)), corArtMat.clone()));
  circGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'circumflex-artery',
    'Circumflex Artery',
    circGroup,
    new THREE.Vector3(0.65, 0.15, 0.35),
    new THREE.Vector3(0.58, 0.18, 0.42),
  );

  // Right Coronary Artery (RCA)
  const rcaGroup = new THREE.Group();
  const rcaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, 0.42, 0.38),
    new THREE.Vector3(-0.46, 0.2, 0.54),
    new THREE.Vector3(-0.56, -0.15, 0.44),
    new THREE.Vector3(-0.36, -0.58, 0.24),
    new THREE.Vector3(-0.12, -0.72, -0.12),
  ]);
  rcaGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(rcaCurve, 26, 0.028, 10, false)), corArtMat.clone()));
  rcaGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'right-coronary-artery',
    'Right Coronary Artery',
    rcaGroup,
    new THREE.Vector3(-0.65, -0.1, 0.45),
    new THREE.Vector3(-0.52, 0.02, 0.52),
  );

  // Great Cardiac Vein
  const gcvGroup = new THREE.Group();
  const gcvCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.28, -0.68, 0.44),
    new THREE.Vector3(0.24, -0.24, 0.67),
    new THREE.Vector3(0.24, 0.15, 0.69),
    new THREE.Vector3(0.49, 0.22, 0.48),
    new THREE.Vector3(0.66, 0.1, 0.08),
  ]);
  gcvGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(gcvCurve, 26, 0.024, 10, false)), corVeinMat.clone()));
  gcvGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'great-cardiac-vein',
    'Great Cardiac Vein',
    gcvGroup,
    new THREE.Vector3(0.45, -0.05, 0.6),
    new THREE.Vector3(0.32, 0.05, 0.68),
  );

  // Coronary Sinus (posterior venous collector emptying into right atrium)
  const csGroup = new THREE.Group();
  const csCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.62, 0.08, -0.24),
    new THREE.Vector3(0.28, 0.06, -0.48),
    new THREE.Vector3(-0.18, 0.1, -0.44),
    new THREE.Vector3(-0.36, 0.18, -0.22),
  ]);
  csGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(csCurve, 20, 0.044, 12, false)), corVeinMat.clone()));
  csGroup.traverse((o) => { if ((o as THREE.Mesh).isMesh) track((o as THREE.Mesh).material as THREE.Material); });
  addPart(
    'coronary-sinus',
    'Coronary Sinus',
    csGroup,
    new THREE.Vector3(0, 0.05, -0.75),
    new THREE.Vector3(0.18, 0.08, -0.5),
  );

  // Atrial Auricle (scalloped anterior muscular ear-flap pouches)
  const auricleGroup = new THREE.Group();
  const aurMat = track(
    new THREE.MeshPhysicalMaterial({
      map: muscleTex,
      color: 0xd97706,
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.3,
    }),
  );
  const rAurGeo = track(new THREE.SphereGeometry(0.16, 18, 16));
  rAurGeo.scale(1.1, 0.72, 0.65);
  const rAur = new THREE.Mesh(rAurGeo, aurMat);
  rAur.position.set(-0.34, 0.5, 0.24);
  rAur.rotation.z = -0.32;
  auricleGroup.add(rAur);

  const lAurGeo = track(new THREE.SphereGeometry(0.15, 18, 16));
  lAurGeo.scale(1.05, 0.7, 0.62);
  const lAur = new THREE.Mesh(lAurGeo, aurMat);
  lAur.position.set(0.36, 0.5, 0.16);
  lAur.rotation.z = 0.28;
  auricleGroup.add(lAur);
  addPart(
    'auricle',
    'Atrial Auricle',
    auricleGroup,
    new THREE.Vector3(0, 0.55, 0.55),
    new THREE.Vector3(-0.36, 0.52, 0.34),
  );


  // 3. MYOCARDIUM (thick muscular outer anterior/lateral wall shell)
  const myocardiumGroup = new THREE.Group();
  const myoGeo = track(new THREE.SphereGeometry(0.88, 36, 32, 0, Math.PI * 2, 0.3, Math.PI - 0.3));
  myoGeo.scale(0.88, 1.12, 0.78);
  const myoMat = track(
    new THREE.MeshPhysicalMaterial({
      map: muscleTex,
      color: 0xe11d48,
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    }),
  );
  const myoMesh = new THREE.Mesh(myoGeo, myoMat);
  myoMesh.position.set(0, -0.1, 0);
  myoMesh.rotation.z = 0.2;
  myocardiumGroup.add(myoMesh);
  addPart(
    'myocardium',
    'Myocardium',
    myocardiumGroup,
    new THREE.Vector3(0.95, -0.15, 0.55),
    new THREE.Vector3(0.68, -0.25, 0.55),
    { fadeInCutaway: true, defaultOpacity: 0.92 },
  );

  // 4. ENDOCARDIUM (smooth inner lining inside chambers)
  const endocardiumGroup = new THREE.Group();
  const endoMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 0.85,
      side: THREE.DoubleSide,
    }),
  );
  const endoLeftGeo = track(new THREE.SphereGeometry(0.32, 24, 20));
  endoLeftGeo.scale(0.82, 1.25, 0.72);
  const endoLeft = new THREE.Mesh(endoLeftGeo, endoMat);
  endoLeft.position.set(0.28, -0.28, 0.06);
  endocardiumGroup.add(endoLeft);

  const endoRightGeo = track(new THREE.SphereGeometry(0.29, 24, 20));
  endoRightGeo.scale(0.82, 1.15, 0.72);
  const endoRight = new THREE.Mesh(endoRightGeo, endoMat);
  endoRight.position.set(-0.28, -0.24, 0.08);
  endocardiumGroup.add(endoRight);

  addPart(
    'endocardium',
    'Endocardium',
    endocardiumGroup,
    new THREE.Vector3(0, -0.85, 0.2),
    new THREE.Vector3(0.3, -0.5, 0.35),
  );

  // 5. FOUR CHAMBERS + SEPTUM
  const makeChamber = (
    id: string,
    label: string,
    color: number,
    pos: [number, number, number],
    scale: [number, number, number],
    explode: THREE.Vector3,
    anchor: THREE.Vector3,
  ) => {
    const g = new THREE.Group();
    const geo = track(new THREE.SphereGeometry(0.34, 24, 20));
    geo.scale(...scale);
    const mat = track(
      new THREE.MeshPhysicalMaterial({
        map: muscleTex,
        color,
        roughness: 0.38,
        metalness: 0.06,
        clearcoat: 0.35,
      }),
    );
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    g.add(m);
    addPart(id, label, g, explode, anchor);
  };

  // Anatomical Right is viewer's Left (-X), Anatomical Left is viewer's Right (+X)
  makeChamber(
    'right-atrium',
    'Right Atrium',
    0x0ea5e9,
    [-0.4, 0.38, 0.02],
    [0.85, 0.82, 0.8],
    new THREE.Vector3(-0.7, 0.45, 0),
    new THREE.Vector3(-0.55, 0.45, 0.2),
  );
  makeChamber(
    'left-atrium',
    'Left Atrium',
    0xfb7185,
    [0.36, 0.42, -0.1],
    [0.85, 0.78, 0.78],
    new THREE.Vector3(0.7, 0.45, -0.2),
    new THREE.Vector3(0.5, 0.48, 0.1),
  );
  makeChamber(
    'right-ventricle',
    'Right Ventricle',
    0x0284c7,
    [-0.28, -0.24, 0.1],
    [0.95, 1.32, 0.85],
    new THREE.Vector3(-0.6, -0.4, 0.2),
    new THREE.Vector3(-0.45, -0.25, 0.35),
  );
  makeChamber(
    'left-ventricle',
    'Left Ventricle',
    0xdc2626,
    [0.3, -0.3, 0.05],
    [0.98, 1.5, 0.88],
    new THREE.Vector3(0.6, -0.45, 0.2),
    new THREE.Vector3(0.45, -0.35, 0.35),
  );

  // Interventricular Septum
  const septumGroup = new THREE.Group();
  const sepGeo = track(new THREE.CapsuleGeometry(0.11, 0.78, 8, 16));
  sepGeo.scale(0.65, 1.0, 1.8);
  const sepMat = track(
    new THREE.MeshPhysicalMaterial({
      map: muscleTex,
      color: 0xbe123c,
      roughness: 0.45,
      metalness: 0.05,
    }),
  );
  const sepMesh = new THREE.Mesh(sepGeo, sepMat);
  sepMesh.position.set(0.01, -0.18, 0.04);
  sepMesh.rotation.z = 0.16;
  septumGroup.add(sepMesh);
  addPart(
    'septum',
    'Interventricular Septum',
    septumGroup,
    new THREE.Vector3(0, -0.2, -0.65),
    new THREE.Vector3(0.02, -0.18, 0.32),
  );

  // 6. FOUR HEART VALVES (distinct sculpted cusps & rings)
  const makeValve = (
    id: string,
    label: string,
    color: number,
    pos: [number, number, number],
    rot: [number, number, number],
    cusps: number,
    explode: THREE.Vector3,
  ) => {
    const g = new THREE.Group();
    g.position.set(...pos);
    g.rotation.set(...rot);
    const vMat = track(
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.7,
      }),
    );
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.13, 0.022, 10, 24)), vMat);
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    for (let i = 0; i < cusps; i++) {
      const a = (i / cusps) * Math.PI * 2;
      const leaflet = new THREE.Mesh(track(new THREE.ConeGeometry(0.075, 0.12, 10)), vMat);
      leaflet.position.set(Math.cos(a) * 0.055, -0.04, Math.sin(a) * 0.055);
      leaflet.rotation.x = Math.PI;
      g.add(leaflet);
    }
    addPart(id, label, g, explode, new THREE.Vector3(...pos));
  };

  makeValve(
    'tricuspid-valve',
    'Tricuspid Valve',
    0x38bdf8,
    [-0.3, 0.12, 0.09],
    [0.15, 0, -0.2],
    3,
    new THREE.Vector3(-0.35, 0.12, 0.65),
  );
  makeValve(
    'mitral-valve',
    'Mitral Valve',
    0xf97316,
    [0.3, 0.14, 0.04],
    [0.15, 0, 0.2],
    2,
    new THREE.Vector3(0.35, 0.14, 0.65),
  );
  makeValve(
    'pulmonary-valve',
    'Pulmonary Valve',
    0x06b6d4,
    [-0.14, 0.45, 0.22],
    [0.2, 0, 0],
    3,
    new THREE.Vector3(-0.2, 0.65, 0.55),
  );
  makeValve(
    'aortic-valve',
    'Aortic Valve',
    0xf59e0b,
    [0.12, 0.44, 0.06],
    [0.1, 0, 0],
    3,
    new THREE.Vector3(0.2, 0.65, 0.45),
  );

  // 7. GREAT VESSELS
  // Aorta (iconic arch + 3 supra-aortic branches)
  const aortaGroup = new THREE.Group();
  const aortaMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.4,
    }),
  );
  const aortaArchCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.44, 0.04),
    new THREE.Vector3(-0.02, 0.92, 0.12),
    new THREE.Vector3(0.16, 1.15, -0.05),
    new THREE.Vector3(0.22, 0.72, -0.34),
    new THREE.Vector3(0.16, -0.65, -0.38),
  ]);
  aortaGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(aortaArchCurve, 40, 0.125, 16, false)), aortaMat),
  );
  // 3 aortic arch branches
  [
    [-0.02, 1.08, 0.06, -0.1, 1.44, 0.08],
    [0.08, 1.14, 0.0, 0.08, 1.48, 0.0],
    [0.18, 1.1, -0.08, 0.25, 1.44, -0.1],
  ].forEach(([x1, y1, z1, x2, y2, z2]) => {
    const bCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    aortaGroup.add(
      new THREE.Mesh(track(new THREE.TubeGeometry(bCurve, 10, 0.042, 10, false)), aortaMat),
    );
  });
  addPart(
    'aorta',
    'Aorta',
    aortaGroup,
    new THREE.Vector3(0.15, 0.85, -0.2),
    new THREE.Vector3(0.08, 1.15, 0.12),
  );

  // Pulmonary Arteries (trunk + left/right split)
  const paGroup = new THREE.Group();
  const paMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.34,
      metalness: 0.05,
      clearcoat: 0.35,
    }),
  );
  const paTrunk = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.14, 0.42, 0.22),
    new THREE.Vector3(-0.08, 0.78, 0.24),
    new THREE.Vector3(0.05, 0.88, 0.08),
  ]);
  paGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(paTrunk, 20, 0.105, 14, false)), paMat));
  const paLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, 0.87, 0.08),
    new THREE.Vector3(0.52, 0.88, 0.02),
    new THREE.Vector3(0.84, 0.82, -0.06),
  ]);
  paGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(paLeft, 16, 0.075, 12, false)), paMat));
  const paRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, 0.86, 0.08),
    new THREE.Vector3(-0.46, 0.84, -0.05),
    new THREE.Vector3(-0.82, 0.78, -0.12),
  ]);
  paGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(paRight, 16, 0.075, 12, false)), paMat));
  addPart(
    'pulmonary-arteries',
    'Pulmonary Arteries',
    paGroup,
    new THREE.Vector3(-0.1, 0.65, 0.45),
    new THREE.Vector3(0.45, 0.88, 0.15),
  );

  // Pulmonary Veins (4 vessels into left atrium)
  const pvGroup = new THREE.Group();
  const pvMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.36,
      metalness: 0.04,
    }),
  );
  [
    [0.42, 0.52, -0.18, 0.88, 0.58, -0.22],
    [0.42, 0.38, -0.2, 0.86, 0.34, -0.24],
    [0.16, 0.5, -0.24, -0.58, 0.56, -0.26],
    [0.16, 0.36, -0.26, -0.58, 0.32, -0.28],
  ].forEach(([x1, y1, z1, x2, y2, z2]) => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2),
    ]);
    pvGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(c, 12, 0.045, 10, false)), pvMat));
  });
  addPart(
    'pulmonary-veins',
    'Pulmonary Veins',
    pvGroup,
    new THREE.Vector3(0.65, 0.25, -0.55),
    new THREE.Vector3(0.75, 0.52, -0.2),
  );

  // Superior Vena Cava
  const svcGroup = new THREE.Group();
  const veinMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      roughness: 0.38,
      metalness: 0.05,
    }),
  );
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.46, 0.55, 0.02),
    new THREE.Vector3(-0.48, 0.98, 0.04),
    new THREE.Vector3(-0.44, 1.32, 0.02),
  ]);
  svcGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(svcCurve, 18, 0.095, 14, false)), veinMat));
  addPart(
    'superior-vena-cava',
    'Superior Vena Cava',
    svcGroup,
    new THREE.Vector3(-0.65, 0.65, 0.1),
    new THREE.Vector3(-0.48, 1.05, 0.1),
  );

  // Inferior Vena Cava
  const ivcGroup = new THREE.Group();
  const ivcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.18, -0.14),
    new THREE.Vector3(-0.44, -0.35, -0.2),
    new THREE.Vector3(-0.44, -0.88, -0.2),
  ]);
  ivcGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(ivcCurve, 18, 0.105, 14, false)), veinMat));
  addPart(
    'inferior-vena-cava',
    'Inferior Vena Cava',
    ivcGroup,
    new THREE.Vector3(-0.65, -0.55, -0.2),
    new THREE.Vector3(-0.44, -0.65, -0.15),
  );

  // 8. ANIMATED BLOOD CIRCULATION PARTICLES (InstancedMesh along deoxygenated & oxygenated paths)
  const deoxyPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.46, 1.25, 0.04),
    new THREE.Vector3(-0.42, 0.42, 0.04),
    new THREE.Vector3(-0.3, 0.1, 0.1),
    new THREE.Vector3(-0.28, -0.3, 0.16),
    new THREE.Vector3(-0.14, 0.44, 0.22),
    new THREE.Vector3(-0.04, 0.85, 0.16),
    new THREE.Vector3(0.75, 0.82, -0.04),
  ]);

  const oxyPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.82, 0.56, -0.2),
    new THREE.Vector3(0.38, 0.42, -0.06),
    new THREE.Vector3(0.3, 0.12, 0.06),
    new THREE.Vector3(0.3, -0.38, 0.08),
    new THREE.Vector3(0.12, 0.46, 0.06),
    new THREE.Vector3(0.02, 1.04, 0.06),
    new THREE.Vector3(0.2, 0.72, -0.34),
    new THREE.Vector3(0.16, -0.6, -0.38),
  ]);

  const particleGeo = track(new THREE.SphereGeometry(0.036, 10, 8));
  const deoxyParticleMat = track(
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
  );
  const oxyParticleMat = track(
    new THREE.MeshBasicMaterial({ color: 0xfb7185 }),
  );

  const particleCount = 22;
  const deoxyParticles = new THREE.InstancedMesh(particleGeo, deoxyParticleMat, particleCount);
  const oxyParticles = new THREE.InstancedMesh(particleGeo, oxyParticleMat, particleCount);
  deoxyParticles.frustumCulled = false;
  oxyParticles.frustumCulled = false;
  deoxyParticles.renderOrder = 10;
  oxyParticles.renderOrder = 10;
  root.add(deoxyParticles);
  root.add(oxyParticles);

  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    deoxyParticles.visible = animatePhysiology;
    oxyParticles.visible = animatePhysiology;

    if (animatePhysiology) {
      // Realistic cardiac cycle systole/diastole pulse (~72 BPM -> 1.2 Hz)
      const phase = (elapsed * 1.2) % 1;
      const lub = Math.exp(-Math.pow((phase - 0.18) / 0.06, 2)) * 0.045;
      const dub = Math.exp(-Math.pow((phase - 0.36) / 0.05, 2)) * 0.022;
      heartBeatTarget.scale.setScalar(1 + lub + dub);

      for (let i = 0; i < particleCount; i++) {
        const t1 = (elapsed * 0.24 + i / particleCount) % 1;
        deoxyPath.getPointAt(t1, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.85 + Math.sin(t1 * Math.PI) * 0.35);
        dummy.updateMatrix();
        deoxyParticles.setMatrixAt(i, dummy.matrix);

        const t2 = (elapsed * 0.24 + 0.5 + i / particleCount) % 1;
        oxyPath.getPointAt(t2, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.85 + Math.sin(t2 * Math.PI) * 0.35);
        dummy.updateMatrix();
        oxyParticles.setMatrixAt(i, dummy.matrix);
      }
      deoxyParticles.instanceMatrix.needsUpdate = true;
      oxyParticles.instanceMatrix.needsUpdate = true;
    } else {
      heartBeatTarget.scale.setScalar(1);
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
