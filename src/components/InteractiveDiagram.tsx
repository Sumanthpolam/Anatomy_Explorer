import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { OrganData } from '../types/anatomy';

interface InteractiveDiagramProps {
  organ: OrganData;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  enlargeLabel?: string;
}

function getPlateFrameBg(organId: string): string {
  if (organId === 'lungs') return 'bg-[#0B1221]';
  if (organId === 'intestines') return 'bg-[#12151B]';
  if (organId === 'skin') return 'bg-[#B5CCD4]';
  return 'bg-white';
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({
  organ,
  selectedPartId,
  onSelectPart,
  enlargeLabel = 'Enlarge Diagram',
}) => {
  const [enlarged, setEnlarged] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [organ.id]);

  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlarged(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enlarged]);

  const activeHotspot =
    organ.diagramHotspots.find((h) => h.partId === selectedPartId) ?? null;

  return (
    <div className="rounded-2xl border border-[#E5DFD3] bg-white p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            Medical Reference Plate
          </div>
          <h3 className="font-display text-xl font-bold text-[#18181B]">
            {organ.name} — Interactive Diagram
          </h3>
          <p className="text-xs text-[#52525B] max-w-2xl">
            {organ.illustrationCaption} Click any marker or structure label below to inspect it and read its full medical details.
          </p>
        </div>

        {!imgError && (
          <button
            type="button"
            onClick={() => setEnlarged(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] px-3 py-1.5 text-xs font-medium text-[#18181B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{enlargeLabel}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className={`lg:col-span-7 relative overflow-hidden rounded-xl border border-[#E5DFD3] ${getPlateFrameBg(organ.id)}`}
        >
          {!imgError ? (
            <div className="relative w-full">
              <img
                src={organ.illustrationUrl}
                alt={organ.illustrationCaption}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-auto object-contain block"
              />
              {organ.diagramHotspots.map((spot, idx) => {
                const isSelected = selectedPartId === spot.partId;
                return (
                  <button
                    key={`${spot.partId}-${idx}`}
                    type="button"
                    onClick={() => onSelectPart(spot.partId)}
                    title={`${spot.label}: ${spot.note}`}
                    style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-mono font-semibold shadow-md transition-transform hover:scale-115 cursor-pointer ${
                      isSelected
                        ? 'border-white bg-[#9F1239] text-white scale-115 ring-2 ring-[#9F1239]/40'
                        : 'border-white bg-[#1E3A8A]/92 text-white hover:bg-[#9F1239]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#52525B]">
              Unable to load anatomical plate for {organ.name}.
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-3">
          {activeHotspot && (
            <div className="rounded-xl border border-[#1E3A8A]/30 bg-[#EEF2FF]/60 p-3.5 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#1E3A8A]">
                Selected Marker
              </div>
              <div className="font-display text-base font-bold text-[#18181B]">
                {activeHotspot.label}
              </div>
              <p className="text-xs leading-relaxed text-[#52525B]">
                {activeHotspot.note}
              </p>
            </div>
          )}

          <div className="text-xs font-semibold text-[#52525B]">
            Diagram Key ({organ.diagramHotspots.length} clickable labels)
          </div>

          <div className="max-h-80 overflow-y-auto pr-1 space-y-1.5">
            {organ.diagramHotspots.map((spot, idx) => {
              const isSelected = selectedPartId === spot.partId;
              return (
                <button
                  key={`${spot.partId}-${idx}`}
                  type="button"
                  onClick={() => onSelectPart(spot.partId)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition-colors flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-[#1E3A8A] bg-[#EEF2FF]/70'
                      : 'border-[#E5DFD3] bg-[#FBF9F5] hover:border-[#1E3A8A]/60'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold ${
                      isSelected
                        ? 'bg-[#9F1239] text-white'
                        : 'bg-[#1E3A8A] text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#18181B]">
                      {spot.label}
                    </div>
                    <div className="text-[11px] text-[#52525B] leading-snug">
                      {spot.note}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {enlarged && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${organ.name} enlarged anatomical diagram`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181B]/80 p-4 sm:p-8"
          onClick={() => setEnlarged(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-5xl w-full overflow-auto rounded-2xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#E5DFD3]">
              <div>
                <h4 className="font-display text-lg font-bold text-[#18181B]">
                  {organ.name} — High-Resolution Reference Plate
                </h4>
                <p className="text-xs text-[#52525B]">{organ.illustrationCaption}</p>
              </div>
              <button
                type="button"
                onClick={() => setEnlarged(false)}
                aria-label="Close enlarged diagram"
                className="rounded-lg border border-[#E5DFD3] bg-white p-2 text-[#18181B] hover:border-[#1E3A8A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <img
                src={organ.illustrationUrl}
                alt={organ.illustrationCaption}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-lg border border-[#E5DFD3]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
