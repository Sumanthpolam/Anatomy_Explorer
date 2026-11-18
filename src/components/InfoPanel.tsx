import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUpRight, AlertCircle, BookOpen } from 'lucide-react';
import type { AnatomicalPart, DiseaseRecord, OrganData, OrganId } from '../types/anatomy';
import type { UiDictionary } from '../data/translations';

export type InfoTabId =
  | 'overview'
  | 'anatomy'
  | 'function'
  | 'diseases'
  | 'treatment'
  | 'facts';

interface InfoPanelProps {
  activeOrgan: OrganData | null;
  allOrgans: OrganData[];
  selectedPart: AnatomicalPart | null;
  organDiseases: DiseaseRecord[];
  hiddenPartIds: string[];
  dict: UiDictionary;
  onSelectOrgan: (organId: OrganId) => void;
  onSelectPart: (partId: string | null) => void;
  onToggleHidePart: (partId: string) => void;
  onOpenDiseasePage: (diseaseId: string) => void;
  onViewLesson: (organId: OrganId) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  activeOrgan,
  allOrgans,
  selectedPart,
  organDiseases,
  hiddenPartIds,
  dict,
  onSelectOrgan,
  onSelectPart,
  onToggleHidePart,
  onOpenDiseasePage,
  onViewLesson,
}) => {
  const [activeTab, setActiveTab] = useState<InfoTabId>('overview');
  const [advancedMode, setAdvancedMode] = useState(false);

  const infoTabs: Array<{ id: InfoTabId; label: string }> = [
    { id: 'overview', label: dict.tabs.overview },
    { id: 'anatomy', label: dict.tabs.anatomy },
    { id: 'function', label: dict.tabs.function },
    { id: 'diseases', label: dict.tabs.diseases },
    { id: 'treatment', label: dict.tabs.treatment },
    { id: 'facts', label: dict.tabs.facts },
  ];

  // Full Human Body Gallery Directory when no organ is isolated
  if (!activeOrgan) {
    return (
      <aside className="flex h-full flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#E5DFD3] bg-[#FFFFFF] p-5 sm:p-6">
        <div className="space-y-2 border-b border-[#E5DFD3] pb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            Interactive 3D Anatomy Atlas · 9 Organs
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] [text-wrap:balance]">
            Explore Human Anatomy in 3D
          </h1>
          <p className="text-sm leading-relaxed text-[#52525B]">
            Rotate, zoom, and click an organ directly inside the 3D human body—or select any specimen below to examine its cross-sections, layers, labelled anatomical plate, and clinical notes.
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <h2 className="font-display text-sm font-semibold text-[#18181B]">
            Specimen Index ({allOrgans.length})
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {allOrgans.map((organ) => (
              <button
                key={organ.id}
                type="button"
                onClick={() => onSelectOrgan(organ.id)}
                className="group flex items-start justify-between gap-4 rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-3.5 text-left transition-colors hover:border-[#1E3A8A] hover:bg-white"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                    <span>{organ.system}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-[#1E3A8A]">
                      {organ.parts.length} structures
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-base font-bold text-[#18181B] group-hover:text-[#1E3A8A]">
                      {organ.name.replace('Human ', '')}
                    </span>
                    <span className="text-xs italic text-[#71717A] truncate">
                      {organ.poeticSubtitle}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#52525B] line-clamp-1">
                    {organ.tagline}
                  </p>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#71717A] group-hover:text-[#1E3A8A]" />
              </button>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const matchingDiseases = selectedPart
    ? organDiseases.filter((d) => selectedPart.relatedDiseaseIds.includes(d.id))
    : organDiseases;
  const displayedDiseases = matchingDiseases.length > 0 ? matchingDiseases : organDiseases;

  const divisions = Array.from(new Set(activeOrgan.parts.map((p) => p.parentDivision)));

  return (
    <aside className="flex h-full flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E5DFD3] bg-[#FFFFFF]">
      {/* Specimen Header */}
      <div className="border-b border-[#E5DFD3] p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#71717A]">
              <span className="font-medium text-[#1E3A8A]">{activeOrgan.system}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedPart ? selectedPart.parentDivision : activeOrgan.poeticSubtitle}</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#18181B] truncate">
              {selectedPart ? selectedPart.name : activeOrgan.name}
            </h2>
          </div>

          <div className="flex shrink-0 items-center rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] p-0.5">
            <button
              type="button"
              onClick={() => setAdvancedMode(false)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                !advancedMode
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              {dict.studentMode}
            </button>
            <button
              type="button"
              onClick={() => setAdvancedMode(true)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                advancedMode
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              {dict.detailedMode}
            </button>
          </div>
        </div>

        {/* Location + Weight/Size + View Lesson Action */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B]">
          <span className="font-mono text-[11px] tabular-nums text-[#71717A]">
            {activeOrgan.weightOrSize}
          </span>
          <button
            type="button"
            onClick={() => onViewLesson(activeOrgan.id)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#E5DFD3] bg-[#FBF9F5] px-2.5 py-1 text-[11px] font-semibold text-[#1E3A8A] hover:border-[#1E3A8A] transition-colors whitespace-nowrap"
          >
            <BookOpen className="h-3 w-3" />
            <span>{dict.viewLesson}</span>
          </button>
        </div>

        {/* Anatomical Structures Selector Strip */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#71717A]">
            <span>Structures ({activeOrgan.parts.length})</span>
            {selectedPart && (
              <button
                type="button"
                onClick={() => onSelectPart(null)}
                className="font-medium text-[#1E3A8A] hover:underline"
              >
                Show Whole {activeOrgan.name.replace('Human ', '')}
              </button>
            )}
          </div>

          <div className="max-h-44 overflow-y-auto pr-1 space-y-1.5">
            {divisions.map((div) => (
              <div key={div} className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                  {div}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeOrgan.parts
                    .filter((p) => p.parentDivision === div)
                    .map((part) => {
                      const active = selectedPart?.id === part.id;
                      const hidden = hiddenPartIds.includes(part.id);
                      return (
                        <div
                          key={part.id}
                          className={`inline-flex items-center rounded-md border text-xs transition-colors ${
                            active
                              ? 'border-[#1E3A8A] bg-[#EEF2FF] text-[#1E3A8A] font-medium'
                              : 'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]/60'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onSelectPart(part.id)}
                            className="px-2.5 py-1 text-left whitespace-nowrap"
                          >
                            {part.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleHidePart(part.id)}
                            title={hidden ? `Show ${part.name}` : `Hide ${part.name}`}
                            aria-label={hidden ? `Show ${part.name}` : `Hide ${part.name}`}
                            className="border-l border-[#E5DFD3] px-1.5 py-1 text-[#71717A] hover:text-[#18181B]"
                          >
                            {hidden ? (
                              <EyeOff className="h-3 w-3 text-[#B45309]" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Educational Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E5DFD3] bg-[#FBF9F5] px-4 py-1.5">
        {infoTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#1E3A8A] text-white'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm leading-relaxed text-[#52525B]">
        {activeTab === 'overview' && (
          <>
            <p className="text-[15px] text-[#18181B]">
              {selectedPart
                ? advancedMode
                  ? selectedPart.detailedExplanation
                  : selectedPart.functionSummary
                : advancedMode
                  ? activeOrgan.overviewDetailed
                  : activeOrgan.overviewSimple}
            </p>

            {!selectedPart && (
              <>
                <div className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-3.5 space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-[#18181B]">Location: </span>
                    {activeOrgan.locationSummary}
                  </div>
                  <div>
                    <span className="font-semibold text-[#18181B]">Medical Importance: </span>
                    {activeOrgan.medicalImportance}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {activeOrgan.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] p-3"
                    >
                      <div className="text-[11px] text-[#71717A]">{m.label}</div>
                      <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#1E3A8A]">
                        {m.value}{' '}
                        <span className="text-xs font-normal text-[#71717A]">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'anatomy' && (
          <>
            {selectedPart ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Anatomical Location
                  </h3>
                  <p className="mt-1 text-[#18181B]">{selectedPart.location}</p>
                </div>
                <div className="border-t border-[#E5DFD3] pt-4">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Structure &amp; Tissue Composition
                  </h3>
                  <p className="mt-1 text-[#18181B]">{selectedPart.structure}</p>
                </div>
                <div className="border-t border-[#E5DFD3] pt-4">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Classification Hierarchy
                  </h3>
                  <p className="mt-1 text-[#52525B]">
                    {activeOrgan.name} · {selectedPart.parentDivision} ·{' '}
                    {selectedPart.categoryLabel}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Structural Organization
                  </h3>
                  <p className="mt-1 text-[#18181B]">{activeOrgan.anatomySummary}</p>
                </div>
                <div className="border-t border-[#E5DFD3] pt-4 space-y-2">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Major Anatomical Divisions
                  </h3>
                  {divisions.map((div) => (
                    <div
                      key={div}
                      className="rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] p-3"
                    >
                      <div className="text-xs font-semibold text-[#18181B]">{div}</div>
                      <div className="mt-1 text-xs text-[#52525B]">
                        {activeOrgan.parts
                          .filter((p) => p.parentDivision === div)
                          .map((p) => p.name)
                          .join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'function' && (
          <>
            {selectedPart ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Primary Function
                  </h3>
                  <p className="mt-1 text-[#18181B]">
                    {advancedMode
                      ? selectedPart.detailedExplanation
                      : selectedPart.functionSummary}
                  </p>
                </div>

                <div className="border-t border-[#E5DFD3] pt-4">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Key Activities Controlled
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {selectedPart.activitiesControlled.map((act) => (
                      <li key={act} className="flex items-start gap-2 text-[#18181B]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3A8A]" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#E5DFD3] pt-4">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#9F1239]">
                    What Happens If Damaged
                  </h3>
                  <p className="mt-1 text-[#18181B]">{selectedPart.damageConsequences}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Physiological Role
                  </h3>
                  <p className="mt-1 text-[#18181B]">{activeOrgan.functionSummary}</p>
                </div>

                <div className="border-t border-[#E5DFD3] pt-4 space-y-2.5">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Step-by-Step Pathway
                  </h3>
                  {activeOrgan.physiologySteps.map((step) => (
                    <div
                      key={step.step}
                      className="rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] p-3.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                        <span className="font-mono tabular-nums text-[#1E3A8A]">
                          0{step.step}.
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'diseases' && (
          <div className="space-y-3">
            <div className="text-xs text-[#71717A]">
              {selectedPart
                ? `Conditions affecting ${selectedPart.name}`
                : `Related ${activeOrgan.name} conditions`}
            </div>
            {displayedDiseases.map((disease) => (
              <div
                key={disease.id}
                className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#18181B]">
                      {disease.name}
                    </h4>
                    <div className="mt-0.5 text-[11px] font-medium text-[#9F1239]">
                      {disease.affectedStructures.join(' · ')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDiseasePage(disease.id)}
                    className="shrink-0 text-xs font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap"
                  >
                    Full Note
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-[#52525B]">
                  {disease.shortExplanation}
                </p>
                <div className="text-xs text-[#52525B]">
                  <span className="font-semibold text-[#18181B]">Common Symptoms: </span>
                  {disease.symptoms.slice(0, 2).join('; ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#B45309]/30 bg-[#FEF3C7]/60 p-3 text-xs text-[#78350F] flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#B45309]" />
              <span>
                Educational Disclaimer: Summaries are for science education and do not substitute for professional clinical diagnosis or medical care.
              </span>
            </div>

            {displayedDiseases.map((disease) => (
              <div
                key={disease.id}
                className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-2"
              >
                <div className="text-xs font-semibold text-[#1E3A8A]">
                  {disease.prognosisCategory}
                </div>
                <h4 className="font-display text-base font-bold text-[#18181B]">
                  {disease.name}
                </h4>
                <p className="text-xs leading-relaxed text-[#18181B]">
                  {disease.treatmentDistinction}
                </p>
                <ul className="space-y-1 text-xs text-[#52525B]">
                  {disease.treatmentOptions.map((opt) => (
                    <li key={opt} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E3A8A]" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'facts' && (
          <div className="space-y-3">
            {(selectedPart && selectedPart.interestingFacts.length > 0
              ? [...selectedPart.interestingFacts, ...activeOrgan.interestingFacts]
              : activeOrgan.interestingFacts
            ).map((fact, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-1"
              >
                <div className="font-mono text-[11px] font-semibold tabular-nums text-[#1E3A8A]">
                  Note 0{idx + 1}
                </div>
                <p className="text-sm leading-relaxed text-[#18181B]">{fact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
