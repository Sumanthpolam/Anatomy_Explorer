import * as THREE from 'three';
import type { OrganId } from '../types/anatomy';

export type SceneViewMode = 'body' | OrganId;
export type CameraAnglePreset = 'front' | 'left' | 'right' | 'top' | 'posterior';

export interface SelectablePartEntry {
  id: string;
  label: string;
  organId: OrganId;
  meshes: THREE.Mesh[];
  group: THREE.Object3D;
  basePosition: THREE.Vector3;
  explodeOffset: THREE.Vector3;
  anchorLocal: THREE.Vector3;
  hideInCutaway?: boolean;
  fadeInCutaway?: boolean;
  defaultOpacity?: number;
}

export interface BuiltAnatomyModel {
  root: THREE.Group;
  parts: SelectablePartEntry[];
  disposeables: Array<{ dispose: () => void }>;
  updateAnimation?: (elapsed: number, delta: number, animatePhysiology: boolean) => void;
}

export interface ProjectedLabel {
  id: string;
  label: string;
  x: number;
  y: number;
  visible: boolean;
}
