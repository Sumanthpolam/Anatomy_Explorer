import React, { useMemo, useState } from 'react';
import { AlertCircle, Search, ArrowUpRight } from 'lucide-react';
import type { DiseaseRecord, OrganId } from '../types/anatomy';

interface DiseaseSystemProps {
  diseases: DiseaseRecord[];
  initialDiseaseId?: string | null;
  onInspectOrgan: (organId: OrganId) => void;
}

const ORGAN_FILTERS: Array<{ id: 'all' | OrganId; label: string }> = [
  { id: 'all', label: 'All Organs' },
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

export const DiseaseSystem: React.FC<DiseaseSystemProps> = ({
  diseases,
  initialDiseaseId,
  onInspectOrgan,
}) => {
  const [organFilter, setOrganFilter] = useState<'all' | OrganId>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<string>(
    initialDiseaseId || diseases[0]?.id || '',
  );

  const filteredDiseases = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return diseases.filter((d) => {
      if (organFilter !== 'all' && d.organId !== organFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.shortExplanation.toLowerCase().includes(q) ||
        d.affectedStructures.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [diseases, organFilter, searchText]);

  const activeDisease =
    filteredDiseases.find((d) => d.id === selectedId) ??
    diseases.find((d) => d.id === selectedId) ??
    filteredDiseases[0] ??
    null;

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-4 border-b border-[#E5DFD3] pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9F1239]">
              Clinical Notes &amp; Pathology Reference
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] [text-wrap:balance]">
              Clinical Notes, Conditions &amp; Treatments
            </h1>
            <p className="text-sm leading-relaxed text-[#52525B]">
              Examine how medical conditions affect specific structures across all nine organs, distinguishing between definitive cures, rehabilitation, and ongoing clinical management.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter conditions or structures..."
              className="w-full rounded-lg border border-[#E5DFD3] bg-white py-2 pl-9 pr-3 text-xs text-[#18181B] placeholder:text-[#71717A] focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white p-1">
            {ORGAN_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setOrganFilter(f.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  organFilter === f.id
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#52525B] hover:text-[#18181B]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#B45309]/30 bg-[#FEF3C7]/60 px-3.5 py-2 text-xs text-[#78350F]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#B45309]" />
            <span>
              Educational reference only — does not replace professional medical advice or diagnosis.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Condition Directory */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredDiseases.length === 0 ? (
            <div className="rounded-xl border border-[#E5DFD3] bg-white p-5 text-sm text-[#52525B]">
              No clinical notes match your current filter.
            </div>
          ) : (
            filteredDiseases.map((d) => {
              const isSelected = activeDisease?.id === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedId(d.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-[#1E3A8A] bg-[#EEF2FF]/70'
                      : 'border-[#E5DFD3] bg-white hover:border-[#1E3A8A]/60'
                  }`}
                >
                  <div className="text-[11px] font-medium text-[#71717A]">
                    {d.organName} · {d.affectedStructures[0]}
                  </div>
                  <div className="mt-1 font-display text-base font-bold text-[#18181B]">
                    {d.name}
                  </div>
                  <div className="mt-1 text-xs text-[#52525B] line-clamp-2">
                    {d.shortExplanation}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detailed Clinical Note */}
        <div className="lg:col-span-8">
          {activeDisease ? (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5DFD3] pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
                    <span className="font-semibold text-[#1E3A8A]">{activeDisease.organName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeDisease.prognosisCategory}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
                    {activeDisease.name}
                  </h2>
                  <p className="text-xs font-medium text-[#9F1239]">
                    Affected Structures: {activeDisease.affectedStructures.join(', ')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onInspectOrgan(activeDisease.organId)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#172E6E] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Inspect {activeDisease.organName.replace('Human ', '')} in 3D</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                  Pathophysiology Overview
                </h3>
                <p className="text-sm leading-relaxed text-[#18181B]">
                  {activeDisease.shortExplanation} {activeDisease.detailedExplanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E5DFD3] pt-5">
                <div className="space-y-2">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#9F1239]">
                    Common Symptoms
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#52525B]">
                    {activeDisease.symptoms.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9F1239]" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Causes &amp; Risk Factors
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#52525B]">
                    {activeDisease.causesAndRiskFactors.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3A8A]" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E5DFD3] pt-5">
                <div className="space-y-2">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                    Diagnostic Methods
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#52525B]">
                    {activeDisease.diagnosticMethods.map((m) => (
                      <li key={m} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#71717A]" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#15803D]">
                    Prevention &amp; Risk Reduction
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#52525B]">
                    {activeDisease.preventionMeasures.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#15803D]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#E5DFD3] pt-5 space-y-3">
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#B45309]">
                  Treatment, Rehabilitation &amp; Prognosis Clarity
                </h3>
                <p className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 text-sm leading-relaxed text-[#18181B]">
                  {activeDisease.treatmentDistinction}
                </p>
                <ul className="space-y-1.5 text-sm text-[#52525B]">
                  {activeDisease.treatmentOptions.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3A8A]" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
