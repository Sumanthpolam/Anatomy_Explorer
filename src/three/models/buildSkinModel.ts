import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';

const _tempVec = new THREE.Vector3();

export function buildSkinModel(_maxAnisotropy: number): BuiltAnatomyModel {
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
        mesh.userData.organId = 'skin';
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'skin',
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

  // Anatomical 3D histological skin tissue block (1.7 x 1.25 x 1.25)
  // 1. EPIDERMIS (top stratified waterproof layer)
  const epiGroup = new THREE.Group();
  const epiGeo = track(new THREE.BoxGeometry(1.75, 0.18, 1.25));
  const epiMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfdba74,
      roughness: 0.46,
      metalness: 0.02,
      clearcoat: 0.25,
    }),
  );
  const epiMesh = new THREE.Mesh(epiGeo, epiMat);
  epiMesh.position.set(0, 0.56, 0);
  epiGroup.add(epiMesh);
  addPart(
    'epidermis',
    'Epidermis',
    epiGroup,
    new THREE.Vector3(0, 0.65, 0),
    new THREE.Vector3(-0.55, 0.62, 0.52),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 2. DERMIS (thick middle vascular & sensory matrix)
  const dermisGroup = new THREE.Group();
  const dermisGeo = track(new THREE.BoxGeometry(1.75, 0.58, 1.25));
  const dermisMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfb7185,
      roughness: 0.42,
      metalness: 0.03,
      transparent: true,
      opacity: 0.88,
    }),
  );
  const dermisMesh = new THREE.Mesh(dermisGeo, dermisMat);
  dermisMesh.position.set(0, 0.18, 0);
  dermisGroup.add(dermisMesh);
  addPart(
    'dermis',
    'Dermis',
    dermisGroup,
    new THREE.Vector3(0, 0.15, 0),
    new THREE.Vector3(0.55, 0.22, 0.55),
    { fadeInCutaway: true, defaultOpacity: 0.88 },
  );

  // 3. HYPODERMIS (subcutaneous fat lobule cushion at base)
  const hypoGroup = new THREE.Group();
  const hypoGeo = track(new THREE.BoxGeometry(1.75, 0.34, 1.25));
  const hypoMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.3,
    }),
  );
  const hypoMesh = new THREE.Mesh(hypoGeo, hypoMat);
  hypoMesh.position.set(0, -0.28, 0);
  hypoGroup.add(hypoMesh);
  // Adipose fat globules along front cutaway face
  for (let i = -3; i <= 3; i++) {
    const g = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 12, 10)), hypoMat);
    g.position.set(i * 0.22, -0.28, 0.58);
    hypoGroup.add(g);
  }
  addPart(
    'hypodermis',
    'Hypodermis',
    hypoGroup,
    new THREE.Vector3(0, -0.55, 0),
    new THREE.Vector3(-0.45, -0.32, 0.62),
  );

  // 4. HAIR FOLLICLE & SEBACEOUS GLAND (anchored in dermis protruding above epidermis)
  const hairGroup = new THREE.Group();
  const hairMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x78350f,
      roughness: 0.4,
      metalness: 0.05,
    }),
  );
  const shaftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, -0.08, 0.22),
    new THREE.Vector3(-0.22, 0.32, 0.22),
    new THREE.Vector3(-0.14, 0.68, 0.22),
    new THREE.Vector3(-0.02, 1.08, 0.22),
  ]);
  hairGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(shaftCurve, 22, 0.038, 10, false)), hairMat));
  const bulb = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 16, 14)), hairMat);
  bulb.position.set(-0.28, -0.08, 0.22);
  hairGroup.add(bulb);

  const sebMat = track(new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.35 }));
  const sebGland = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 16, 14)), sebMat);
  sebGland.scale.set(1.2, 0.85, 0.85);
  sebGland.position.set(-0.08, 0.34, 0.22);
  hairGroup.add(sebGland);

  addPart(
    'hair-follicle-sebaceous',
    'Hair Follicle & Sebaceous Gland',
    hairGroup,
    new THREE.Vector3(-0.55, 0.4, 0.45),
    new THREE.Vector3(-0.12, 0.85, 0.25),
  );

  // 5. ECCRINE SWEAT GLAND (coiled tubule in deep dermis rising to epidermal pore)
  const sweatGroup = new THREE.Group();
  const sweatMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.26,
      metalness: 0.06,
      clearcoat: 0.5,
    }),
  );
  const coilPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    if (t < 0.45) {
      const a = t * Math.PI * 6;
      coilPts.push(new THREE.Vector3(0.42 + Math.cos(a) * 0.11, -0.04 + t * 0.16, 0.2 + Math.sin(a) * 0.1));
    } else {
      const u = (t - 0.45) / 0.55;
      coilPts.push(new THREE.Vector3(0.42 + Math.sin(u * Math.PI * 4) * 0.035, 0.03 + u * 0.64, 0.2));
    }
  }
  const sweatCurve = new THREE.CatmullRomCurve3(coilPts);
  sweatGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(sweatCurve, 44, 0.026, 10, false)), sweatMat));
  addPart(
    'sweat-gland',
    'Eccrine Sweat Gland',
    sweatGroup,
    new THREE.Vector3(0.55, 0.25, 0.45),
    new THREE.Vector3(0.44, 0.45, 0.26),
  );

  // Sweat secretion animation rising out of pore
  const pGeo = track(new THREE.SphereGeometry(0.028, 8, 8));
  const pMat = track(new THREE.MeshBasicMaterial({ color: 0x0ea5e9 }));
  const sweatParticles = new THREE.InstancedMesh(pGeo, pMat, 10);
  sweatParticles.frustumCulled = false;
  sweatParticles.renderOrder = 10;
  root.add(sweatParticles);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    sweatParticles.visible = animatePhysiology;
    if (animatePhysiology) {
      for (let i = 0; i < 10; i++) {
        const t = (elapsed * 0.35 + i / 10) % 1;
        sweatCurve.getPointAt(t, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.35);
        dummy.updateMatrix();
        sweatParticles.setMatrixAt(i, dummy.matrix);
      }
      sweatParticles.instanceMatrix.needsUpdate = true;
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
