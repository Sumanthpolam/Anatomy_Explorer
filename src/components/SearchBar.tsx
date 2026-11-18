import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchAnatomyApi } from '../services/anatomyApi';
import type { OrganId, SearchResults } from '../types/anatomy';

interface SearchBarProps {
  placeholder?: string;
  onSelectOrgan: (organId: OrganId) => void;
  onSelectStructure: (organId: OrganId, partId: string) => void;
  onSelectDisease: (diseaseId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search organs, structures, systems, or diseases...',
  onSelectOrgan,
  onSelectStructure,
  onSelectDisease,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setOpen(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAnatomyApi(trimmed);
        setResults(data);
        setOpen(true);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const hasMatches =
    results &&
    (results.organs.length > 0 ||
      results.parts.length > 0 ||
      results.diseases.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#71717A]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results) setOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Search organs, structures, systems, or diseases"
          className="w-full rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] py-1.5 pl-8 pr-7 text-xs text-[#18181B] placeholder:text-[#71717A] focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults(null);
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-2.5 text-[#71717A] hover:text-[#18181B]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-[#E5DFD3] bg-white shadow-lg">
          {loading && (
            <div className="px-3.5 py-3 text-xs text-[#52525B]">Searching atlas index...</div>
          )}

          {!loading && !hasMatches && (
            <div className="px-3.5 py-3 text-xs text-[#52525B]">
              No matching organs, structures, systems, or clinical notes found.
            </div>
          )}

          {!loading && results && hasMatches && (
            <div className="divide-y divide-[#E5DFD3]">
              {results.organs.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#71717A]">
                    Organs & Systems
                  </div>
                  {results.organs.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        onSelectOrgan(o.id);
                        setOpen(false);
                        setQuery('');
                      }}
                      className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs hover:bg-[#F3EFE7]"
                    >
                      <span className="font-medium text-[#18181B]">{o.name}</span>
                      <span className="text-[11px] text-[#1E3A8A]">{o.system}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.parts.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#71717A]">
                    Anatomical Structures
                  </div>
                  {results.parts.slice(0, 8).map((p) => (
                    <button
                      key={`${p.organId}-${p.id}`}
                      type="button"
                      onClick={() => {
                        onSelectStructure(p.organId, p.id);
                        setOpen(false);
                        setQuery('');
                      }}
                      className="flex w-full flex-col rounded-md px-2.5 py-1.5 text-left hover:bg-[#F3EFE7]"
                    >
                      <span className="text-xs font-medium text-[#18181B]">{p.name}</span>
                      <span className="text-[11px] text-[#52525B]">
                        {p.organName} · {p.parentDivision}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.diseases.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#71717A]">
                    Clinical Conditions
                  </div>
                  {results.diseases.slice(0, 6).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        onSelectDisease(d.id);
                        setOpen(false);
                        setQuery('');
                      }}
                      className="flex w-full flex-col rounded-md px-2.5 py-1.5 text-left hover:bg-[#F3EFE7]"
                    >
                      <span className="text-xs font-medium text-[#9F1239]">{d.name}</span>
                      <span className="text-[11px] text-[#52525B]">
                        {d.organName} · {d.affectedStructures[0]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
