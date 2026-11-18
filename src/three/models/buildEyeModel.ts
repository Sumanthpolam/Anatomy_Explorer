import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';

const _tempVec = new THREE.Vector3();

export function buildEyeModel(_maxAnisotropy: number): BuiltAnatomyModel {
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
        mesh.userData.organId = 'eye';
        mesh.castShadow = !options?.fadeInCutaway;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'eye',
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

  // Orient globe facing +Z slightly angled
  // 1. CORNEA (crystal clear anterior dome)
  const corneaGroup = new THREE.Group();
  const corneaGeo = track(new THREE.SphereGeometry(0.48, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.42));
  corneaGeo.rotateX(Math.PI / 2);
  const corneaMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      metalness: 0.02,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
    }),
  );
  const corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
  corneaMesh.position.set(0, 0, 0.72);
  corneaMesh.renderOrder = 8;
  corneaGroup.add(corneaMesh);
  addPart(
    'cornea',
    'Cornea',
    corneaGroup,
    new THREE.Vector3(0, 0, 0.95),
    new THREE.Vector3(0, 0.25, 1.12),
    { hideInCutaway: true, defaultOpacity: 0.42 },
  );

  // 2. IRIS & PUPIL (pigmented muscular ring + central dark pupil disc)
  const irisGroup = new THREE.Group();
  const irisGeo = track(new THREE.RingGeometry(0.16, 0.42, 36));
  const irisMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.38,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
  );
  const irisMesh = new THREE.Mesh(irisGeo, irisMat);
  irisMesh.position.set(0, 0, 0.78);
  irisGroup.add(irisMesh);

  const pupilGeo = track(new THREE.CircleGeometry(0.16, 28));
  const pupilMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x090d16,
      side: THREE.DoubleSide,
    }),
  );
  const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
  pupilMesh.position.set(0, 0, 0.775);
  irisGroup.add(pupilMesh);

  addPart(
    'iris-pupil',
    'Iris & Pupil',
    irisGroup,
    new THREE.Vector3(0, 0, 0.65),
    new THREE.Vector3(0.32, 0.12, 0.8),
  );

  // 3. CRYSTALLINE LENS (biconvex amber-clear optical disc behind iris)
  const lensGroup = new THREE.Group();
  const lensGeo = track(new THREE.SphereGeometry(0.32, 28, 22));
  lensGeo.scale(1.0, 1.0, 0.48);
  const lensMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.12,
      metalness: 0.02,
      transparent: true,
      opacity: 0.78,
      clearcoat: 0.9,
    }),
  );
  const lensMesh = new THREE.Mesh(lensGeo, lensMat);
  lensMesh.position.set(0, 0, 0.52);
  lensGroup.add(lensMesh);
  addPart(
    'crystalline-lens',
    'Crystalline Lens',
    lensGroup,
    new THREE.Vector3(0, 0, 0.35),
    new THREE.Vector3(0, -0.22, 0.56),
    { defaultOpacity: 0.78 },
  );

  // 4. SCLERA (tough off-white outer shell wrapping globe)
  const scleraGroup = new THREE.Group();
  const scleraGeo = track(new THREE.SphereGeometry(0.95, 36, 32, 0, Math.PI * 2, 0.45, Math.PI - 0.45));
  scleraGeo.rotateX(Math.PI / 2);
  const scleraMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf5f2eb,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.55,
      side: THREE.DoubleSide,
    }),
  );
  const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
  scleraGroup.add(scleraMesh);
  addPart(
    'sclera',
    'Sclera',
    scleraGroup,
    new THREE.Vector3(-0.75, 0, 0),
    new THREE.Vector3(-0.88, 0.25, 0.2),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 5. RETINA (warm orange-amber inner sensory cup + macula spot)
  const retinaGroup = new THREE.Group();
  const retinaGeo = track(new THREE.SphereGeometry(0.84, 32, 26, 0, Math.PI * 2, 0.65, Math.PI - 0.65));
  retinaGeo.rotateX(Math.PI / 2);
  const retinaMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      roughness: 0.38,
      metalness: 0.04,
      side: THREE.DoubleSide,
    }),
  );
  const retinaMesh = new THREE.Mesh(retinaGeo, retinaMat);
  retinaGroup.add(retinaMesh);

  // Macula / fovea spot on posterior inner wall
  const maculaGeo = track(new THREE.SphereGeometry(0.11, 16, 14));
  maculaGeo.scale(1, 1, 0.3);
  const maculaMat = track(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
  const macula = new THREE.Mesh(maculaGeo, maculaMat);
  macula.position.set(0, 0, -0.82);
  retinaGroup.add(macula);
  addPart(
    'retina',
    'Retina',
    retinaGroup,
    new THREE.Vector3(0.75, 0, -0.2),
    new THREE.Vector3(0.55, -0.2, -0.45),
  );

  // 6. OPTIC NERVE (posterior cable exiting toward brain)
  const opticGroup = new THREE.Group();
  const opticMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.04,
      clearcoat: 0.25,
    }),
  );
  const opticCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.14, -0.05, -0.86),
    new THREE.Vector3(-0.22, -0.08, -1.22),
    new THREE.Vector3(-0.34, -0.1, -1.56),
  ]);
  opticGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(opticCurve, 18, 0.14, 14, false)), opticMat));
  addPart(
    'optic-nerve',
    'Optic Nerve',
    opticGroup,
    new THREE.Vector3(-0.2, 0, -0.75),
    new THREE.Vector3(-0.24, 0.06, -1.25),
  );

  // Phototransduction impulse animation (photons entering cornea -> optic nerve pulse)
  const rayPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 1.45),
    new THREE.Vector3(0, 0, 0.78),
    new THREE.Vector3(0, 0, 0.52),
    new THREE.Vector3(0, 0, -0.82),
    new THREE.Vector3(-0.32, -0.1, -1.52),
  ]);
  const pGeo = track(new THREE.SphereGeometry(0.036, 8, 8));
  const pMat = track(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
  const photons = new THREE.InstancedMesh(pGeo, pMat, 12);
  photons.frustumCulled = false;
  photons.renderOrder = 10;
  root.add(photons);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    photons.visible = animatePhysiology;
    if (animatePhysiology) {
      // Subtle pupil accommodation breath
      const pupilPulse = 1 + Math.sin(elapsed * 1.4) * 0.12;
      pupilMesh.scale.setScalar(pupilPulse);
      for (let i = 0; i < 12; i++) {
        const t = (elapsed * 0.36 + i / 12) % 1;
        rayPath.getPointAt(t, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.85 + Math.sin(t * Math.PI) * 0.4);
        dummy.updateMatrix();
        photons.setMatrixAt(i, dummy.matrix);
      }
      photons.instanceMatrix.needsUpdate = true;
    } else {
      pupilMesh.scale.setScalar(1);
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
