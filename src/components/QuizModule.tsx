import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import type { OrganData, OrganId, QuizQuestion } from '../types/anatomy';

interface QuizModuleProps {
  questions: QuizQuestion[];
  organs: OrganData[];
  initialOrganId?: OrganId | null;
  onInspectOrgan: (organId: OrganId, partId?: string) => void;
}

const QUIZ_CATEGORIES = [
  'All',
  'Organ Identification',
  'Anatomy',
  'Disease Awareness',
] as const;

export const QuizModule: React.FC<QuizModuleProps> = ({
  questions,
  organs,
  initialOrganId,
  onInspectOrgan,
}) => {
  const [subMode, setSubMode] = useState<'lessons' | 'quiz'>('lessons');
  const [lessonOrganId, setLessonOrganId] = useState<OrganId>(
    initialOrganId || organs[0]?.id || 'heart',
  );

  // Quiz state
  const [category, setCategory] = useState<(typeof QUIZ_CATEGORIES)[number]>('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; correct: boolean; chosen: number }>
  >([]);
  const [finished, setFinished] = useState(false);

  const activeLesson =
    organs.find((o) => o.id === lessonOrganId) ?? organs[0] ?? null;

  const activeQuestions = useMemo(() => {
    if (category === 'All') return questions;
    return questions.filter((q) => q.category === category);
  }, [questions, category]);

  const currentQ = activeQuestions[currentIdx] ?? null;

  const handleCategoryChange = (nextCat: (typeof QUIZ_CATEGORIES)[number]) => {
    setCategory(nextCat);
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setFinished(false);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null || !currentQ) return;
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentQ.correctIndex;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, correct: isCorrect, chosen: optionIdx },
    ]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= activeQuestions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setFinished(false);
  };

  const score = answers.filter((a) => a.correct).length;
  const pct =
    activeQuestions.length > 0
      ? Math.round((score / activeQuestions.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1080px] px-4 sm:px-6 py-8 space-y-6">
      {/* Header + Submode Switcher (Guided Mini-Lessons vs Interactive Quiz) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E5DFD3] pb-6">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
            Structured Curriculum &amp; Assessment
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
            Guided Organ Lessons &amp; Quiz
          </h1>
          <p className="text-sm text-[#52525B]">
            Walk through step-by-step physiological lessons for any organ, then test your knowledge with instant explanations.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white p-1 self-start">
          <button
            type="button"
            onClick={() => setSubMode('lessons')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subMode === 'lessons'
                ? 'bg-[#1E3A8A] text-white'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Guided Lessons</span>
          </button>
          <button
            type="button"
            onClick={() => setSubMode('quiz')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              subMode === 'quiz'
                ? 'bg-[#1E3A8A] text-white'
                : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Quiz ({questions.length})</span>
          </button>
        </div>
      </div>

      {/* GUIDED MINI-LESSONS */}
      {subMode === 'lessons' && activeLesson && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-1.5">
            {organs.map((o) => {
              const isSel = o.id === activeLesson.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setLessonOrganId(o.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                    isSel
                      ? 'border-[#1E3A8A] bg-[#EEF2FF]/70'
                      : 'border-[#E5DFD3] bg-white hover:border-[#1E3A8A]/60'
                  }`}
                >
                  <div className="text-[11px] font-medium text-[#71717A]">{o.system}</div>
                  <div className="font-display text-base font-bold text-[#18181B]">
                    {o.name}
                  </div>
                  <div className="text-xs italic text-[#52525B]">{o.poeticSubtitle}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 rounded-2xl border border-[#E5DFD3] bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5DFD3] pb-5">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#1E3A8A]">
                  {activeLesson.system} · {activeLesson.poeticSubtitle}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
                  Lesson: {activeLesson.name}
                </h2>
                <p className="text-xs font-mono text-[#71717A]">
                  {activeLesson.weightOrSize}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onInspectOrgan(activeLesson.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#172E6E] transition-colors whitespace-nowrap"
              >
                <span>Open in 3D Explorer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                1. Core Concept
              </h3>
              <p className="text-sm leading-relaxed text-[#18181B]">
                {activeLesson.overviewDetailed}
              </p>
            </div>

            <div className="space-y-3 border-t border-[#E5DFD3] pt-5">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                2. Physiological Sequence
              </h3>
              <div className="space-y-2.5">
                {activeLesson.physiologySteps.map((st) => (
                  <div
                    key={st.step}
                    className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
                      <span className="font-mono tabular-nums text-[#1E3A8A]">
                        Step 0{st.step}
                      </span>
                      <span>· {st.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#52525B]">{st.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-[#E5DFD3] pt-5">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                3. Essential Structures to Inspect in 3D
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeLesson.parts.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onInspectOrgan(activeLesson.id, p.id)}
                    className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-3 text-left hover:border-[#1E3A8A] transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#18181B]">{p.name}</div>
                    <div className="mt-0.5 text-[11px] text-[#52525B] line-clamp-2">
                      {p.functionSummary}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE QUIZ */}
      {subMode === 'quiz' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E5DFD3] bg-white p-1 self-start w-fit">
            {QUIZ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === cat
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#52525B] hover:text-[#18181B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {!finished && currentQ && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="font-semibold text-[#1E3A8A]">{currentQ.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentQ.difficulty}</span>
                </div>
                <div className="font-mono text-xs tabular-nums text-[#52525B]">
                  Question {currentIdx + 1} / {activeQuestions.length} · Score {score}
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F3EFE7]">
                <div
                  className="h-full bg-[#1E3A8A] transition-all duration-300"
                  style={{
                    width: `${((currentIdx + (selectedOption !== null ? 1 : 0)) / activeQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug text-[#18181B]">
                {currentQ.question}
              </h2>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const answered = selectedOption !== null;
                  const isChosen = selectedOption === idx;
                  const isCorrectChoice = idx === currentQ.correctIndex;

                  let styleClass =
                    'border-[#E5DFD3] bg-[#FBF9F5] text-[#18181B] hover:border-[#1E3A8A]';
                  if (answered) {
                    if (isCorrectChoice) {
                      styleClass =
                        'border-[#15803D] bg-[#DCFCE7] text-[#14532D]';
                    } else if (isChosen && !isCorrectChoice) {
                      styleClass =
                        'border-[#9F1239] bg-[#FFE4E6] text-[#881337]';
                    } else {
                      styleClass = 'border-[#E5DFD3] bg-[#FBF9F5]/60 text-[#71717A]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${styleClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-semibold tabular-nums text-[#71717A] mt-0.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                      {answered && isCorrectChoice && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
                      )}
                      {answered && isChosen && !isCorrectChoice && (
                        <XCircle className="h-4 w-4 shrink-0 text-[#9F1239]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div
                      className={`text-xs font-semibold ${
                        selectedOption === currentQ.correctIndex
                          ? 'text-[#15803D]'
                          : 'text-[#B45309]'
                      }`}
                    >
                      {selectedOption === currentQ.correctIndex
                        ? 'Correct Answer'
                        : 'Review Explanation'}
                    </div>
                    <p className="text-xs leading-relaxed text-[#52525B]">
                      {currentQ.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E] transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>
                      {currentIdx + 1 >= activeQuestions.length
                        ? 'View Results'
                        : 'Next Question'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {finished && (
            <div className="rounded-2xl border border-[#E5DFD3] bg-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD3] pb-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
                    Assessment Completed
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#18181B]">
                    Final Score:{' '}
                    <span className="font-mono tabular-nums text-[#1E3A8A]">
                      {score}/{activeQuestions.length} ({pct}%)
                    </span>
                  </h2>
                  <p className="text-sm text-[#52525B]">
                    {pct >= 80
                      ? 'Strong command of human organ anatomy and clinical physiology.'
                      : pct >= 50
                        ? 'Solid foundation—revisit the 3D Explorer panels and diagrams to reinforce structure functions.'
                        : 'Keep exploring! Inspect each organ layer and reference plate before retrying.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#172E6E] transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restart Quiz</span>
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-sm font-semibold text-[#18181B]">
                  Question Review
                </h3>
                {activeQuestions.map((q, idx) => {
                  const ans = answers.find((a) => a.questionId === q.id);
                  const ok = ans?.correct;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-[#E5DFD3] bg-[#FBF9F5] p-4 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-medium text-[#18181B]">
                          <span className="font-mono tabular-nums text-[#71717A] mr-2">
                            {idx + 1}.
                          </span>
                          {q.question}
                        </div>
                        {ok ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9F1239] shrink-0">
                            <XCircle className="h-3.5 w-3.5" /> Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#52525B]">
                        Answer: <span className="font-semibold text-[#18181B]">{q.options[q.correctIndex]}</span> — {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
