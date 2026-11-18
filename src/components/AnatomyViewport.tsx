import { publicAssetUrl } from '../utils/publicAssetUrl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { OrganData, OrganId } from '../types/anatomy';
import type { CameraAnglePreset, SceneViewMode } from '../three/anatomyPartTypes';

interface AnatomyViewportProps {
  viewMode: SceneViewMode;
  selectedPartId: string | null;
  exploded: boolean;
  cutaway: boolean;
  isolated: boolean;
  animatePhysiology: boolean;
  autoRotate: boolean;
  showLabels: boolean;
  hiddenPartIds: string[];
  cameraResetSignal: number;
  cameraPreset: { angle: CameraAnglePreset; seq: number } | null;
  zoomSignal: { dir: 'in' | 'out'; seq: number } | null;
  hints?: { drag: string; scroll: string; clickDot: string };
  organs?: OrganData[];
  onSelectOrgan: (organId: OrganId) => void;
  onSelectPart: (partId: string) => void;
  onHoverPartChange?: (label: string | null) => void;
}

interface BodyOrganRegion {
  organId: OrganId;
  label: string;
  subtitle: string;
  dotX: number;
  dotY: number;
  hitbox: { left: number; top: number; width: number; height: number };
  zIndex: number;
}

const BODY_IMAGE_URL = '/assets/aistudio/image_6c6f55bf.png';

const BODY_ORGAN_REGIONS: BodyOrganRegion[] = [
  {
    organId: 'brain',
    label: 'Human Brain',
    subtitle: '12 neural structures',
    dotX: 50,
    dotY: 9.5,
    hitbox: { left: 38, top: 3, width: 24, height: 11.5 },
    zIndex: 15,
  },
  {
    organId: 'eye',
    label: 'Human Eye',
    subtitle: '6 optical structures',
    dotX: 43,
    dotY: 16.5,
    hitbox: { left: 39, top: 14.5, width: 22, height: 4.5 },
    zIndex: 16,
  },
  {
    organId: 'lungs',
    label: 'Human Lungs',
    subtitle: '11 respiratory structures',
    dotX: 37,
    dotY: 39,
    hitbox: { left: 26, top: 28, width: 47, height: 23 },
    zIndex: 10,
  },
  {
    organId: 'heart',
    label: 'Human Heart',
    subtitle: '25 cardiac structures',
    dotX: 52.5,
    dotY: 44,
    hitbox: { left: 45.5, top: 38.5, width: 14, height: 12.5 },
    zIndex: 25,
  },
  {
    organId: 'skin',
    label: 'Human Skin',
    subtitle: '5 integumentary layers',
    dotX: 23.5,
    dotY: 44,
    hitbox: { left: 19, top: 29, width: 8, height: 24 },
    zIndex: 12,
  },
  {
    organId: 'liver',
    label: 'Human Liver',
    subtitle: '6 hepatic structures',
    dotX: 40.5,
    dotY: 55,
    hitbox: { left: 31, top: 50.5, width: 24, height: 9.5 },
    zIndex: 18,
  },
  {
    organId: 'pancreas',
    label: 'Human Pancreas',
    subtitle: '4 pancreatic structures',
    dotX: 56.5,
    dotY: 57,
    hitbox: { left: 49, top: 53.5, width: 15, height: 7.5 },
    zIndex: 20,
  },
  {
    organId: 'kidneys',
    label: 'Human Kidneys',
    subtitle: '11 renal structures',
    dotX: 65,
    dotY: 60.5,
    hitbox: { left: 60, top: 56, width: 11, height: 9 },
    zIndex: 19,
  },
  {
    organId: 'intestines',
    label: 'Human Intestines',
    subtitle: '5 intestinal segments',
    dotX: 50,
    dotY: 71,
    hitbox: { left: 31, top: 61, width: 38, height: 21 },
    zIndex: 14,
  },
];

const FALLBACK_SPECIMEN_URLS: Record<SceneViewMode, string> = {
  body: BODY_IMAGE_URL,
  heart: '/assets/aistudio/image_492be009.png',
  brain: '/assets/aistudio/image_7c22f9df.png',
  lungs: '/assets/aistudio/image_4503a1c0.png',
  kidneys: '/assets/aistudio/image_6a174409.png',
  liver: '/assets/aistudio/image_0d5dc465.png',
  eye: '/assets/aistudio/image_51e78e51.png',
  intestines: '/assets/aistudio/image_a17e9afb.png',
  pancreas: '/assets/aistudio/image_df92ff26.png',
  skin: '/assets/aistudio/image_d084d992.png',
};

function getStageBackdropClass(mode: SceneViewMode): string {
  if (mode === 'lungs') return 'bg-[#0B1221]';
  if (mode === 'intestines') return 'bg-[#12151B]';
  if (mode === 'skin') return 'bg-[#B5CCD4]';
  return 'bg-[#FFFFFF]';
}

export const AnatomyViewport: React.FC<AnatomyViewportProps> = ({
  viewMode,
  selectedPartId,
  exploded,
  cutaway,
  isolated,
  autoRotate,
  showLabels,
  hiddenPartIds,
  cameraResetSignal,
  cameraPreset,
  zoomSignal,
  hints = {
    drag: 'Drag to pan',
    scroll: 'Scroll to zoom',
    clickDot: 'Click an organ or dot to inspect',
  },
  organs = [],
  onSelectOrgan,
  onSelectPart,
  onHoverPartChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({
    w: 820,
    h: 620,
  });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({
    w: 800,
    h: 600,
  });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [hoveredBodyOrgan, setHoveredBodyOrgan] = useState<OrganId | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
    moved: boolean;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origPanX: 0,
    origPanY: 0,
    moved: false,
  });

  const activeOrgan = useMemo(
    () =>
      viewMode === 'body' ? null : organs.find((o) => o.id === viewMode) ?? null,
    [organs, viewMode],
  );

  const specimenPath =
  viewMode === 'body'
    ? BODY_IMAGE_URL
    : activeOrgan?.illustrationUrl || FALLBACK_SPECIMEN_URLS[viewMode];

const specimenSrc = publicAssetUrl(specimenPath);

  const specimenAlt =
    viewMode === 'body'
      ? 'Full Human Anatomy Atlas showing brain, lungs, heart, liver, pancreas, kidneys, and intestines'
      : activeOrgan?.illustrationCaption || `${viewMode} anatomical illustration`;

  const visibleHotspots = useMemo(() => {
    if (!activeOrgan) return [];
    const hiddenSet = new Set(hiddenPartIds);
    return activeOrgan.diagramHotspots.filter((spot) => !hiddenSet.has(spot.partId));
  }, [activeOrgan, hiddenPartIds]);

  const selectedPart = useMemo(() => {
    if (!activeOrgan || !selectedPartId) return null;
    return activeOrgan.parts.find((p) => p.id === selectedPartId) ?? null;
  }, [activeOrgan, selectedPartId]);

  const selectedHotspot = useMemo(
    () =>
      visibleHotspots.find((h) => h.partId === selectedPartId) ?? null,
    [visibleHotspots, selectedPartId],
  );

  // Track viewport container dimensions cleanly
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setContainerSize({
        w: Math.max(240, el.clientWidth),
        h: Math.max(240, el.clientHeight),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset view when switching specimen or clicking Reset
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHoverLabel(null);
    setHoveredBodyOrgan(null);
    onHoverPartChange?.(null);
  }, [viewMode, cameraResetSignal, onHoverPartChange]);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [specimenSrc]);

  // Zoom +/- dock button handler
  useEffect(() => {
    if (!zoomSignal) return;
    setZoom((prev) => {
      const factor = zoomSignal.dir === 'in' ? 1.25 : 0.8;
      const next = Math.min(3.5, Math.max(0.85, Number((prev * factor).toFixed(2))));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, [zoomSignal]);

  // Quick camera focus presets
  useEffect(() => {
    if (!cameraPreset) return;
    switch (cameraPreset.angle) {
      case 'front':
        setZoom(1);
        setPan({ x: 0, y: 0 });
        break;
      case 'top':
        setZoom(1.45);
        setPan({ x: 0, y: 120 });
        break;
      case 'left':
        setZoom(1.45);
        setPan({ x: 110, y: 0 });
        break;
      case 'right':
        setZoom(1.45);
        setPan({ x: -110, y: 0 });
        break;
      case 'posterior':
        setZoom(1.35);
        setPan({ x: 0, y: -90 });
        break;
    }
  }, [cameraPreset]);

  // Subtle focus spotlight when Isolate is enabled with a selected structure
  useEffect(() => {
    if (isolated && selectedHotspot && viewMode !== 'body') {
      const targetZoom = 1.45;
      const dxPct = 50 - selectedHotspot.xPct;
      const dyPct = 50 - selectedHotspot.yPct;
      setZoom(targetZoom);
      setPan({
        x: Math.round((dxPct / 100) * 320),
        y: Math.round((dyPct / 100) * 260),
      });
    } else if (!isolated && viewMode !== 'body') {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isolated, selectedHotspot, viewMode]);

  // Guided Tour when "Rotate" toggle is active in organ view
  useEffect(() => {
    if (!autoRotate || viewMode === 'body' || visibleHotspots.length === 0) return;
    const timer = window.setInterval(() => {
      const curIdx = visibleHotspots.findIndex((h) => h.partId === selectedPartId);
      const nextSpot = visibleHotspots[(curIdx + 1) % visibleHotspots.length];
      if (nextSpot) {
        onSelectPart(nextSpot.partId);
      }
    }, 2800);
    return () => window.clearInterval(timer);
  }, [autoRotate, viewMode, visibleHotspots, selectedPartId, onSelectPart]);

  // Exact fitted specimen box so percentages match the visible image 1:1
  const frameBox = useMemo(() => {
    const padX = containerSize.w < 640 ? 24 : 56;
    const padY = containerSize.w < 640 ? 124 : 136;
    const availW = Math.max(180, containerSize.w - padX);
    const availH = Math.max(180, containerSize.h - padY);
    const ratio = Math.min(availW / naturalSize.w, availH / naturalSize.h);
    return {
      width: Math.round(naturalSize.w * ratio),
      height: Math.round(naturalSize.h * ratio),
    };
  }, [containerSize, naturalSize]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom((prev) => {
      const next = Math.min(3.5, Math.max(0.85, Number((prev * factor).toFixed(2))));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button')) return;
      dragStateRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        origPanX: pan.x,
        origPanY: pan.y,
        moved: false,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pan.x, pan.y],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.dragging) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.hypot(dx, dy) > 4) {
      dragStateRef.current.moved = true;
    }
    setPan({
      x: Math.max(-420, Math.min(420, dragStateRef.current.origPanX + dx)),
      y: Math.max(-360, Math.min(360, dragStateRef.current.origPanY + dy)),
    });
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.dragging) {
      dragStateRef.current.dragging = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if pointer already released
      }
    }
  }, []);

  const setHover = useCallback(
    (label: string | null) => {
      setHoverLabel(label);
      onHoverPartChange?.(label);
    },
    [onHoverPartChange],
  );

  const isDarkStage = viewMode === 'lungs' || viewMode === 'intestines';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center cursor-grab active:cursor-grabbing ${getStageBackdropClass(viewMode)}`}
    >
      {/* Zoomable & Pannable Exact-Aspect Anatomical Specimen Stage */}
      <div
        className="relative flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          marginBottom: '42px',
        }}
      >
        <div
          className="relative"
          style={{
            width: `${frameBox.width}px`,
            height: `${frameBox.height}px`,
          }}
        >
          <img
            src={specimenSrc}
            alt={specimenAlt}
            referrerPolicy="no-referrer"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
              }
              setImgLoaded(true);
            }}
            onError={() => {
              setImgError(true);
              setImgLoaded(true);
            }}
            className="h-full w-full object-contain block pointer-events-none select-none"
          />

          {/* FULL HUMAN BODY: Direct Clickable Organ Regions + Clean Non-Overlapping Numbered Pins */}
          {viewMode === 'body' && imgLoaded && !imgError && (
            <>
              {BODY_ORGAN_REGIONS.map((region) => {
                const isHovered = hoveredBodyOrgan === region.organId;
                return (
                  <button
                    key={`region-${region.organId}`}
                    type="button"
                    aria-label={`Inspect ${region.label}`}
                    onClick={() => onSelectOrgan(region.organId)}
                    onMouseEnter={() => {
                      setHoveredBodyOrgan(region.organId);
                      setHover(`${region.label} · ${region.subtitle}`);
                    }}
                    onMouseLeave={() => {
                      setHoveredBodyOrgan(null);
                      setHover(null);
                    }}
                    style={{
                      left: `${region.hitbox.left}%`,
                      top: `${region.hitbox.top}%`,
                      width: `${region.hitbox.width}%`,
                      height: `${region.hitbox.height}%`,
                      zIndex: region.zIndex,
                    }}
                    className={`absolute rounded-full transition-all cursor-pointer focus-visible:outline-none ${
                      isHovered
                        ? 'bg-[#1E3A8A]/14 ring-2 ring-[#1E3A8A]/75 shadow-sm'
                        : 'bg-transparent hover:bg-[#1E3A8A]/10'
                    }`}
                  />
                );
              })}

              {showLabels &&
                BODY_ORGAN_REGIONS.map((region, idx) => {
                  const isHovered = hoveredBodyOrgan === region.organId;
                  return (
                    <button
                      key={`pin-${region.organId}`}
                      type="button"
                      onClick={() => onSelectOrgan(region.organId)}
                      onMouseEnter={() => {
                        setHoveredBodyOrgan(region.organId);
                        setHover(`${region.label} · ${region.subtitle}`);
                      }}
                      onMouseLeave={() => {
                        setHoveredBodyOrgan(null);
                        setHover(null);
                      }}
                      title={`${region.label} (${region.subtitle})`}
                      style={{
                        left: `${region.dotX}%`,
                        top: `${region.dotY}%`,
                        zIndex: 40,
                      }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-mono font-bold shadow-md transition-transform cursor-pointer focus-visible:outline-none ${
                        isHovered
                          ? 'scale-125 border-white bg-[#9F1239] text-white ring-2 ring-[#9F1239]/40'
                          : 'border-white bg-[#1E3A8A]/92 text-white hover:scale-115 hover:bg-[#9F1239]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
            </>
          )}

          {/* INDIVIDUAL ORGAN SPECIMEN: Clickable Hotspot Pins Synced with InfoPanel */}
          {viewMode !== 'body' &&
            imgLoaded &&
            !imgError &&
            showLabels &&
            visibleHotspots.map((spot, idx) => {
              const isSelected = selectedPartId === spot.partId;
              const dimmed = isolated && selectedPartId && !isSelected;
              return (
                <button
                  key={`${spot.partId}-${idx}`}
                  type="button"
                  onClick={() => onSelectPart(spot.partId)}
                  onMouseEnter={() => setHover(spot.label)}
                  onMouseLeave={() => setHover(null)}
                  title={`${spot.label}: ${spot.note}`}
                  style={{
                    left: `${spot.xPct}%`,
                    top: `${spot.yPct}%`,
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-mono font-semibold shadow-md transition-all cursor-pointer focus-visible:outline-none ${
                    isSelected
                      ? 'scale-125 border-white bg-[#9F1239] text-white ring-3 ring-[#9F1239]/40'
                      : dimmed
                        ? 'opacity-30 border-white bg-[#52525B] text-white'
                        : 'border-white bg-[#1E3A8A]/92 text-white hover:scale-115 hover:bg-[#9F1239]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
        </div>
      </div>

      {/* Selected Structure Quick Callout Badge (when Isolate, Cross-section, or Layers is active) */}
      {viewMode !== 'body' &&
        (selectedPart || cutaway || exploded) && (
          <div className="pointer-events-none absolute top-14 right-3.5 z-20 max-w-xs rounded-xl border border-[#E5DFD3] bg-[#FFFFFF]/95 px-3.5 py-2.5 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#1E3A8A]">
              {cutaway && <span>Cross-Section Reference</span>}
              {exploded && <span>Structural Layers ({activeOrgan?.parts.length ?? 0})</span>}
              {!cutaway && !exploded && <span>Selected Structure</span>}
            </div>
            {selectedPart ? (
              <>
                <div className="font-display text-sm font-bold text-[#18181B]">
                  {selectedPart.name}
                </div>
                <p className="text-[11px] leading-snug text-[#52525B] line-clamp-2">
                  {selectedPart.functionSummary}
                </p>
              </>
            ) : (
              <p className="text-[11px] leading-snug text-[#52525B]">
                {activeOrgan?.anatomySummary}
              </p>
            )}
          </div>
        )}

      {/* Subtle Hover Tooltip */}
      {hoverLabel && (
        <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-30 rounded-md border border-[#E5DFD3] bg-white/95 px-3 py-1 text-xs font-medium text-[#18181B] shadow-sm whitespace-nowrap">
          {hoverLabel}
        </div>
      )}

      {/* Minimal Gallery Instruction Card */}
      <div
        className={`pointer-events-none absolute top-14 left-3.5 z-10 hidden sm:flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-[11px] shadow-xs ${
          isDarkStage
            ? 'border-white/20 bg-[#18181B]/80 text-white/90'
            : 'border-[#E5DFD3] bg-[#FBF9F5]/95 text-[#52525B]'
        }`}
      >
        <span>{hints.drag}</span>
        <span>{hints.scroll}</span>
        <span>{hints.clickDot}</span>
      </div>

      {/* Loading Indicator */}
      {!imgLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#F3EFE7]/70">
          <div className="flex flex-col items-center gap-2 text-sm text-[#52525B]">
            <div className="w-6 h-6 rounded-full border-2 border-[#1E3A8A] border-t-transparent animate-spin" />
            <span>Loading anatomical plate...</span>
          </div>
        </div>
      )}

      {/* Image Load Fallback */}
      {imgError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#FBF9F5]/95 p-6 text-center">
          <div className="max-w-sm space-y-2">
            <p className="font-display text-lg font-semibold text-[#18181B]">
              Anatomical Image Unavailable
            </p>
            <p className="text-sm text-[#52525B]">
              Unable to load {specimenSrc}. Please select another specimen or refresh.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
