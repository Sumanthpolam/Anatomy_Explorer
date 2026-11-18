import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createLungTexture } from '../proceduralTextures';

const _tempPos = new THREE.Vector3();

export function buildLungsModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const lungTex = track(createLungTexture(maxAnisotropy));

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
        mesh.userData.organId = 'lungs';
        mesh.castShadow = !options?.fadeInCutaway;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'lungs',
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

  // 1. TRACHEA with C-shaped hyaline cartilage rings
  const tracheaGroup = new THREE.Group();
  const airwayMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.3,
    }),
  );
  const ringMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.05,
    }),
  );
  const trachTube = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.11, 0.115, 0.92, 18)),
    airwayMat,
  );
  trachTube.position.set(0, 0.98, 0);
  tracheaGroup.add(trachTube);

  for (let i = 0; i < 11; i++) {
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.118, 0.017, 8, 20, Math.PI * 1.55)),
      ringMat,
    );
    ring.position.set(0, 0.58 + i * 0.075, 0);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = -Math.PI * 0.28;
    tracheaGroup.add(ring);
  }
  addPart(
    'trachea',
    'Trachea',
    tracheaGroup,
    new THREE.Vector3(0, 0.45, 0),
    new THREE.Vector3(0, 1.05, 0.14),
  );

  // 2. MAIN BRONCHI (Right wider/steeper, Left longer/angled)
  const bronchiGroup = new THREE.Group();
  const bronchusMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.38,
      metalness: 0.05,
    }),
  );
  const rightMainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.54, 0),
    new THREE.Vector3(-0.26, 0.38, 0),
    new THREE.Vector3(-0.48, 0.24, 0),
  ]);
  const leftMainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.54, 0),
    new THREE.Vector3(0.28, 0.42, -0.02),
    new THREE.Vector3(0.56, 0.25, -0.02),
  ]);
  bronchiGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(rightMainCurve, 16, 0.078, 12, false)), bronchusMat),
  );
  bronchiGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(leftMainCurve, 16, 0.068, 12, false)), bronchusMat),
  );
  addPart(
    'main-bronchi',
    'Main Bronchi',
    bronchiGroup,
    new THREE.Vector3(0, 0.2, 0.2),
    new THREE.Vector3(-0.3, 0.36, 0.1),
  );

  // 3. BRONCHIOLES (branching bronchial tree inside both lungs)
  const bronchiolesGroup = new THREE.Group();
  const bronchioleMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.42,
      metalness: 0.05,
    }),
  );
  const branchSpecs: Array<[number, number, number, number, number, number]> = [
    // Right side (-X)
    [-0.48, 0.24, 0, -0.68, 0.52, 0.08],
    [-0.48, 0.24, 0, -0.82, 0.12, 0.14],
    [-0.48, 0.24, 0, -0.74, -0.32, -0.08],
    [-0.68, 0.52, 0.08, -0.82, 0.68, 0.04],
    [-0.82, 0.12, 0.14, -0.94, 0.02, 0.2],
    [-0.74, -0.32, -0.08, -0.88, -0.52, -0.04],
    // Left side (+X)
    [0.56, 0.25, -0.02, 0.72, 0.52, 0.08],
    [0.56, 0.25, -0.02, 0.84, 0.08, 0.12],
    [0.56, 0.25, -0.02, 0.72, -0.34, -0.08],
    [0.72, 0.52, 0.08, 0.86, 0.66, 0.04],
    [0.72, -0.34, -0.08, 0.86, -0.5, -0.04],
  ];
  const alveolarCenters: THREE.Vector3[] = [];
  branchSpecs.forEach(([x1, y1, z1, x2, y2, z2]) => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3((x1 + x2) * 0.5, (y1 + y2) * 0.5 + 0.04, (z1 + z2) * 0.5),
      new THREE.Vector3(x2, y2, z2),
    ]);
    bronchiolesGroup.add(
      new THREE.Mesh(track(new THREE.TubeGeometry(c, 12, 0.024, 8, false)), bronchioleMat),
    );
    alveolarCenters.push(new THREE.Vector3(x2, y2, z2));
  });
  addPart(
    'bronchioles',
    'Bronchioles',
    bronchiolesGroup,
    new THREE.Vector3(0, 0.05, 0.3),
    new THREE.Vector3(-0.74, 0.2, 0.16),
  );

  // 4. ALVEOLI (grape-like acinar clusters at bronchiole tips)
  const alveoliGroup = new THREE.Group();
  const alvMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.3,
    }),
  );
  const alvBubbleGeo = track(new THREE.SphereGeometry(0.042, 10, 8));
  alveolarCenters.forEach((center) => {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const b = new THREE.Mesh(alvBubbleGeo, alvMat);
      b.position.set(
        center.x + Math.cos(a) * 0.045,
        center.y + (i % 2 === 0 ? 0.03 : -0.03),
        center.z + Math.sin(a) * 0.045,
      );
      alveoliGroup.add(b);
    }
  });
  addPart(
    'alveoli',
    'Alveoli',
    alveoliGroup,
    new THREE.Vector3(0, 0, 0.45),
    new THREE.Vector3(0.86, 0.66, 0.08),
  );

  // 5. LUNG LOBES (Right: Upper, Middle, Lower; Left: Upper w/ cardiac notch, Lower)
  const makeLobeMat = (color: number) =>
    track(
      new THREE.MeshPhysicalMaterial({
        map: lungTex,
        color,
        roughness: 0.52,
        metalness: 0.02,
        clearcoat: 0.2,
        transparent: true,
        opacity: 0.84,
      }),
    );

  const lobeMeshesToBreathe: Array<{ group: THREE.Group; baseScale: THREE.Vector3 }> = [];

  const createLobe = (
    id: string,
    label: string,
    color: number,
    pos: [number, number, number],
    scale: [number, number, number],
    rotZ: number,
    explode: THREE.Vector3,
    anchor: THREE.Vector3,
  ) => {
    const g = new THREE.Group();
    const geo = track(new THREE.SphereGeometry(0.46, 26, 22));
    geo.scale(...scale);
    const mat = makeLobeMat(color);
    const m = new THREE.Mesh(geo, mat);
    m.rotation.z = rotZ;
    g.position.set(...pos);
    g.add(m);
    addPart(id, label, g, explode, anchor, { fadeInCutaway: true, defaultOpacity: 0.84 });
    lobeMeshesToBreathe.push({ group: g, baseScale: new THREE.Vector3(1, 1, 1) });
  };

  // Right Lung (-X) = 3 lobes
  createLobe(
    'right-upper-lobe',
    'Right Lung — Upper Lobe',
    0xfb7185,
    [-0.64, 0.52, 0],
    [0.82, 0.9, 0.78],
    -0.2,
    new THREE.Vector3(-0.65, 0.35, 0),
    new THREE.Vector3(-0.8, 0.56, 0.2),
  );
  createLobe(
    'right-middle-lobe',
    'Right Lung — Middle Lobe',
    0xf472b6,
    [-0.72, 0.06, 0.1],
    [0.88, 0.65, 0.72],
    -0.08,
    new THREE.Vector3(-0.78, 0, 0.15),
    new THREE.Vector3(-0.92, 0.06, 0.28),
  );
  createLobe(
    'right-lower-lobe',
    'Right Lung — Lower Lobe',
    0xe11d48,
    [-0.7, -0.38, -0.06],
    [0.95, 0.92, 0.85],
    0.05,
    new THREE.Vector3(-0.65, -0.35, -0.1),
    new THREE.Vector3(-0.9, -0.4, 0.2),
  );

  // Left Lung (+X) = 2 lobes (slightly narrower medially for cardiac notch)
  createLobe(
    'left-upper-lobe',
    'Left Lung — Upper Lobe',
    0xf97316,
    [0.68, 0.42, 0.02],
    [0.78, 1.05, 0.78],
    0.18,
    new THREE.Vector3(0.65, 0.3, 0),
    new THREE.Vector3(0.84, 0.46, 0.22),
  );
  createLobe(
    'left-lower-lobe',
    'Left Lung — Lower Lobe',
    0xfb923c,
    [0.7, -0.36, -0.05],
    [0.9, 0.96, 0.84],
    -0.06,
    new THREE.Vector3(0.65, -0.35, -0.1),
    new THREE.Vector3(0.9, -0.36, 0.2),
  );

  // 6. PLEURAL MEMBRANES (translucent outer serous sac surrounding both lungs)
  const pleuraGroup = new THREE.Group();
  const pleuraMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      roughness: 0.18,
      metalness: 0.02,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      clearcoat: 0.85,
      side: THREE.DoubleSide,
    }),
  );
  for (const side of [-1, 1]) {
    const pGeo = track(new THREE.SphereGeometry(0.66, 26, 22));
    pGeo.scale(0.88, 1.56, 0.8);
    const pMesh = new THREE.Mesh(pGeo, pleuraMat);
    pMesh.position.set(side * 0.7, 0.04, 0);
    pMesh.renderOrder = 8;
    pleuraGroup.add(pMesh);
  }
  addPart(
    'pleural-membranes',
    'Pleural Membranes',
    pleuraGroup,
    new THREE.Vector3(0, 0.1, 0.75),
    new THREE.Vector3(1.12, 0.2, 0.3),
    { hideInCutaway: true, defaultOpacity: 0.14 },
  );

  // 7. DIAPHRAGM (dome-shaped muscular floor)
  const diaphragmGroup = new THREE.Group();
  const diaGeo = track(
    new THREE.SphereGeometry(1.18, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.42),
  );
  diaGeo.scale(1.12, 0.42, 0.78);
  const diaMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      roughness: 0.46,
      metalness: 0.05,
      clearcoat: 0.25,
      side: THREE.DoubleSide,
    }),
  );
  const diaMesh = new THREE.Mesh(diaGeo, diaMat);
  diaMesh.position.set(0, -1.04, 0);
  diaphragmGroup.add(diaMesh);
  addPart(
    'diaphragm',
    'Diaphragm',
    diaphragmGroup,
    new THREE.Vector3(0, -0.65, 0),
    new THREE.Vector3(0, -0.82, 0.55),
  );

  // 8. GAS EXCHANGE PARTICLES (O2 cyan & CO2 amber oscillating in alveoli)
  const gasGeo = track(new THREE.SphereGeometry(0.025, 8, 6));
  const o2Mat = track(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  const co2Mat = track(new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
  const o2Mesh = new THREE.InstancedMesh(gasGeo, o2Mat, alveolarCenters.length);
  const co2Mesh = new THREE.InstancedMesh(gasGeo, co2Mat, alveolarCenters.length);
  o2Mesh.frustumCulled = false;
  co2Mesh.frustumCulled = false;
  root.add(o2Mesh);
  root.add(co2Mesh);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    o2Mesh.visible = animatePhysiology;
    co2Mesh.visible = animatePhysiology;

    if (animatePhysiology) {
      // Smooth ~15 breaths/min physiological cycle
      const breathWave = (Math.sin(elapsed * 1.55) + 1) * 0.5; // 0 = exhaled, 1 = inhaled
      const lungExpand = 0.96 + breathWave * 0.1;

      lobeMeshesToBreathe.forEach(({ group }) => {
        group.scale.set(lungExpand, 0.97 + breathWave * 0.08, lungExpand);
      });
      pleuraGroup.scale.set(lungExpand, 0.97 + breathWave * 0.08, lungExpand);
      alveoliGroup.scale.setScalar(0.96 + breathWave * 0.11);

      // Diaphragm contracts downward during inhalation
      diaphragmGroup.position.y = -breathWave * 0.16;
      diaphragmGroup.scale.y = 1.0 - breathWave * 0.18;

      alveolarCenters.forEach((center, idx) => {
        const phase = elapsed * 2.2 + idx * 0.7;
        _tempPos.copy(center);
        _tempPos.y += Math.sin(phase) * 0.05;
        _tempPos.x += Math.cos(phase) * 0.04;
        dummy.position.copy(_tempPos);
        dummy.updateMatrix();
        o2Mesh.setMatrixAt(idx, dummy.matrix);

        _tempPos.copy(center);
        _tempPos.y -= Math.sin(phase) * 0.05;
        _tempPos.z += Math.cos(phase) * 0.04;
        dummy.position.copy(_tempPos);
        dummy.updateMatrix();
        co2Mesh.setMatrixAt(idx, dummy.matrix);
      });
      o2Mesh.instanceMatrix.needsUpdate = true;
      co2Mesh.instanceMatrix.needsUpdate = true;
    } else {
      lobeMeshesToBreathe.forEach(({ group }) => group.scale.set(1, 1, 1));
      pleuraGroup.scale.set(1, 1, 1);
      alveoliGroup.scale.setScalar(1);
      diaphragmGroup.position.y = 0;
      diaphragmGroup.scale.y = 1;
    }
  };

  return { root, parts, disposeables, updateAnimation };
}
