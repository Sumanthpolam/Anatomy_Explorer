import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createMuscleFiberTexture } from '../proceduralTextures';

const _tempVec = new THREE.Vector3();

export function buildIntestinesModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const gutTex = track(createMuscleFiberTexture('#f472b6', '#be185d', maxAnisotropy));

  const addPart = (
    id: string,
    label: string,
    group: THREE.Group,
    explodeOffset: THREE.Vector3,
    anchorLocal: THREE.Vector3,
  ) => {
    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.layers.enable(1);
        mesh.userData.partId = id;
        mesh.userData.organId = 'intestines';
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'intestines',
      meshes,
      group,
      basePosition: group.position.clone(),
      explodeOffset,
      anchorLocal,
    });
  };

  // 1. DUODENUM (C-shaped upper loop)
  const duoGroup = new THREE.Group();
  const duoMat = track(
    new THREE.MeshPhysicalMaterial({
      map: gutTex,
      color: 0xfb923c,
      roughness: 0.38,
      metalness: 0.03,
      clearcoat: 0.35,
    }),
  );
  const duoCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.92, 0.05),
    new THREE.Vector3(-0.34, 0.8, 0.02),
    new THREE.Vector3(-0.32, 0.54, 0.0),
    new THREE.Vector3(0.02, 0.48, 0.06),
  ]);
  duoGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(duoCurve, 22, 0.095, 12, false)), duoMat));
  addPart(
    'duodenum',
    'Duodenum',
    duoGroup,
    new THREE.Vector3(0, 0.55, 0.35),
    new THREE.Vector3(-0.22, 0.72, 0.15),
  );

  // 2. JEJUNUM & ILEUM (tightly coiled small bowel loops)
  const smallGroup = new THREE.Group();
  const smallMat = track(
    new THREE.MeshPhysicalMaterial({
      map: gutTex,
      color: 0xf472b6,
      roughness: 0.42,
      metalness: 0.03,
      clearcoat: 0.3,
    }),
  );
  const coilPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 38; i++) {
    const t = i / 38;
    const x = Math.sin(t * Math.PI * 7.2) * 0.42;
    const y = 0.42 - t * 0.96 + Math.cos(t * Math.PI * 10) * 0.05;
    const z = Math.cos(t * Math.PI * 6.5) * 0.22 + 0.08;
    coilPoints.push(new THREE.Vector3(x, y, z));
  }
  const smallCurve = new THREE.CatmullRomCurve3(coilPoints);
  smallGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(smallCurve, 120, 0.082, 12, false)), smallMat));
  addPart(
    'jejunum-ileum',
    'Jejunum & Ileum',
    smallGroup,
    new THREE.Vector3(0, 0, 0.65),
    new THREE.Vector3(0.08, -0.05, 0.35),
  );

  // 3. CECUM & APPENDIX (lower right pouch + appendix)
  const cecumGroup = new THREE.Group();
  const cecumMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.4,
      metalness: 0.03,
      clearcoat: 0.35,
    }),
  );
  const cecumGeo = track(new THREE.SphereGeometry(0.18, 20, 18));
  cecumGeo.scale(1.0, 1.15, 0.95);
  const cecumMesh = new THREE.Mesh(cecumGeo, cecumMat);
  cecumMesh.position.set(-0.68, -0.58, 0.02);
  cecumGroup.add(cecumMesh);

  const appCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.66, -0.74, 0.04),
    new THREE.Vector3(-0.56, -0.92, 0.14),
    new THREE.Vector3(-0.44, -0.96, 0.18),
  ]);
  cecumGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(appCurve, 14, 0.036, 8, false)), cecumMat));
  addPart(
    'cecum-appendix',
    'Cecum & Appendix',
    cecumGroup,
    new THREE.Vector3(-0.55, -0.45, 0.25),
    new THREE.Vector3(-0.62, -0.76, 0.2),
  );

  // 4. ASCENDING, TRANSVERSE & DESCENDING COLON (haustrated frame)
  const colonGroup = new THREE.Group();
  const colonMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xb45309,
      roughness: 0.44,
      metalness: 0.04,
      clearcoat: 0.28,
    }),
  );
  const colonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.68, -0.46, 0.02),
    new THREE.Vector3(-0.74, 0.15, 0.0),
    new THREE.Vector3(-0.66, 0.62, 0.06),
    new THREE.Vector3(0.0, 0.56, 0.14),
    new THREE.Vector3(0.68, 0.68, 0.02),
    new THREE.Vector3(0.74, 0.12, -0.02),
    new THREE.Vector3(0.68, -0.48, 0.0),
  ]);
  colonGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(colonCurve, 64, 0.145, 14, false)), colonMat));
  addPart(
    'colon',
    'Colon Frame',
    colonGroup,
    new THREE.Vector3(0, 0.35, -0.35),
    new THREE.Vector3(0.0, 0.58, 0.28),
  );

  // 5. SIGMOID COLON & RECTUM
  const sigGroup = new THREE.Group();
  const sigMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x92400e,
      roughness: 0.44,
      metalness: 0.04,
      clearcoat: 0.25,
    }),
  );
  const sigCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, -0.48, 0.0),
    new THREE.Vector3(0.46, -0.78, -0.06),
    new THREE.Vector3(0.14, -0.76, -0.14),
    new THREE.Vector3(0.0, -0.96, -0.18),
    new THREE.Vector3(0.0, -1.24, -0.16),
  ]);
  sigGroup.add(new THREE.Mesh(track(new THREE.TubeGeometry(sigCurve, 28, 0.125, 12, false)), sigMat));
  addPart(
    'sigmoid-rectum',
    'Sigmoid Colon & Rectum',
    sigGroup,
    new THREE.Vector3(0.25, -0.55, -0.25),
    new THREE.Vector3(0.18, -0.88, -0.05),
  );

  // Peristalsis particle flow
  const pGeo = track(new THREE.SphereGeometry(0.04, 8, 8));
  const pMat = track(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
  const chymeParticles = new THREE.InstancedMesh(pGeo, pMat, 16);
  chymeParticles.frustumCulled = false;
  chymeParticles.renderOrder = 10;
  root.add(chymeParticles);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    chymeParticles.visible = animatePhysiology;
    if (animatePhysiology) {
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.015;
      smallGroup.scale.set(pulse, 1, pulse);
      for (let i = 0; i < 16; i++) {
        const t = (elapsed * 0.12 + i / 16) % 1;
        colonCurve.getPointAt(t, _tempVec);
        dummy.position.copy(_tempVec);
        dummy.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.35);
        dummy.updateMatrix();
        chymeParticles.setMatrixAt(i, dummy.matrix);
      }
      chymeParticles.instanceMatrix.needsUpdate = true;
    } else {
      smallGroup.scale.setScalar(1);
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
