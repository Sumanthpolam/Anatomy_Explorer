import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createMuscleFiberTexture } from '../proceduralTextures';

export function buildHumanBody(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  // Translucent anatomical body shell material calibrated for light archival studio
  const shellMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.04,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      clearcoat: 0.35,
      side: THREE.DoubleSide,
    }),
  );

  const boneMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.06,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  );

  // Outer Human Silhouette (sculpted Lathe torso + sculpted limbs + head)
  const bodyShellGroup = new THREE.Group();

  // Torso lathe profile (pelvis -> waist -> chest -> shoulders -> neck)
  const torsoProfile = [
    new THREE.Vector2(0.01, -0.58),
    new THREE.Vector2(0.27, -0.52),
    new THREE.Vector2(0.32, -0.34),
    new THREE.Vector2(0.25, -0.05),
    new THREE.Vector2(0.35, 0.32),
    new THREE.Vector2(0.38, 0.56),
    new THREE.Vector2(0.14, 0.68),
    new THREE.Vector2(0.11, 0.84),
    new THREE.Vector2(0.01, 0.86),
  ];
  const torsoGeo = track(new THREE.LatheGeometry(torsoProfile, 36));
  torsoGeo.scale(1.12, 1.0, 0.64);
  const torsoMesh = new THREE.Mesh(torsoGeo, shellMat);
  torsoMesh.renderOrder = 5;
  bodyShellGroup.add(torsoMesh);

  // Cranium head shell
  const headGeo = track(new THREE.SphereGeometry(0.22, 28, 24));
  headGeo.scale(0.88, 1.12, 0.96);
  const headMesh = new THREE.Mesh(headGeo, shellMat);
  headMesh.position.set(0, 1.12, 0.01);
  headMesh.renderOrder = 5;
  bodyShellGroup.add(headMesh);

  // Arms (left and right upper/lower sculpted capsules)
  const makeLimb = (
    points: THREE.Vector3[],
    radius: number,
  ) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = track(new THREE.TubeGeometry(curve, 20, radius, 12, false));
    const mesh = new THREE.Mesh(geo, shellMat);
    mesh.renderOrder = 5;
    bodyShellGroup.add(mesh);
  };

  makeLimb(
    [
      new THREE.Vector3(0.41, 0.52, 0),
      new THREE.Vector3(0.51, 0.14, 0.01),
      new THREE.Vector3(0.55, -0.26, 0.08),
    ],
    0.075,
  );
  makeLimb(
    [
      new THREE.Vector3(-0.41, 0.52, 0),
      new THREE.Vector3(-0.51, 0.14, 0.01),
      new THREE.Vector3(-0.55, -0.26, 0.08),
    ],
    0.075,
  );

  makeLimb(
    [
      new THREE.Vector3(0.18, -0.46, 0),
      new THREE.Vector3(0.2, -1.0, 0.02),
      new THREE.Vector3(0.19, -1.52, 0.03),
    ],
    0.11,
  );
  makeLimb(
    [
      new THREE.Vector3(-0.18, -0.46, 0),
      new THREE.Vector3(-0.2, -1.0, 0.02),
      new THREE.Vector3(-0.19, -1.52, 0.03),
    ],
    0.11,
  );

  const spineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.46, -0.1),
    new THREE.Vector3(0, 0.05, -0.12),
    new THREE.Vector3(0, 0.55, -0.1),
    new THREE.Vector3(0, 0.92, -0.05),
  ]);
  const spineGeo = track(new THREE.TubeGeometry(spineCurve, 24, 0.035, 10, false));
  const spineMesh = new THREE.Mesh(spineGeo, boneMat);
  spineMesh.renderOrder = 2;
  bodyShellGroup.add(spineMesh);

  for (let i = 0; i < 7; i++) {
    const y = 0.06 + i * 0.072;
    const width = 0.24 + Math.sin((i / 6) * Math.PI) * 0.08;
    const depth = 0.16 + Math.sin((i / 6) * Math.PI) * 0.04;
    for (const side of [-1, 1]) {
      const ribCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.02 * side, y + 0.02, -0.11),
        new THREE.Vector3(width * side, y, -0.01),
        new THREE.Vector3(0.06 * side, y - 0.03, depth),
      ]);
      const ribGeo = track(new THREE.TubeGeometry(ribCurve, 14, 0.011, 7, false));
      const ribMesh = new THREE.Mesh(ribGeo, boneMat);
      ribMesh.renderOrder = 2;
      bodyShellGroup.add(ribMesh);
    }
  }

  const sternumGeo = track(new THREE.CapsuleGeometry(0.022, 0.34, 6, 10));
  const sternumMesh = new THREE.Mesh(sternumGeo, boneMat);
  sternumMesh.position.set(0, 0.32, 0.19);
  sternumMesh.renderOrder = 2;
  bodyShellGroup.add(sternumMesh);

  root.add(bodyShellGroup);

  const muscleTex = track(createMuscleFiberTexture('#dc2626', '#991b1b', maxAnisotropy));

  const registerOrgan = (
    id: 'brain' | 'heart' | 'lungs' | 'kidneys' | 'liver' | 'pancreas' | 'intestines',
    label: string,
    group: THREE.Group,
    anchor: THREE.Vector3,
    meshes: THREE.Mesh[],
  ) => {
    meshes.forEach((m) => {
      m.layers.enable(1);
      m.userData.partId = id;
      m.userData.organId = id;
      m.castShadow = true;
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: id,
      meshes,
      group,
      basePosition: group.position.clone(),
      explodeOffset: new THREE.Vector3(0, 0, 0),
      anchorLocal: anchor,
    });
  };

  // 1. BRAIN (inside cranium)
  const brainGroup = new THREE.Group();
  brainGroup.position.set(0, 1.15, 0.01);
  const brainMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.25,
    }),
  );
  const brainMeshes: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const hemiGeo = track(new THREE.SphereGeometry(0.115, 20, 18));
    hemiGeo.scale(0.68, 0.85, 1.15);
    const hemi = new THREE.Mesh(hemiGeo, brainMat.clone());
    track(hemi.material as THREE.Material);
    hemi.position.set(s * 0.045, 0.01, 0);
    brainGroup.add(hemi);
    brainMeshes.push(hemi);
  }
  const stemGeo = track(new THREE.CylinderGeometry(0.025, 0.018, 0.14, 10));
  const stem = new THREE.Mesh(stemGeo, brainMat.clone());
  track(stem.material as THREE.Material);
  stem.position.set(0, -0.09, -0.02);
  brainGroup.add(stem);
  brainMeshes.push(stem);
  registerOrgan('brain', 'Human Brain', brainGroup, new THREE.Vector3(0, 1.18, 0.16), brainMeshes);

  // 2. LUNGS (bilateral thoracic cavity)
  const lungsGroup = new THREE.Group();
  lungsGroup.position.set(0, 0.34, 0.01);
  const lungMatBase = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfb7185,
      roughness: 0.5,
      metalness: 0.04,
      clearcoat: 0.2,
    }),
  );
  const lungMeshes: THREE.Mesh[] = [];
  const tracheaGeo = track(new THREE.CylinderGeometry(0.022, 0.024, 0.24, 12));
  const trachea = new THREE.Mesh(tracheaGeo, lungMatBase.clone());
  track(trachea.material as THREE.Material);
  trachea.position.set(0, 0.18, 0.01);
  lungsGroup.add(trachea);
  lungMeshes.push(trachea);

  for (const side of [-1, 1]) {
    const lGeo = track(new THREE.SphereGeometry(0.15, 20, 18));
    lGeo.scale(side < 0 ? 0.82 : 0.75, 1.38, 0.72);
    const lMesh = new THREE.Mesh(lGeo, lungMatBase.clone());
    track(lMesh.material as THREE.Material);
    lMesh.position.set(side * 0.145, -0.01, 0);
    lMesh.rotation.z = side * -0.1;
    lungsGroup.add(lMesh);
    lungMeshes.push(lMesh);
  }
  registerOrgan('lungs', 'Human Lungs', lungsGroup, new THREE.Vector3(0.18, 0.38, 0.16), lungMeshes);

  // 3. HEART (left-central mediastinum, slightly anterior)
  const heartGroup = new THREE.Group();
  heartGroup.position.set(0.035, 0.29, 0.075);
  const heartMat = track(
    new THREE.MeshPhysicalMaterial({
      map: muscleTex,
      color: 0xe11d48,
      roughness: 0.34,
      metalness: 0.06,
      clearcoat: 0.45,
    }),
  );
  const heartGeo = track(new THREE.SphereGeometry(0.09, 22, 20));
  heartGeo.scale(0.88, 1.18, 0.82);
  const heartCore = new THREE.Mesh(heartGeo, heartMat);
  heartCore.rotation.z = 0.28;
  heartGroup.add(heartCore);

  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(-0.02, 0.14, 0.01),
    new THREE.Vector3(0.03, 0.16, -0.03),
    new THREE.Vector3(0.03, 0.05, -0.06),
  ]);
  const aortaGeo = track(new THREE.TubeGeometry(aortaCurve, 16, 0.02, 8, false));
  const aortaMesh = new THREE.Mesh(aortaGeo, heartMat.clone());
  track(aortaMesh.material as THREE.Material);
  heartGroup.add(aortaMesh);
  registerOrgan('heart', 'Human Heart', heartGroup, new THREE.Vector3(0.04, 0.3, 0.18), [
    heartCore,
    aortaMesh,
  ]);

  // 4. LIVER (upper right abdominal quadrant, viewer's left -X)
  const liverGroup = new THREE.Group();
  liverGroup.position.set(-0.07, 0.03, 0.06);
  const liverMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x9f1239,
      roughness: 0.36,
      metalness: 0.04,
      clearcoat: 0.4,
    }),
  );
  const liverGeo = track(new THREE.SphereGeometry(0.13, 18, 16));
  liverGeo.scale(1.45, 0.68, 0.78);
  const liverMesh = new THREE.Mesh(liverGeo, liverMat);
  liverMesh.rotation.z = 0.22;
  liverGroup.add(liverMesh);
  registerOrgan('liver', 'Human Liver', liverGroup, new THREE.Vector3(-0.12, 0.04, 0.16), [liverMesh]);

  // 5. PANCREAS (retroperitoneal behind stomach)
  const pancreasGroup = new THREE.Group();
  pancreasGroup.position.set(0.04, -0.04, 0.0);
  const pancreasMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      roughness: 0.42,
      metalness: 0.03,
    }),
  );
  const panGeo = track(new THREE.CapsuleGeometry(0.032, 0.16, 6, 10));
  const panMesh = new THREE.Mesh(panGeo, pancreasMat);
  panMesh.rotation.z = 1.32;
  pancreasGroup.add(panMesh);
  registerOrgan('pancreas', 'Human Pancreas', pancreasGroup, new THREE.Vector3(0.06, -0.04, 0.12), [panMesh]);

  // 6. KIDNEYS (retroperitoneal lower back)
  const kidneysGroup = new THREE.Group();
  kidneysGroup.position.set(0, -0.08, -0.05);
  const kidneyMatBase = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xb91c1c,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.4,
    }),
  );
  const kidneyMeshes: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const kGeo = track(new THREE.CapsuleGeometry(0.048, 0.085, 8, 14));
    kGeo.scale(0.95, 1.0, 0.68);
    const kMesh = new THREE.Mesh(kGeo, kidneyMatBase.clone());
    track(kMesh.material as THREE.Material);
    kMesh.position.set(side * 0.12, side < 0 ? -0.02 : 0.01, 0);
    kMesh.rotation.z = side * 0.18;
    kidneysGroup.add(kMesh);
    kidneyMeshes.push(kMesh);

    const ureterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.09, -0.02, 0),
      new THREE.Vector3(side * 0.07, -0.18, 0.02),
      new THREE.Vector3(side * 0.04, -0.34, 0.05),
    ]);
    const uGeo = track(new THREE.TubeGeometry(ureterCurve, 12, 0.008, 6, false));
    const uMesh = new THREE.Mesh(uGeo, kidneyMatBase.clone());
    track(uMesh.material as THREE.Material);
    kidneysGroup.add(uMesh);
    kidneyMeshes.push(uMesh);
  }
  registerOrgan(
    'kidneys',
    'Human Kidneys',
    kidneysGroup,
    new THREE.Vector3(0.15, -0.08, 0.06),
    kidneyMeshes,
  );

  // 7. INTESTINES (lower abdominal coils)
  const gutGroup = new THREE.Group();
  gutGroup.position.set(0, -0.26, 0.05);
  const gutMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xea580c,
      roughness: 0.45,
      metalness: 0.03,
    }),
  );
  const gutGeo = track(new THREE.TorusGeometry(0.13, 0.042, 10, 22));
  gutGeo.scale(1.15, 0.95, 0.65);
  const gutMesh = new THREE.Mesh(gutGeo, gutMat);
  gutGroup.add(gutMesh);
  const gutCore = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 14, 12)), gutMat.clone());
  track(gutCore.material as THREE.Material);
  gutCore.scale.set(1.1, 0.9, 0.65);
  gutGroup.add(gutCore);
  registerOrgan('intestines', 'Human Intestines', gutGroup, new THREE.Vector3(0, -0.26, 0.18), [
    gutMesh,
    gutCore,
  ]);

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    if (animatePhysiology) {
      const beat = 1 + Math.pow(Math.max(0, Math.sin(elapsed * 4.2)), 6) * 0.08;
      heartGroup.scale.setScalar(beat);
      const breath = 1 + Math.sin(elapsed * 1.4) * 0.035;
      lungsGroup.scale.set(breath, 1 + Math.sin(elapsed * 1.4) * 0.02, breath);
    } else {
      heartGroup.scale.setScalar(1);
      lungsGroup.scale.setScalar(1);
    }
  };

  return { root, parts, disposeables, updateAnimation };
}

