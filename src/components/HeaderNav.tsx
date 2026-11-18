import React from 'react';
import { Download, Globe } from 'lucide-react';
import type { LanguageCode, OrganId } from '../types/anatomy';
import type { UiDictionary } from '../data/translations';
import { SearchBar } from './SearchBar';

export type ActiveTab = 'explore' | 'systems' | 'lessons' | 'library' | 'notes';

interface HeaderNavProps {
  activeTab: ActiveTab;
  language: LanguageCode;
  dict: UiDictionary;
  downloadingZip: boolean;
  onChangeTab: (tab: ActiveTab) => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onDownloadZip: () => void;
  onSelectOrgan: (organId: OrganId) => void;
  onSelectStructure: (organId: OrganId, partId: string) => void;
  onSelectDisease: (diseaseId: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  language,
  dict,
  downloadingZip,
  onChangeTab,
  onChangeLanguage,
  onDownloadZip,
  onSelectOrgan,
  onSelectStructure,
  onSelectDisease,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string }> = [
    { id: 'explore', label: dict.nav.explore },
    { id: 'systems', label: dict.nav.systems },
    { id: 'lessons', label: dict.nav.lessons },
    { id: 'library', label: dict.nav.library },
    { id: 'notes', label: dict.nav.notes },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5DFD3] bg-[#FFFFFF]/96">
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => onChangeTab('explore')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#18181B] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
        >
          {dict.brand}
        </button>

        {/* Primary Single-Row Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded ${
                  isActive
                    ? 'text-[#1E3A8A] font-semibold'
                    : 'text-[#52525B] hover:text-[#18181B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[11px] h-[2px] bg-[#1E3A8A]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Search + Language Selector + Download ZIP */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:block w-60 xl:w-72">
            <SearchBar
              placeholder={dict.searchPlaceholder}
              onSelectOrgan={onSelectOrgan}
              onSelectStructure={onSelectStructure}
              onSelectDisease={onSelectDisease}
            />
          </div>

          <label className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFD3] bg-[#FBF9F5] px-2 py-1.5 text-xs text-[#52525B] hover:border-[#1E3A8A]">
            <Globe className="h-3.5 w-3.5 text-[#52525B] shrink-0" />
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-medium text-[#18181B] focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onDownloadZip}
            disabled={downloadingZip}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E3A8A] bg-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#172E6E] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {downloadingZip ? dict.packaging : dict.downloadZip}
            </span>
            <span className="sm:hidden">ZIP</span>
          </button>
        </div>
      </div>

      {/* Compact mobile/tablet search strip below header on narrow screens */}
      <div className="border-t border-[#E5DFD3] bg-[#FBF9F5] px-4 py-2 lg:hidden">
        <SearchBar
          placeholder={dict.searchPlaceholder}
          onSelectOrgan={onSelectOrgan}
          onSelectStructure={onSelectStructure}
          onSelectDisease={onSelectDisease}
        />
      </div>
    </header>
  );
};
