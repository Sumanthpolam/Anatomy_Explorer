import * as THREE from 'three';
import type { BuiltAnatomyModel, SelectablePartEntry } from '../anatomyPartTypes';
import { createMuscleFiberTexture } from '../proceduralTextures';

const _tempPos = new THREE.Vector3();

export function buildKidneyModel(maxAnisotropy: number): BuiltAnatomyModel {
  const root = new THREE.Group();
  const parts: SelectablePartEntry[] = [];
  const disposeables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposeables.push(item);
    return item;
  };

  const parenTex = track(createMuscleFiberTexture('#b91c1c', '#7f1d1d', maxAnisotropy));

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
        mesh.userData.organId = 'kidneys';
        mesh.castShadow = !options?.fadeInCutaway;
        mesh.receiveShadow = true;
        meshes.push(mesh);
      }
    });
    root.add(group);
    parts.push({
      id,
      label,
      organId: 'kidneys',
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

  // Sculpted kidney bean profile shape for ExtrudeGeometry coronal cutaway
  const makeBeanShape = (scaleFactor: number) => {
    const s = new THREE.Shape();
    s.moveTo(-0.15 * scaleFactor, 0.95 * scaleFactor);
    s.bezierCurveTo(
      -0.95 * scaleFactor,
      0.95 * scaleFactor,
      -1.05 * scaleFactor,
      -0.95 * scaleFactor,
      -0.15 * scaleFactor,
      -0.95 * scaleFactor,
    );
    s.bezierCurveTo(
      0.32 * scaleFactor,
      -0.95 * scaleFactor,
      0.36 * scaleFactor,
      -0.42 * scaleFactor,
      0.16 * scaleFactor,
      -0.25 * scaleFactor,
    );
    // Hilum indentation
    s.bezierCurveTo(
      0.02 * scaleFactor,
      -0.12 * scaleFactor,
      0.02 * scaleFactor,
      0.12 * scaleFactor,
      0.16 * scaleFactor,
      0.25 * scaleFactor,
    );
    s.bezierCurveTo(
      0.36 * scaleFactor,
      0.42 * scaleFactor,
      0.32 * scaleFactor,
      0.95 * scaleFactor,
      -0.15 * scaleFactor,
      0.95 * scaleFactor,
    );
    return s;
  };

  // Offset kidney slightly left (-0.35) so magnified Nephron unit sits cleanly beside it!
  const kx = -0.32;

  // 1. RENAL CAPSULE (translucent protective outer sheath)
  const capsuleGroup = new THREE.Group();
  const capGeo = track(
    new THREE.ExtrudeGeometry(makeBeanShape(1.04), {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 4,
    }),
  );
  capGeo.translate(kx, 0, -0.22);
  const capMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfb923c,
      roughness: 0.25,
      metalness: 0.02,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      clearcoat: 0.75,
      side: THREE.DoubleSide,
    }),
  );
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.renderOrder = 8;
  capsuleGroup.add(capMesh);
  addPart(
    'renal-capsule',
    'Renal Capsule',
    capsuleGroup,
    new THREE.Vector3(-0.6, 0, 0.45),
    new THREE.Vector3(kx - 0.85, 0.45, 0.2),
    { hideInCutaway: true, defaultOpacity: 0.22 },
  );

  // 2. RENAL CORTEX (outer cutaway rim)
  const cortexGroup = new THREE.Group();
  const cortexGeo = track(
    new THREE.ExtrudeGeometry(makeBeanShape(0.98), {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 3,
    }),
  );
  cortexGeo.translate(kx, 0, -0.26);
  const cortexMat = track(
    new THREE.MeshPhysicalMaterial({
      map: parenTex,
      color: 0xe11d48,
      roughness: 0.42,
      metalness: 0.04,
      clearcoat: 0.25,
    }),
  );
  cortexGroup.add(new THREE.Mesh(cortexGeo, cortexMat));
  addPart(
    'renal-cortex',
    'Renal Cortex',
    cortexGroup,
    new THREE.Vector3(-0.35, 0, -0.35),
    new THREE.Vector3(kx - 0.72, 0.65, 0.05),
  );

  // 3. RENAL MEDULLA (inner darker bed)
  const medullaGroup = new THREE.Group();
  const medGeo = track(
    new THREE.ExtrudeGeometry(makeBeanShape(0.78), {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    }),
  );
  medGeo.translate(kx, 0, -0.08);
  const medMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      roughness: 0.48,
      metalness: 0.04,
    }),
  );
  medullaGroup.add(new THREE.Mesh(medGeo, medMat));
  addPart(
    'renal-medulla',
    'Renal Medulla',
    medullaGroup,
    new THREE.Vector3(-0.15, 0, -0.1),
    new THREE.Vector3(kx - 0.48, -0.5, 0.1),
  );

  // 4. RENAL PYRAMIDS & 5. RENAL PAPILLAE (7 radial cones + papilla tips)
  const pyramidsGroup = new THREE.Group();
  const papillaeGroup = new THREE.Group();
  const calycesGroup = new THREE.Group();

  const pyrMat = track(
    new THREE.MeshPhysicalMaterial({
      map: parenTex,
      color: 0x9f1239,
      roughness: 0.44,
      metalness: 0.04,
    }),
  );
  const papMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35,
    }),
  );
  const calyxMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.04,
      clearcoat: 0.35,
    }),
  );

  const pyrAngles = [1.05, 0.68, 0.32, 0.0, -0.32, -0.68, -1.05];
  pyrAngles.forEach((ang) => {
    const dirX = -Math.cos(ang);
    const dirY = Math.sin(ang);

    const pyrGeo = track(new THREE.ConeGeometry(0.12, 0.34, 12));
    const pyrMesh = new THREE.Mesh(pyrGeo, pyrMat);
    const cx = kx - 0.02 + dirX * 0.46;
    const cy = dirY * 0.56;
    pyrMesh.position.set(cx, cy, 0.08);
    // Point cone tip inward toward hilum (kx + 0.05, 0)
    const inwardAngle = Math.atan2(-cy, kx + 0.05 - cx);
    pyrMesh.rotation.z = inwardAngle - Math.PI / 2;
    pyramidsGroup.add(pyrMesh);

    // Papilla tip at inner apex
    const papMesh = new THREE.Mesh(track(new THREE.SphereGeometry(0.05, 10, 8)), papMat);
    papMesh.position.set(cx + Math.cos(inwardAngle) * 0.16, cy + Math.sin(inwardAngle) * 0.16, 0.09);
    papillaeGroup.add(papMesh);

    // Minor calyx funnel connecting papilla into renal pelvis
    const calCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(
        cx + Math.cos(inwardAngle) * 0.17,
        cy + Math.sin(inwardAngle) * 0.17,
        0.09,
      ),
      new THREE.Vector3(kx + 0.04, dirY * 0.16, 0.09),
    ]);
    calycesGroup.add(
      new THREE.Mesh(track(new THREE.TubeGeometry(calCurve, 10, 0.042, 8, false)), calyxMat),
    );
  });

  addPart(
    'renal-pyramids',
    'Renal Pyramids',
    pyramidsGroup,
    new THREE.Vector3(-0.2, 0, 0.22),
    new THREE.Vector3(kx - 0.46, 0.35, 0.15),
  );
  addPart(
    'renal-papillae',
    'Renal Papillae',
    papillaeGroup,
    new THREE.Vector3(-0.08, 0, 0.32),
    new THREE.Vector3(kx - 0.25, 0.2, 0.15),
  );
  addPart(
    'calyces',
    'Minor & Major Calyces',
    calycesGroup,
    new THREE.Vector3(0.05, 0, 0.38),
    new THREE.Vector3(kx - 0.1, 0.14, 0.15),
  );

  // 6. RENAL PELVIS (funnel basin)
  const pelvisGroup = new THREE.Group();
  const pelvisMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xeab308,
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.35,
    }),
  );
  const pelvisGeo = track(new THREE.ConeGeometry(0.18, 0.36, 14));
  const pelvisMesh = new THREE.Mesh(pelvisGeo, pelvisMat);
  pelvisMesh.position.set(kx + 0.14, -0.02, 0.08);
  pelvisMesh.rotation.z = Math.PI / 2.2;
  pelvisGroup.add(pelvisMesh);
  addPart(
    'renal-pelvis',
    'Renal Pelvis',
    pelvisGroup,
    new THREE.Vector3(0.2, 0, 0.3),
    new THREE.Vector3(kx + 0.14, -0.02, 0.18),
  );

  // 7. URETER
  const ureterGroup = new THREE.Group();
  const ureterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(kx + 0.22, -0.08, 0.08),
    new THREE.Vector3(kx + 0.34, -0.45, 0.06),
    new THREE.Vector3(kx + 0.32, -1.12, 0.04),
  ]);
  const ureterMesh = new THREE.Mesh(
    track(new THREE.TubeGeometry(ureterCurve, 22, 0.048, 12, false)),
    track(new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.36 })),
  );
  ureterGroup.add(ureterMesh);
  addPart(
    'ureter',
    'Ureter',
    ureterGroup,
    new THREE.Vector3(0.25, -0.4, 0.2),
    new THREE.Vector3(kx + 0.34, -0.75, 0.1),
  );

  // 8. RENAL ARTERY & 9. RENAL VEIN
  const artGroup = new THREE.Group();
  const artCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(kx + 0.65, 0.18, -0.02),
    new THREE.Vector3(kx + 0.25, 0.12, 0.02),
    new THREE.Vector3(kx - 0.08, 0.1, 0.02),
  ]);
  artGroup.add(
    new THREE.Mesh(
      track(new THREE.TubeGeometry(artCurve, 18, 0.062, 12, false)),
      track(new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.32 })),
    ),
  );
  addPart(
    'renal-artery',
    'Renal Artery',
    artGroup,
    new THREE.Vector3(0.35, 0.2, 0),
    new THREE.Vector3(kx + 0.48, 0.18, 0.06),
  );

  const veinGroup = new THREE.Group();
  const veinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(kx + 0.65, 0.0, 0.14),
    new THREE.Vector3(kx + 0.24, -0.02, 0.14),
    new THREE.Vector3(kx - 0.06, -0.02, 0.1),
  ]);
  veinGroup.add(
    new THREE.Mesh(
      track(new THREE.TubeGeometry(veinCurve, 18, 0.07, 12, false)),
      track(new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.34 })),
    ),
  );
  addPart(
    'renal-vein',
    'Renal Vein',
    veinGroup,
    new THREE.Vector3(0.35, 0, 0.28),
    new THREE.Vector3(kx + 0.48, 0.0, 0.2),
  );

  // 10. SEPARATE DETAILED 3D NEPHRON VISUALIZATION (right side of stage)
  const nephronGroup = new THREE.Group();
  const nx = 0.88;
  const bowmanMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.25,
      transparent: true,
      opacity: 0.55,
      clearcoat: 0.6,
    }),
  );
  const glomMat = track(
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 }),
  );
  const tubuleMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.35,
      clearcoat: 0.25,
    }),
  );
  const ductMat = track(
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.38 }),
  );

  // Bowman's capsule + coiled glomerulus tuft
  const bowman = new THREE.Mesh(track(new THREE.SphereGeometry(0.18, 20, 18)), bowmanMat);
  bowman.position.set(nx - 0.24, 0.52, 0);
  nephronGroup.add(bowman);

  const glom = new THREE.Mesh(track(new THREE.TorusKnotGeometry(0.085, 0.024, 48, 8, 2, 3)), glomMat);
  glom.position.set(nx - 0.24, 0.52, 0);
  nephronGroup.add(glom);

  // Proximal tubule -> Loop of Henle -> Distal tubule -> Collecting Duct
  const nephronPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(nx - 0.08, 0.52, 0),
    new THREE.Vector3(nx + 0.04, 0.64, 0.08),
    new THREE.Vector3(nx + 0.1, 0.44, -0.06),
    new THREE.Vector3(nx - 0.02, 0.26, 0.04),
    // Descending Loop of Henle
    new THREE.Vector3(nx - 0.02, -0.58, 0.02),
    new THREE.Vector3(nx + 0.08, -0.68, 0.0),
    // Ascending Loop of Henle
    new THREE.Vector3(nx + 0.16, -0.55, -0.02),
    new THREE.Vector3(nx + 0.16, 0.32, 0.0),
    // Distal convoluted tubule
    new THREE.Vector3(nx + 0.26, 0.52, 0.06),
    new THREE.Vector3(nx + 0.34, 0.38, -0.04),
    new THREE.Vector3(nx + 0.44, 0.42, 0),
  ]);
  nephronGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(nephronPath, 72, 0.034, 10, false)), tubuleMat),
  );

  // Collecting duct
  const ductCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(nx + 0.44, 0.68, 0),
    new THREE.Vector3(nx + 0.44, -0.78, 0),
  ]);
  nephronGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(ductCurve, 24, 0.052, 12, false)), ductMat),
  );

  addPart(
    'nephron',
    'Magnified Nephron Unit',
    nephronGroup,
    new THREE.Vector3(0.45, 0, 0),
    new THREE.Vector3(nx + 0.1, 0.55, 0.15),
  );

  // Animated filtrate droplets along Nephron path + ureter
  const dropGeo = track(new THREE.SphereGeometry(0.028, 8, 6));
  const dropMat = track(new THREE.MeshBasicMaterial({ color: 0xfde047 }));
  const dropCount = 12;
  const drops = new THREE.InstancedMesh(dropGeo, dropMat, dropCount);
  drops.frustumCulled = false;
  root.add(drops);
  const dummy = new THREE.Object3D();

  const updateAnimation = (elapsed: number, _delta: number, animatePhysiology: boolean) => {
    drops.visible = animatePhysiology;
    if (!animatePhysiology) return;

    for (let i = 0; i < dropCount; i++) {
      const t = (elapsed * 0.18 + i / dropCount) % 1;
      if (i < 8) {
        nephronPath.getPointAt(t, _tempPos);
        _tempPos.add(nephronGroup.position);
      } else {
        ureterCurve.getPointAt(t, _tempPos);
        _tempPos.add(ureterGroup.position);
      }
      dummy.position.copy(_tempPos);
      dummy.updateMatrix();
      drops.setMatrixAt(i, dummy.matrix);
    }
    drops.instanceMatrix.needsUpdate = true;
  };

  return { root, parts, disposeables, updateAnimation };
}
