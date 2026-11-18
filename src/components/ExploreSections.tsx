import React, { useEffect, useState } from 'react';
import { Microscope, Activity, Columns2, Stethoscope, ArrowUpRight, Network } from 'lucide-react';
import type { DiseaseRecord, OrganData, OrganId } from '../types/anatomy';
import { InteractiveDiagram } from './InteractiveDiagram';

interface ExploreSectionsProps {
  activeOrgan: OrganData;
  allOrgans: OrganData[];
  selectedPartId: string | null;
  organDiseases: DiseaseRecord[];
  animatePhysiology: boolean;
  enlargeLabel: string;
  onSelectPart: (partId: string) => void;
  onSelectOrgan: (organId: OrganId) => void;
  onToggleAnimatePhysiology: () => void;
  onOpenDiseasePage: (diseaseId: string) => void;
}

export const ExploreSections: React.FC<ExploreSectionsProps> = ({
  activeOrgan,
  allOrgans,
  selectedPartId,
  organDiseases,
  animatePhysiology,
  enlargeLabel,
  onSelectPart,
  onSelectOrgan,
  onToggleAnimatePhysiology,
  onOpenDiseasePage,
}) => {
  const compareChoices = allOrgans.filter((o) => o.id !== activeOrgan.id);
  const [compareId, setCompareId] = useState<OrganId>(
    compareChoices[0]?.id ?? activeOrgan.id,
  );

  useEffect(() => {
    if (compareId === activeOrgan.id && compareChoices[0]) {
      setCompareId(compareChoices[0].id);
    }
  }, [activeOrgan.id, compareId, compareChoices]);

  const comparedOrgan =
    allOrgans.find((o) => o.id === compareId) ?? compareChoices[0] ?? activeOrgan;

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Interactive Labelled Reference Diagram */}
      <InteractiveDiagram
        organ={activeOrgan}
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        enlargeLabel={enlargeLabel}
      />

      {/* 2. Microscopic View + Function Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Microscopic Histology Card */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E5DFD3] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              <Microscope className="h-4 w-4" />
              <span>Microscopic View</span>
            </div>
            <span className="font-mono text-xs tabular-nums text-[#52525B]">
              {activeOrgan.microscopicView.magnification}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-[#18181B]">
            {activeOrgan.microscopicView.title}
          </h3>

          <p className="text-sm leading-relaxed text-[#52525B]">
            {activeOrgan.microscopicView.description}
          </p>

          <div className="border-t border-[#E5DFD3] pt-3">
            <div className="text-[11px] font-semibold text-[#71717A] mb-2">
              Cellular &amp; Tissue Elements
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeOrgan.microscopicView.structures.map((st) => (
                <span
                  key={st}
                  className="rounded-md border border-[#E5DFD3] bg-[#FBF9F5] px-2.5 py-1 text-xs font-medium text-[#18181B]"
                >
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Function Animation & Physiological Sequence */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E5DFD3] bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9F1239]">
              <Activity className="h-4 w-4" />
              <span>Function Animation &amp; Physiology</span>
            </div>
            <button
              type="button"
              onClick={onToggleAnimatePhysiology}
              className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                animatePhysiology
                  ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                  : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]'
              }`}
            >
              {animatePhysiology ? '3D Animation Active' : 'Start 3D Animation'}
            </button>
          </div>

          <p className="text-sm leading-relaxed text-[#52525B]">
            {activeOrgan.functionSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeOrgan.physiologySteps.map((st) => (
              <div
                key={st.step}
                className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-3.5 space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                  <span className="font-mono tabular-nums text-[#1E3A8A]">
                    0{st.step}
                  </span>
                  <span>{st.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#52525B]">{st.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Side-by-Side Compare Organs Section */}
      <div
        id="compare-organs-section"
        className="rounded-2xl border border-[#E5DFD3] bg-white p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DFD3] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
              <Columns2 className="h-4 w-4" />
              <span>Compare Organs</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#18181B]">
              Side-by-Side Anatomical Comparison
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#52525B]">Compare with:</span>
            <select
              aria-label="Choose second organ to compare"
              value={comparedOrgan.id}
              onChange={(e) => setCompareId(e.target.value as OrganId)}
              className="rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] px-3 py-1.5 text-xs font-semibold text-[#18181B] focus:border-[#1E3A8A] focus:outline-none"
            >
              {compareChoices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[activeOrgan, comparedOrgan].map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium text-[#71717A]">
                    {idx === 0 ? 'Active Specimen' : 'Comparison Specimen'} · {item.system}
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#18181B]">
                    {item.name}
                  </h4>
                  <div className="text-xs italic text-[#52525B]">{item.poeticSubtitle}</div>
                </div>
                {idx === 1 && (
                  <button
                    type="button"
                    onClick={() => onSelectOrgan(item.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#E5DFD3] bg-white px-2.5 py-1 text-xs font-medium text-[#1E3A8A] hover:border-[#1E3A8A]"
                  >
                    <span>Open 3D</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-[#52525B] border-t border-[#E5DFD3] pt-3">
                <div>
                  <span className="font-semibold text-[#18181B]">Location: </span>
                  {item.locationSummary}
                </div>
                <div>
                  <span className="font-semibold text-[#18181B]">Size &amp; Mass: </span>
                  <span className="font-mono tabular-nums">{item.weightOrSize}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#18181B]">Medical Importance: </span>
                  {item.medicalImportance}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {item.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="rounded-lg border border-[#E5DFD3] bg-white p-2.5">
                    <div className="text-[11px] text-[#71717A]">{m.label}</div>
                    <div className="font-mono text-sm font-semibold tabular-nums text-[#1E3A8A]">
                      {m.value} <span className="text-[11px] font-normal text-[#71717A]">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Clinical Notes, Common Conditions & Related Body Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-[#E5DFD3] bg-white p-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9F1239]">
            <Stethoscope className="h-4 w-4" />
            <span>Clinical Notes &amp; Common Conditions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {organDiseases.map((disease) => (
              <div
                key={disease.id}
                className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-[#9F1239]">
                    {disease.affectedStructures.slice(0, 2).join(' · ')}
                  </div>
                  <h4 className="font-display text-base font-bold text-[#18181B]">
                    {disease.name}
                  </h4>
                  <p className="text-xs leading-relaxed text-[#52525B]">
                    {disease.shortExplanation}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E5DFD3]">
                  <span className="text-[11px] text-[#71717A] truncate pr-2">
                    {disease.prognosisCategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDiseasePage(disease.id)}
                    className="text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0"
                  >
                    Read Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-[#E5DFD3] bg-white p-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            <Network className="h-4 w-4" />
            <span>Related Body Systems</span>
          </div>

          <p className="text-xs leading-relaxed text-[#52525B]">
            {activeOrgan.medicalImportance}
          </p>

          <div className="space-y-2">
            {activeOrgan.relatedSystems.map((sys) => {
              const linkedOrgan = allOrgans.find(
                (o) =>
                  o.id !== activeOrgan.id &&
                  (o.system.toLowerCase().includes(sys.split(' ')[0].toLowerCase()) ||
                    sys.toLowerCase().includes(o.category)),
              );
              return (
                <div
                  key={sys}
                  className="flex items-center justify-between rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] px-3.5 py-2.5 text-xs"
                >
                  <span className="font-semibold text-[#18181B]">{sys}</span>
                  {linkedOrgan ? (
                    <button
                      type="button"
                      onClick={() => onSelectOrgan(linkedOrgan.id)}
                      className="text-[#1E3A8A] font-medium hover:underline"
                    >
                      Inspect {linkedOrgan.name.replace('Human ', '')}
                    </button>
                  ) : (
                    <span className="text-[#71717A]">Connected</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
