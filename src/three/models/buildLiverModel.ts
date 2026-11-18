import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createMuscleFiberTexture } from '../proceduralTextures';

const _tempVec = new THREE.Vector3();

export function buildLiverModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const hepaticTex = track(createMuscleFiberTexture('#9f1239', '#6b1027', maxAnisotropy));

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
        mesh.userData.organId = 'liver';
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'liver',
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

  // 1. RIGHT HEPATIC LOBE (large anatomical right dome, viewer's left -X)
  const rightGroup = new THREE.Group();
  const rightGeo = track(new THREE.SphereGeometry(0.78, 34, 28));
  rightGeo.scale(1.1, 0.88, 0.78);
  // Sculpt wedge taper on inferior border
  const rPos = rightGeo.attributes.position;
  for (let i = 0; i < rPos.count; i++) {
    const x = rPos.getX(i);
    const y = rPos.getY(i);
    const z = rPos.getZ(i);
    if (y < 0) {
      rPos.setZ(i, z * 0.72);
    }
    if (x < -0.2) {
      rPos.setY(i, y - (-x - 0.2) * 0.25);
    }
  }
  rightGeo.computeVertexNormals();
  const rightMat = track(
    new THREE.MeshPhysicalMaterial({
      map: hepaticTex,
      color: 0x9f1239,
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.45,
    }),
  );
  const rightMesh = new THREE.Mesh(rightGeo, rightMat);
  rightMesh.position.set(-0.42, 0.1, 0.02);
  rightMesh.rotation.z = 0.14;
  rightGroup.add(rightMesh);
  addPart(
    'right-hepatic-lobe',
    'Right Hepatic Lobe',
    rightGroup,
    new THREE.Vector3(-0.65, 0.15, 0.1),
    new THREE.Vector3(-0.55, 0.2, 0.55),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 2. LEFT HEPATIC LOBE (smaller tapered wedge extending toward +X)
  const leftGroup = new THREE.Group();
  const leftGeo = track(new THREE.SphereGeometry(0.56, 30, 24));
  leftGeo.scale(1.22, 0.65, 0.68);
  const lPos = leftGeo.attributes.position;
  for (let i = 0; i < lPos.count; i++) {
    const x = lPos.getX(i);
    const y = lPos.getY(i);
    if (x > 0) {
      lPos.setY(i, y * Math.max(0.28, 1 - x * 0.65));
    }
  }
  leftGeo.computeVertexNormals();
  const leftMat = track(
    new THREE.MeshPhysicalMaterial({
      map: hepaticTex,
      color: 0xbe123c,
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.42,
    }),
  );
  const leftMesh = new THREE.Mesh(leftGeo, leftMat);
  leftMesh.position.set(0.46, 0.24, 0.08);
  leftMesh.rotation.z = 0.22;
  leftGroup.add(leftMesh);
  addPart(
    'left-hepatic-lobe',
    'Left Hepatic Lobe',
    leftGroup,
    new THREE.Vector3(0.65, 0.2, 0.15),
    new THREE.Vector3(0.55, 0.28, 0.42),
    { fadeInCutaway: true, defaultOpacity: 1 },
  );

  // 3. FALCIFORM LIGAMENT (pale fibrous divider between right and left lobes)
  const falcGroup = new THREE.Group();
  const falcGeo = track(new THREE.BoxGeometry(0.06, 0.78, 0.52));
  const falcMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf1ece1,
      roughness: 0.55,
      metalness: 0.02,
      clearcoat: 0.2,
    }),
  );
  const falcMesh = new THREE.Mesh(falcGeo, falcMat);
  falcMesh.position.set(0.04, 0.22, 0.34);
  falcMesh.rotation.z = -0.08;
  falcGroup.add(falcMesh);
  // Round ligament cord along inferior edge
  const roundCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, -0.14, 0.28),
    new THREE.Vector3(0.05, -0.25, 0.46),
    new THREE.Vector3(0.08, -0.45, 0.58),
  ]);
  falcGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(roundCurve, 12, 0.026, 8, false)), falcMat));
  addPart(
    'falciform-ligament',
    'Falciform Ligament',
    falcGroup,
    new THREE.Vector3(0, 0.35, 0.65),
    new THREE.Vector3(0.05, 0.24, 0.6),
    { hideInCutaway: true, defaultOpacity: 1 },
  );

  // 4. GALLBLADDER (pear-shaped emerald reservoir tucked under right lobe)
  const gbGroup = new THREE.Group();
  const gbMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 0.65,
    }),
  );
  const gbGeo = track(new THREE.SphereGeometry(0.22, 24, 20));
  gbGeo.scale(0.75, 1.32, 0.78);
  const gbMesh = new THREE.Mesh(gbGeo, gbMat);
  gbMesh.position.set(-0.32, -0.45, 0.22);
  gbMesh.rotation.z = -0.35;
  gbMesh.rotation.x = 0.25;
  gbGroup.add(gbMesh);
  addPart(
    'gallbladder',
    'Gallbladder',
    gbGroup,
    new THREE.Vector3(-0.3, -0.55, 0.45),
    new THREE.Vector3(-0.34, -0.48, 0.36),
  );

  // 5. HEPATIC PORTAL VEIN (wide blue inflow vessel entering inferior porta hepatis)
  const pvGroup = new THREE.Group();
  const pvMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.34,
      metalness: 0.05,
      clearcoat: 0.35,
    }),
  );
  const pvTrunk = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.06, -0.88, -0.18),
    new THREE.Vector3(0.02, -0.42, -0.12),
    new THREE.Vector3(-0.02, -0.05, -0.06),
  ]);
  pvGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(pvTrunk, 18, 0.095, 12, false)), pvMat));
  const pvLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, -0.05, -0.06),
    new THREE.Vector3(0.38, 0.16, -0.02),
  ]);
  pvGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(pvLeft, 10, 0.06, 10, false)), pvMat));
  const pvRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, -0.05, -0.06),
    new THREE.Vector3(-0.48, 0.06, -0.04),
  ]);
  pvGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(pvRight, 10, 0.068, 10, false)), pvMat));
  addPart(
    'hepatic-portal-vein',
    'Hepatic Portal Vein',
    pvGroup,
    new THREE.Vector3(0.15, -0.55, -0.45),
    new THREE.Vector3(0.04, -0.55, -0.14),
  );

  // 6. COMMON BILE DUCT (green-olive biliary tree draining gallbladder & hepatic ducts)
  const cbdGroup = new THREE.Group();
  const cbdMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x65a30d,
      roughness: 0.3,
      metalness: 0.04,
      clearcoat: 0.45,
    }),
  );
  const cbdMain = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.06, 0.02),
    new THREE.Vector3(-0.12, -0.28, 0.06),
    new THREE.Vector3(-0.1, -0.82, 0.06),
  ]);
  cbdGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(cbdMain, 18, 0.036, 10, false)), cbdMat));
  const cysticCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.26, -0.28, 0.16),
    new THREE.Vector3(-0.12, -0.28, 0.06),
  ]);
  cbdGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(cysticCurve, 10, 0.028, 8, false)), cbdMat));
  addPart(
    'common-bile-duct',
    'Common Bile Duct',
    cbdGroup,
    new THREE.Vector3(-0.15, -0.65, 0.3),
    new THREE.Vector3(-0.12, -0.55, 0.1),
  );

  // Physiological animation: subtle metabolic portal inflow & bile pulses
  const flowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.06, -0.85, -0.18),
    new THREE.Vector3(0.0, -0.25, -0.1),
    new THREE.Vector3(-0.35, 0.08, -0.02),
  ]);
  const pGeo = track(new THREE.SphereGeometry(0.035, 8, 8));
  const pMat = track(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  const flowParticles = new THREE.InstancedMesh(pGeo, pMat, 14);
  flowParticles.frustumCulled = false;
  flowParticles.renderOrder = 10;
  root.add(flowParticles);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    flowParticles.visible = animatePhysiology;
    if (animatePhysiology) {
      for (let i = 0; i < 14; i++) {
        const t = (elapsed * 0.25 + i / 14) % 1;
        flowCurve.getPointAt(t, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.35);
        dummy.updateMatrix();
        flowParticles.setMatrixAt(i, dummy.matrix);
      }
      flowParticles.instanceMatrix.needsUpdate = true;
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
