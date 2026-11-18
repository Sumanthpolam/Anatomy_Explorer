import React, { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { OrganCategory, OrganData, OrganId } from '../types/anatomy';

interface OrgansCatalogProps {
  organs: OrganData[];
  mode: 'library' | 'systems';
  onExploreOrgan: (organId: OrganId, partId?: string) => void;
  onViewLesson: (organId: OrganId) => void;
}

const CATEGORIES: Array<{ id: 'all' | OrganCategory; label: string }> = [
  { id: 'all', label: 'All Organs' },
  { id: 'cardiovascular', label: 'Cardiovascular' },
  { id: 'nervous', label: 'Nervous' },
  { id: 'respiratory', label: 'Respiratory' },
  { id: 'digestive', label: 'Digestive' },
  { id: 'renal', label: 'Renal' },
  { id: 'sensory', label: 'Sensory' },
  { id: 'endocrine', label: 'Endocrine' },
  { id: 'integumentary', label: 'Integumentary' },
];

const SYSTEM_GROUPS: Array<{
  title: string;
  description: string;
  organIds: OrganId[];
}> = [
  {
    title: 'Cardiovascular & Respiratory Systems',
    description: 'Continuous oxygen uptake, alveolar gas exchange, and pressurized blood distribution.',
    organIds: ['heart', 'lungs'],
  },
  {
    title: 'Nervous & Sensory Systems',
    description: 'Neural command networks, memory consolidation, and optical phototransduction.',
    organIds: ['brain', 'eye'],
  },
  {
    title: 'Digestive & Endocrine Systems',
    description: 'Macronutrient digestion, portal detoxification, bile storage, and glycemic hormone control.',
    organIds: ['liver', 'intestines', 'pancreas'],
  },
  {
    title: 'Renal & Integumentary Systems',
    description: 'Blood plasma filtration, fluid homeostasis, and barrier thermoregulation.',
    organIds: ['kidneys', 'skin'],
  },
];

export const OrgansCatalog: React.FC<OrgansCatalogProps> = ({
  organs,
  mode,
  onExploreOrgan,
  onViewLesson,
}) => {
  const [category, setCategory] = useState<'all' | OrganCategory>('all');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const filtered =
    category === 'all'
      ? organs
      : organs.filter((o) => o.category === category);

  const getThumbBg = (id: OrganId) => {
    if (id === 'lungs') return 'bg-[#0B1221]';
    if (id === 'intestines') return 'bg-[#12151B]';
    if (id === 'skin') return 'bg-[#B5CCD4]';
    return 'bg-white';
  };

  const renderOrganCard = (organ: OrganData) => (
    <article
      key={organ.id}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#E5DFD3] bg-white transition-colors hover:border-[#1E3A8A]/60"
    >
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden border-b border-[#E5DFD3] ${getThumbBg(organ.id)} flex items-center justify-center`}
      >
        {!imgErrors[organ.id] ? (
          <img
            src={organ.illustrationUrl}
            alt={organ.illustrationCaption}
            referrerPolicy="no-referrer"
            onError={() =>
              setImgErrors((prev) => ({ ...prev, [organ.id]: true }))
            }
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center px-6 text-center space-y-1.5">
            <span className="font-display text-2xl font-bold text-[#18181B]">
              {organ.name.replace('Human ', '')}
            </span>
            <span className="text-xs italic text-[#52525B]">
              “{organ.poeticSubtitle}”
            </span>
            <span className="font-mono text-[11px] text-[#1E3A8A]">
              Interactive Specimen · {organ.parts.length} parts
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <span className="font-medium text-[#1E3A8A]">{organ.system}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {organ.parts.length} structures
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-bold text-[#18181B]">
              {organ.name}
            </h2>
            <span className="text-xs italic text-[#71717A] shrink-0">
              {organ.poeticSubtitle}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#52525B]">
            {organ.overviewSimple}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#71717A]">
            Key Structures
          </div>
          <div className="flex flex-wrap gap-1.5">
            {organ.parts.slice(0, 5).map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => onExploreOrgan(organ.id, part.id)}
                className="rounded-md border border-[#E5DFD3] bg-[#FBF9F5] px-2.5 py-1 text-xs text-[#18181B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap"
              >
                {part.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-[#E5DFD3] flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs tabular-nums text-[#71717A]">
            {organ.metrics[0]?.label}: {organ.metrics[0]?.value} {organ.metrics[0]?.unit}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewLesson(organ.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] px-3 py-2 text-xs font-semibold text-[#18181B] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors whitespace-nowrap"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Lesson</span>
            </button>
            <button
              type="button"
              onClick={() => onExploreOrgan(organ.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#172E6E] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore 3D</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-[#E5DFD3] pb-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            {mode === 'systems' ? 'Physiological Body Systems' : 'Specimen Library · 9 Organs'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] [text-wrap:balance]">
            {mode === 'systems'
              ? 'Interconnected Human Body Systems'
              : 'Interactive 3D Organ Library'}
          </h1>
          <p className="text-sm leading-relaxed text-[#52525B]">
            {mode === 'systems'
              ? 'Study how major organs cooperate across cardiovascular, nervous, respiratory, digestive, renal, sensory, endocrine, and integumentary networks.'
              : 'Select any of the nine anatomical specimens below to inspect its 3D cross-sections, layers, labelled diagrams, and guided lessons.'}
          </p>
        </div>

        {mode === 'library' && (
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white p-1.5 self-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === cat.id
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#52525B] hover:text-[#18181B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === 'systems' ? (
        <div className="space-y-10">
          {SYSTEM_GROUPS.map((grp) => {
            const grpOrgans = organs.filter((o) => grp.organIds.includes(o.id));
            return (
              <section key={grp.title} className="space-y-4">
                <div className="border-b border-[#E5DFD3] pb-2">
                  <h2 className="font-display text-2xl font-bold text-[#18181B]">
                    {grp.title}
                  </h2>
                  <p className="text-sm text-[#52525B]">{grp.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grpOrgans.map(renderOrganCard)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(renderOrganCard)}
        </div>
      )}
    </div>
  );
};
