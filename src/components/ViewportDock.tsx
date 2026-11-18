import React from 'react';
import {
  RotateCcw,
  RefreshCw,
  Layers,
  Scissors,
  Focus,
  CircleDot,
  Activity,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Columns2,
} from 'lucide-react';
import type { OrganId } from '../types/anatomy';
import type { CameraAnglePreset, SceneViewMode } from '../three/anatomyPartTypes';
import type { UiDictionary } from '../data/translations';

interface ViewportDockProps {
  viewMode: SceneViewMode;
  selectedPartId: string | null;
  exploded: boolean;
  cutaway: boolean;
  isolated: boolean;
  animatePhysiology: boolean;
  autoRotate: boolean;
  showLabels: boolean;
  collapsed: boolean;
  dict: UiDictionary;
  onToggleCollapse: () => void;
  onSelectMode: (mode: SceneViewMode) => void;
  onToggleExploded: () => void;
  onToggleCutaway: () => void;
  onToggleIsolated: () => void;
  onToggleAnimatePhysiology: () => void;
  onToggleAutoRotate: () => void;
  onToggleLabels: () => void;
  onResetCamera: () => void;
  onZoom: (dir: 'in' | 'out') => void;
  onCameraPreset: (angle: CameraAnglePreset) => void;
  onJumpCompare?: () => void;
}

const MODE_OPTIONS: Array<{ id: SceneViewMode; label: string }> = [
  { id: 'body', label: 'Body' },
  { id: 'heart', label: 'Heart' },
  { id: 'brain', label: 'Brain' },
  { id: 'lungs', label: 'Lungs' },
  { id: 'liver', label: 'Liver' },
  { id: 'kidneys', label: 'Kidneys' },
  { id: 'eye', label: 'Eye' },
  { id: 'intestines', label: 'Intestines' },
  { id: 'pancreas', label: 'Pancreas' },
  { id: 'skin', label: 'Skin' },
];

const CAMERA_ANGLES: Array<{ id: CameraAnglePreset; label: string }> = [
  { id: 'front', label: 'Front' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'top', label: 'Top' },
  { id: 'posterior', label: 'Back' },
];

export const ViewportDock: React.FC<ViewportDockProps> = ({
  viewMode,
  selectedPartId,
  exploded,
  cutaway,
  isolated,
  animatePhysiology,
  autoRotate,
  showLabels,
  collapsed,
  dict,
  onToggleCollapse,
  onSelectMode,
  onToggleExploded,
  onToggleCutaway,
  onToggleIsolated,
  onToggleAnimatePhysiology,
  onToggleAutoRotate,
  onToggleLabels,
  onResetCamera,
  onZoom,
  onCameraPreset,
  onJumpCompare,
}) => {
  const animLabel =
    viewMode === 'heart'
      ? 'Circulation'
      : viewMode === 'lungs'
        ? 'Breathing'
        : viewMode === 'kidneys'
          ? 'Filtration'
          : viewMode === 'eye'
            ? 'Optics'
            : 'Physiology';

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center px-3">
      <button
        type="button"
        onClick={onToggleCollapse}
        className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-md border border-[#E5DFD3] bg-white/95 px-3 py-1 text-[11px] font-medium text-[#52525B] shadow-xs hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors"
      >
        {collapsed ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" />
            <span>Show Tools</span>
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5" />
            <span>Hide Tools</span>
          </>
        )}
      </button>

      {!collapsed && (
        <div className="pointer-events-auto max-w-[98%] rounded-xl border border-[#E5DFD3] bg-[#FFFFFF]/96 px-3 py-2.5 shadow-md space-y-2">
          {/* Row 1: 9 Organs + Full Body Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {MODE_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMode(m.id as OrganId | 'body')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === m.id
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-[#F3EFE7] text-[#52525B] hover:text-[#18181B]'
                }`}
              >
                {m.id === 'body' ? dict.controls.fullBody : m.label}
              </button>
            ))}
          </div>

          {/* Row 2: Specimen Tools + Zoom + Camera Angles */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-[#E5DFD3] pt-2">
            {viewMode !== 'body' && (
              <>
                <button
                  type="button"
                  onClick={onToggleIsolated}
                  disabled={!selectedPartId}
                  title={
                    selectedPartId
                      ? 'Isolate selected structure'
                      : 'Select a structure first to isolate'
                  }
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-45 ${
                    isolated && selectedPartId
                      ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                      : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]'
                  }`}
                >
                  <Focus className="h-3.5 w-3.5" />
                  <span>{dict.controls.isolate}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleCutaway}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    cutaway
                      ? 'border-[#9F1239] bg-[#9F1239] text-white'
                      : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#9F1239]'
                  }`}
                >
                  <Scissors className="h-3.5 w-3.5" />
                  <span>{dict.controls.crossSection}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleExploded}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    exploded
                      ? 'border-[#B45309] bg-[#B45309] text-white'
                      : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#B45309]'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{dict.controls.layers}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onToggleAnimatePhysiology}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                animatePhysiology
                  ? 'border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A]'
                  : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{animLabel}</span>
            </button>

            <button
              type="button"
              onClick={onToggleLabels}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                showLabels
                  ? 'border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A]'
                  : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]'
              }`}
            >
              <CircleDot className="h-3.5 w-3.5" />
              <span>{dict.controls.hotspots}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAutoRotate}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                autoRotate
                  ? 'border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A]'
                  : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{dict.controls.autoRotate}</span>
            </button>

            {/* Zoom + / - */}
            <div className="inline-flex items-center rounded-md border border-[#E5DFD3] bg-[#FBF9F5]">
              <button
                type="button"
                onClick={() => onZoom('in')}
                aria-label={dict.controls.zoomIn}
                title={dict.controls.zoomIn}
                className="px-2 py-1 text-[#18181B] hover:text-[#1E3A8A] border-r border-[#E5DFD3]"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onZoom('out')}
                aria-label={dict.controls.zoomOut}
                title={dict.controls.zoomOut}
                className="px-2 py-1 text-[#18181B] hover:text-[#1E3A8A]"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
            </div>

            {onJumpCompare && (
              <button
                type="button"
                onClick={onJumpCompare}
                className="inline-flex items-center gap-1 rounded-md border border-[#E5DFD3] bg-[#FBF9F5] px-2.5 py-1 text-xs font-medium text-[#18181B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span>{dict.controls.compare}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetCamera}
              className="inline-flex items-center gap-1 rounded-md border border-[#E5DFD3] bg-[#FBF9F5] px-2.5 py-1 text-xs font-medium text-[#18181B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{dict.controls.reset}</span>
            </button>

            <span className="hidden lg:block h-4 w-px bg-[#E5DFD3]" />

            <div className="hidden lg:flex items-center gap-0.5 rounded-md bg-[#F3EFE7] p-0.5">
              {CAMERA_ANGLES.map((ang) => (
                <button
                  key={ang.id}
                  type="button"
                  onClick={() => onCameraPreset(ang.id)}
                  className="rounded px-2 py-0.5 text-[11px] font-medium text-[#52525B] hover:bg-white hover:text-[#18181B] transition-colors whitespace-nowrap"
                >
                  {ang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
