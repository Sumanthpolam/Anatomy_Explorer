import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { HeaderNav, type ActiveTab } from './components/HeaderNav';
import { AnatomyViewport } from './components/AnatomyViewport';
import { ViewportDock } from './components/ViewportDock';
import { InfoPanel } from './components/InfoPanel';
import { ExploreSections } from './components/ExploreSections';
import { OrgansCatalog } from './components/OrgansCatalog';
import { DiseaseSystem } from './components/DiseaseSystem';
import { QuizModule } from './components/QuizModule';
import { TRANSLATIONS } from './data/translations';
import {
  fetchDiseases,
  fetchOrgans,
  fetchQuizzes,
} from './services/anatomyApi';
import type {
  DiseaseRecord,
  LanguageCode,
  OrganData,
  OrganId,
  QuizQuestion,
} from './types/anatomy';
import type {
  CameraAnglePreset,
  SceneViewMode,
} from './three/anatomyPartTypes';

const DEEP_STRUCTURE_IDS = new Set([
  'endocardium',
  'septum',
  'tricuspid-valve',
  'mitral-valve',
  'pulmonary-valve',
  'aortic-valve',
  'thalamus',
  'hypothalamus',
  'hippocampus',
  'amygdala',
  'bronchioles',
  'alveoli',
  'renal-pyramids',
  'renal-papillae',
  'calyces',
  'renal-pelvis',
  'crystalline-lens',
  'retina',
  'pancreatic-duct',
  'islets-of-langerhans',
]);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [organs, setOrgans] = useState<OrganData[]>([]);
  const [diseases, setDiseases] = useState<DiseaseRecord[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Defaults to 'body' so users immediately see the Full Human Body anatomical image and can click Heart or any organ
  const [viewMode, setViewMode] = useState<SceneViewMode>('body');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [exploded, setExploded] = useState(false);
  const [cutaway, setCutaway] = useState(false);
  const [isolated, setIsolated] = useState(false);
  const [animatePhysiology, setAnimatePhysiology] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [hiddenPartIds, setHiddenPartIds] = useState<string[]>([]);
  const [cameraResetSignal, setCameraResetSignal] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<{
    angle: CameraAnglePreset;
    seq: number;
  } | null>(null);
  const [zoomSignal, setZoomSignal] = useState<{
    dir: 'in' | 'out';
    seq: number;
  } | null>(null);

  const [focusedDiseaseId, setFocusedDiseaseId] = useState<string | null>(null);
  const [lessonOrganTarget, setLessonOrganTarget] = useState<OrganId | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const dict = TRANSLATIONS[language];

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [organsRes, diseasesRes, quizzesRes] = await Promise.all([
        fetchOrgans(),
        fetchDiseases(),
        fetchQuizzes(),
      ]);
      setOrgans(organsRes);
      setDiseases(diseasesRes);
      setQuizzes(quizzesRes);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : 'Unable to load educational anatomy data from backend.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h' && activeTab === 'explore') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTab]);

  const activeOrgan = useMemo(
    () =>
      viewMode === 'body'
        ? null
        : organs.find((o) => o.id === viewMode) ?? null,
    [organs, viewMode],
  );

  const selectedPart = useMemo(() => {
    if (!activeOrgan || !selectedPartId) return null;
    return activeOrgan.parts.find((p) => p.id === selectedPartId) ?? null;
  }, [activeOrgan, selectedPartId]);

  const organDiseases = useMemo(() => {
    if (!activeOrgan) return [];
    return diseases.filter((d) => d.organId === activeOrgan.id);
  }, [diseases, activeOrgan]);

  const handleEnterOrgan = useCallback(
    (organId: OrganId, partId?: string) => {
      setActiveTab('explore');
      setViewMode(organId);
      setSelectedPartId(partId ?? null);
      setExploded(false);
      setIsolated(false);
      setHiddenPartIds([]);
      setCameraPreset(null);
      setCutaway(
        organId === 'kidneys' || (partId ? DEEP_STRUCTURE_IDS.has(partId) : false),
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  const handleBackToBody = useCallback(() => {
    setViewMode('body');
    setSelectedPartId(null);
    setExploded(false);
    setCutaway(false);
    setIsolated(false);
    setHiddenPartIds([]);
    setCameraPreset(null);
  }, []);

  const handleSelectMode = useCallback(
    (mode: SceneViewMode) => {
      if (mode === 'body') {
        handleBackToBody();
      } else {
        handleEnterOrgan(mode);
      }
    },
    [handleBackToBody, handleEnterOrgan],
  );

  const handleSelectPart = useCallback((partId: string | null) => {
    setSelectedPartId(partId);
    if (!partId) {
      setIsolated(false);
    } else if (DEEP_STRUCTURE_IDS.has(partId)) {
      setCutaway(true);
    }
  }, []);

  const handleToggleHidePart = useCallback((partId: string) => {
    setHiddenPartIds((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId],
    );
  }, []);

  const handleOpenDisease = useCallback((diseaseId: string) => {
    setFocusedDiseaseId(diseaseId);
    setActiveTab('notes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewLesson = useCallback((organId: OrganId) => {
    setLessonOrganTarget(organId);
    setActiveTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleJumpCompare = useCallback(() => {
    const el = document.getElementById('compare-organs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  
const handleDownloadZip = useCallback(() => {
  if (downloadingZip) return;

  setDownloadingZip(true);

  const link = document.createElement('a');

  link.href =
    'https://github.com/Sumanthpolam/Anatomy_Explorer/archive/refs/heads/main.zip';

  link.download = 'human-anatomy-explorer.zip';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    setDownloadingZip(false);
  }, 1000);
}, [downloadingZip]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#18181B]">
      <HeaderNav
        activeTab={activeTab}
        language={language}
        dict={dict}
        downloadingZip={downloadingZip}
        onChangeTab={setActiveTab}
        onChangeLanguage={setLanguage}
        onDownloadZip={handleDownloadZip}
        onSelectOrgan={(id) => handleEnterOrgan(id)}
        onSelectStructure={(organId, partId) => handleEnterOrgan(organId, partId)}
        onSelectDisease={handleOpenDisease}
      />

      {apiError && (
        <div className="border-b border-[#9F1239]/30 bg-[#FFE4E6] px-4 py-2.5 text-xs text-[#881337] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#9F1239] shrink-0" />
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={loadAllData}
            className="rounded border border-[#9F1239]/40 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#FFF1F2]"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-sm text-[#52525B]">
            <div className="h-7 w-7 rounded-full border-2 border-[#1E3A8A] border-t-transparent animate-spin" />
            <span>Loading Human Anatomy Explorer atlas...</span>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col">
          {activeTab === 'explore' && (
            <>
              {/* Hero 3D Specimen Workbench + Right Educational Panel */}
              <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-56px)] lg:min-h-[580px] border-b border-[#E5DFD3]">
                <section className="relative flex-1 min-h-[480px] lg:min-h-0 lg:w-[62%]">
                  {/* Top Specimen Breadcrumb + Quick Back to Body */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-3.5">
                    <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-lg border border-[#E5DFD3] bg-[#FFFFFF]/95 px-3 py-1.5 text-xs shadow-xs">
                      {viewMode !== 'body' && (
                        <button
                          type="button"
                          onClick={handleBackToBody}
                          className="inline-flex items-center gap-1 font-semibold text-[#1E3A8A] hover:underline mr-1"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>{dict.backToBody}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleBackToBody}
                        className={`hover:text-[#18181B] ${
                          viewMode === 'body' ? 'font-semibold text-[#1E3A8A]' : 'text-[#71717A]'
                        }`}
                      >
                        Atlas
                      </button>
                      {activeOrgan && (
                        <>
                          <ChevronRight className="h-3.5 w-3.5 text-[#A1A1AA]" />
                          <button
                            type="button"
                            onClick={() => handleSelectPart(null)}
                            className={`hover:text-[#18181B] ${
                              !selectedPart ? 'font-semibold text-[#1E3A8A]' : 'text-[#52525B]'
                            }`}
                          >
                            {activeOrgan.name}
                          </button>
                        </>
                      )}
                      {selectedPart && (
                        <>
                          <ChevronRight className="h-3.5 w-3.5 text-[#A1A1AA]" />
                          <span className="font-semibold text-[#9F1239]">
                            {selectedPart.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <AnatomyViewport
                    viewMode={viewMode}
                    selectedPartId={selectedPartId}
                    exploded={exploded}
                    cutaway={cutaway}
                    isolated={isolated}
                    animatePhysiology={animatePhysiology}
                    autoRotate={autoRotate}
                    showLabels={showLabels}
                    hiddenPartIds={hiddenPartIds}
                    cameraResetSignal={cameraResetSignal}
                    cameraPreset={cameraPreset}
                    zoomSignal={zoomSignal}
                    hints={dict.hints}
                    organs={organs}
                    onSelectOrgan={(id) => handleEnterOrgan(id)}
                    onSelectPart={(pid) => handleSelectPart(pid)}
                  />

                  <ViewportDock
                    viewMode={viewMode}
                    selectedPartId={selectedPartId}
                    exploded={exploded}
                    cutaway={cutaway}
                    isolated={isolated}
                    animatePhysiology={animatePhysiology}
                    autoRotate={autoRotate}
                    showLabels={showLabels}
                    collapsed={dockCollapsed}
                    dict={dict}
                    onToggleCollapse={() => setDockCollapsed((c) => !c)}
                    onSelectMode={handleSelectMode}
                    onToggleExploded={() => setExploded((e) => !e)}
                    onToggleCutaway={() => setCutaway((c) => !c)}
                    onToggleIsolated={() => setIsolated((i) => !i)}
                    onToggleAnimatePhysiology={() =>
                      setAnimatePhysiology((a) => !a)
                    }
                    onToggleAutoRotate={() => setAutoRotate((r) => !r)}
                    onToggleLabels={() => setShowLabels((l) => !l)}
                    onResetCamera={() => {
                      setCameraPreset(null);
                      setCameraResetSignal((s) => s + 1);
                    }}
                    onZoom={(dir) =>
                      setZoomSignal((prev) => ({
                        dir,
                        seq: (prev?.seq ?? 0) + 1,
                      }))
                    }
                    onCameraPreset={(angle) =>
                      setCameraPreset((prev) => ({
                        angle,
                        seq: (prev?.seq ?? 0) + 1,
                      }))
                    }
                    onJumpCompare={activeOrgan ? handleJumpCompare : undefined}
                  />
                </section>

                <div className="lg:w-[38%] lg:h-full overflow-hidden">
                  <InfoPanel
                    activeOrgan={activeOrgan}
                    allOrgans={organs}
                    selectedPart={selectedPart}
                    organDiseases={organDiseases}
                    hiddenPartIds={hiddenPartIds}
                    dict={dict}
                    onSelectOrgan={(id) => handleEnterOrgan(id)}
                    onSelectPart={handleSelectPart}
                    onToggleHidePart={handleToggleHidePart}
                    onOpenDiseasePage={handleOpenDisease}
                    onViewLesson={handleViewLesson}
                  />
                </div>
              </div>

              {/* Below-Viewer Learning Sections (Diagram, Microscopic View, Compare, Function, Clinical Notes, Related Systems) */}
              {activeOrgan && (
                <ExploreSections
                  activeOrgan={activeOrgan}
                  allOrgans={organs}
                  selectedPartId={selectedPartId}
                  organDiseases={organDiseases}
                  animatePhysiology={animatePhysiology}
                  enlargeLabel={dict.enlargeDiagram}
                  onSelectPart={(pid) => handleSelectPart(pid)}
                  onSelectOrgan={(id) => handleEnterOrgan(id)}
                  onToggleAnimatePhysiology={() =>
                    setAnimatePhysiology((a) => !a)
                  }
                  onOpenDiseasePage={handleOpenDisease}
                />
              )}
            </>
          )}

          {(activeTab === 'library' || activeTab === 'systems') && (
            <OrgansCatalog
              organs={organs}
              mode={activeTab}
              onExploreOrgan={(organId, partId) =>
                handleEnterOrgan(organId, partId)
              }
              onViewLesson={handleViewLesson}
            />
          )}

          {activeTab === 'notes' && (
            <DiseaseSystem
              diseases={diseases}
              initialDiseaseId={focusedDiseaseId}
              onInspectOrgan={(organId) => handleEnterOrgan(organId)}
            />
          )}

          {activeTab === 'lessons' && (
            <QuizModule
              questions={quizzes}
              organs={organs}
              initialOrganId={lessonOrganTarget}
              onInspectOrgan={(organId, partId) =>
                handleEnterOrgan(organId, partId)
              }
            />
          )}
        </main>
      )}
    </div>
  );
}
