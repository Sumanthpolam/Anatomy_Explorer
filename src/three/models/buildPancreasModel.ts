import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';

const _tempVec = new THREE.Vector3();

export function buildPancreasModel(_maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

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
        mesh.userData.organId = 'pancreas';
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'pancreas',
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

  // 1. PANCREATIC HEAD & NECK (broad lobulated head cradled on anatomical right / -X)
  const headGroup = new THREE.Group();
  const headMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.44,
      metalness: 0.03,
      clearcoat: 0.25,
    }),
  );
  const headGeo = track(new THREE.SphereGeometry(0.42, 26, 22));
  headGeo.scale(1.0, 1.15, 0.62);
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.position.set(-0.62, -0.22, 0.0);
  headGroup.add(headMesh);

  // Lobule bumps on head
  [
    [-0.78, -0.02, 0.16, 0.14],
    [-0.52, -0.45, 0.14, 0.15],
    [-0.32, -0.1, 0.08, 0.16],
  ].forEach(([x, y, z, r]) => {
    const b = new THREE.Mesh(track(new THREE.SphereGeometry(r, 14, 12)), headMat);
    b.position.set(x, y, z);
    headGroup.add(b);
  });

  addPart(
    'pancreatic-head',
    'Pancreatic Head & Neck',
    headGroup,
    new THREE.Vector3(-0.55, -0.2, 0.2),
    new THREE.Vector3(-0.62, -0.2, 0.3),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 2. PANCREATIC BODY & TAIL (tapered horizontal lobulated gland reaching +X)
  const bodyGroup = new THREE.Group();
  const bodyMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      roughness: 0.44,
      metalness: 0.03,
      clearcoat: 0.25,
    }),
  );
  const bodyCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, -0.08, 0.02),
    new THREE.Vector3(0.08, 0.08, 0.08),
    new THREE.Vector3(0.54, 0.22, 0.0),
    new THREE.Vector3(0.98, 0.34, -0.08),
  ]);
  const bodyTube = new THREE.Mesh(track(new THREE.TubeGeometry(bodyCurve, 28, 0.24, 14, false)), bodyMat);
  bodyTube.scale.set(1, 0.92, 0.68);
  bodyGroup.add(bodyTube);

  // Tapered tail tip + lobulated surface clusters
  const tailTip = new THREE.Mesh(track(new THREE.SphereGeometry(0.15, 16, 14)), bodyMat);
  tailTip.scale.set(1.4, 0.85, 0.65);
  tailTip.position.set(1.06, 0.36, -0.08);
  bodyGroup.add(tailTip);

  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const p = bodyCurve.getPointAt(t);
    const lob = new THREE.Mesh(track(new THREE.SphereGeometry(0.12 - t * 0.04, 12, 10)), bodyMat);
    lob.position.set(p.x, p.y + (i % 2 === 0 ? 0.1 : -0.1), p.z + 0.08);
    bodyGroup.add(lob);
  }

  addPart(
    'pancreatic-body-tail',
    'Pancreatic Body & Tail',
    bodyGroup,
    new THREE.Vector3(0.45, 0.25, 0.15),
    new THREE.Vector3(0.42, 0.22, 0.24),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 3. MAIN PANCREATIC DUCT (Duct of Wirsung running centrally along spine)
  const ductGroup = new THREE.Group();
  const ductMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.08,
      clearcoat: 0.65,
    }),
  );
  const ductCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.95, 0.32, -0.04),
    new THREE.Vector3(0.48, 0.2, 0.02),
    new THREE.Vector3(0.06, 0.06, 0.08),
    new THREE.Vector3(-0.34, -0.08, 0.03),
    new THREE.Vector3(-0.62, -0.26, 0.02),
    new THREE.Vector3(-0.88, -0.32, 0.04),
  ]);
  ductGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(ductCurve, 32, 0.048, 12, false)), ductMat));
  // Side ductules
  [0.2, 0.45, 0.7].forEach((t) => {
    const p = ductCurve.getPointAt(t);
    const br = new THREE.CatmullRomCurve3([p, new THREE.Vector3(p.x, p.y + 0.18, p.z + 0.04)]);
    ductGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(br, 8, 0.022, 8, false)), ductMat));
  });
  addPart(
    'pancreatic-duct',
    'Main Pancreatic Duct',
    ductGroup,
    new THREE.Vector3(0, 0, 0.65),
    new THREE.Vector3(0.05, 0.08, 0.22),
  );

  // 4. ISLETS OF LANGERHANS (scattered emerald endocrine clusters)
  const isletsGroup = new THREE.Group();
  const isletMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.55,
    }),
  );
  const isletCoords: Array<[number, number, number]> = [
    [-0.54, -0.14, 0.18],
    [-0.18, 0.04, 0.16],
    [0.14, 0.12, 0.18],
    [0.36, 0.18, 0.15],
    [0.62, 0.26, 0.12],
    [0.82, 0.3, 0.06],
    [0.94, 0.34, 0.0],
    [0.48, 0.14, -0.06],
  ];
  isletCoords.forEach(([x, y, z]) => {
    const m = new THREE.Mesh(track(new THREE.SphereGeometry(0.065, 14, 12)), isletMat);
    m.position.set(x, y, z);
    isletsGroup.add(m);
  });
  addPart(
    'islets-of-langerhans',
    'Islets of Langerhans',
    isletsGroup,
    new THREE.Vector3(0.15, 0.55, 0.45),
    new THREE.Vector3(0.62, 0.28, 0.2),
  );

  // Endocrine & enzyme secretion animation
  const pGeo = track(new THREE.SphereGeometry(0.032, 8, 8));
  const pMat = track(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  const juiceParticles = new THREE.InstancedMesh(pGeo, pMat, 12);
  juiceParticles.frustumCulled = false;
  juiceParticles.renderOrder = 10;
  root.add(juiceParticles);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    juiceParticles.visible = animatePhysiology;
    if (animatePhysiology) {
      for (let i = 0; i < 12; i++) {
        const t = (elapsed * 0.28 + i / 12) % 1;
        ductCurve.getPointAt(t, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.35);
        dummy.updateMatrix();
        juiceParticles.setMatrixAt(i, dummy.matrix);
      }
      juiceParticles.instanceMatrix.needsUpdate = true;
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
