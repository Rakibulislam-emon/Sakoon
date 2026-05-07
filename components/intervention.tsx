"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionId, Action } from "@/lib/emotions";
import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, CheckCircle2, VolumeX } from "lucide-react";

interface VerseData {
  ayahId: string;
  arabic: string;
  translation: string;
  audioUrl: string;
  surahName: string;
  surahEnglishName: string;
  numberInSurah: number;
}

interface SessionData {
  sessionId: string;
  action: Action;
  verses: VerseData[];
  messages: {
    actionPrompt: string;
    completionPause: string;
    endMessage: string;
  };
}

interface InterventionProps {
  emotion: EmotionId;
  onReset: () => void;
}

type Phase =
  | "breathing"
  | "reading"
  | "post_reading_pause"
  | "action"
  | "completion_pause"
  | "end";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getChunks(text: string, maxChars = 140): string[] {
  if (!text) return [""];
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining);
      break;
    }
    let splitIndex = remaining.lastIndexOf(" ", maxChars);
    if (splitIndex <= 0) splitIndex = maxChars;
    chunks.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
  }

  return chunks.length ? chunks : [text];
}

function getArabicFontSize(len: number): number {
  if (len < 50)  return 7;
  if (len < 80)  return 5.5;
  if (len < 120) return 4.5;
  if (len < 180) return 3.5;
  return 2.8;
}

function getBanglaFontSize(len: number): number {
  if (len < 60)  return 3.2;
  if (len < 120) return 2.6;
  if (len < 200) return 2.2;
  return 1.8;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Intervention({ emotion, onReset }: InterventionProps) {
  const [phase, setPhase]                   = useState<Phase>("breathing");
  const [data, setData]                     = useState<SessionData | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [innerPageIndex, setInnerPageIndex] = useState(0);
  const [error, setError]                   = useState<string | null>(null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [count, setCount]                   = useState(0);
  const [audioDuration, setAudioDuration]   = useState<number>(15); // fallback 15s

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const phaseRef       = useRef<Phase>("breathing"); // track phase without stale closure
  const mountedRef     = useRef(true);

  const isRoutine = emotion === "morning" || emotion === "night";

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Create ONE persistent audio element on mount — reusing it across verses
  // preserves the browser's autoplay permission (user-activated state).
  useEffect(() => {
    mountedRef.current = true;
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      mountedRef.current = false;
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // ── Fetch session data ──
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/intervention?emotion=${emotion}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: SessionData = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.error("[Intervention] fetch failed:", err);
        if (!cancelled) setError("Could not load guidance at this moment.");
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [emotion]);

  // ── Phase 1: Breathing → next phase ──
  useEffect(() => {
    if (phase !== "breathing") return;
    const t = setTimeout(() => {
      if (mountedRef.current) {
        setInnerPageIndex(0);
        setPhase(isRoutine ? "action" : "reading");
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [phase, isRoutine]);

  // ── Phase 2: Reading — setup + autoplay audio ──
  // We REUSE the single persistent audio element (created on mount) by changing
  // its src. This preserves the browser's user-activated autoplay permission
  // across all verses — creating new Audio() objects breaks autoplay on mobile.
  useEffect(() => {
    if (phase !== "reading" || !data) return;

    const verse = data.verses[currentVerseIndex];
    if (!verse?.audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Stop current playback and clear handlers
    audio.pause();
    audio.onended           = null;
    audio.onerror           = null;
    audio.onloadedmetadata  = null;

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    audio.onended = () => {
      if (mountedRef.current) {
        setIsPlaying(false);
        setPhase("post_reading_pause");
      }
    };

    audio.onerror = () => {
      console.warn("[Intervention] audio error, skipping verse");
      if (mountedRef.current) {
        setIsPlaying(false);
        setPhase("post_reading_pause");
      }
    };

    // Swap src and reload — this is the key: same element, new source
    audio.src = verse.audioUrl;
    audio.load();

    const t = setTimeout(() => {
      if (!mountedRef.current || phaseRef.current !== "reading") return;
      audio
        .play()
        .then(() => { if (mountedRef.current) setIsPlaying(true); })
        .catch((e) => {
          console.warn("[Intervention] autoplay blocked:", e);
          // show play button — user must tap
        });
    }, 100);

    return () => { clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentVerseIndex]); // data is stable after fetch; intentional


  // ── Phase 3: Post-reading pause ──
  useEffect(() => {
    if (phase !== "post_reading_pause" || !data) return;

    const isLastVerse = currentVerseIndex === data.verses.length - 1;
    // Reduced timings: 600ms between verses, 1500ms after the last verse
    const waitTime    = isLastVerse ? 1500 : 600;

    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      if (isLastVerse) {
        setPhase(isRoutine ? "end" : "action");
      } else {
        setCurrentVerseIndex((prev) => prev + 1);
        setInnerPageIndex(0);
        setPhase("reading");
      }
    }, waitTime);

    return () => clearTimeout(t);
  }, [phase, data, currentVerseIndex, isRoutine]);

  // ── Phase 5: Completion pause ──
  useEffect(() => {
    if (phase !== "completion_pause") return;
    const t = setTimeout(() => {
      if (mountedRef.current) setPhase(isRoutine ? "reading" : "end");
    }, 5000);
    return () => clearTimeout(t);
  }, [phase, isRoutine]);

  // ── Derived (must come before effects that reference them) ──
  const currentVerse = data?.verses[currentVerseIndex];

  const verseProgress = useMemo(
    () =>
      data?.verses?.length
        ? Math.round(((currentVerseIndex + 1) / data.verses.length) * 100)
        : 0,
    [data, currentVerseIndex]
  );

  const arabicChunks = useMemo(
    () => (currentVerse ? getChunks(currentVerse.arabic, 130) : [""]),
    [currentVerse]
  );

  const translationChunks = useMemo(
    () => (currentVerse ? getChunks(currentVerse.translation, 160) : [""]),
    [currentVerse]
  );

  const totalInnerPages = Math.max(arabicChunks.length, translationChunks.length);

  const safeInnerIndex = Math.min(innerPageIndex, totalInnerPages - 1);

  const currentArabicText = arabicChunks[safeInnerIndex] ?? currentVerse?.arabic ?? "";
  const currentBanglaText = translationChunks[safeInnerIndex] ?? currentVerse?.translation ?? "";

  const arabicFontSize = getArabicFontSize(currentArabicText.length);
  const banglaFontSize = getBanglaFontSize(currentBanglaText.length);

  // ── Auto-advance inner pages based on real audio duration ──
  useEffect(() => {
    if (phase !== "reading" || !isPlaying || totalInnerPages <= 1) return;

    const safeDuration = isFinite(audioDuration) && audioDuration > 0 ? audioDuration : 15;

    const liveDuration =
      audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0
        ? audioRef.current.duration
        : safeDuration;

    const interval = setInterval(() => {
      setInnerPageIndex((prev) => (prev + 1) % totalInnerPages);
    }, (liveDuration * 1000) / totalInnerPages);

    return () => clearInterval(interval);
  }, [phase, isPlaying, totalInnerPages, currentVerseIndex, audioDuration]);

  // ── Toggle audio ──
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => { if (mountedRef.current) setIsPlaying(true); })
        .catch((e) => console.warn("[Intervention] play failed:", e));
    }
  }, [isPlaying]);

  // ── Tap counter ──
  const handleTap = useCallback(() => {
    if (!data || count >= data.action.count) return;
    const newCount = count + 1;
    setCount(newCount);

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }

    if (newCount >= data.action.count) {
      setTimeout(() => { if (mountedRef.current) setPhase("completion_pause"); }, 1000);
    }
  }, [data, count]);



  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center p-4">

      {/* Persistent Top Header */}
      <div className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-30">
        <Button
          variant="ghost"
          className="text-slate-400/60 hover:text-white transition-all px-0"
          onClick={onReset}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <button
          onClick={toggleAudio}
          className="group relative flex items-center justify-center h-12 w-12 rounded-full border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <div className="flex items-end space-x-[2px] h-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-cyan-400"
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : (
            <VolumeX size={18} className="text-slate-400/60" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Phase 1: Breathing ── */}
        {phase === "breathing" && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="flex flex-col items-center justify-center space-y-10 text-center"
          >
            <h2 className="text-3xl font-light text-slate-300 tracking-[0.3em] uppercase opacity-80">
              Focus
            </h2>
            <div className="relative flex items-center justify-center">
              <motion.div
                className="w-48 h-48 rounded-full bg-cyan-400/5 absolute border border-cyan-400/10"
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-32 h-32 rounded-full bg-cyan-400/10 absolute shadow-[0_0_60px_rgba(34,211,238,0.15)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <div className="w-16 h-16 rounded-full bg-cyan-400/40 blur-md relative z-10" />
            </div>
            <motion.p
              className="text-lg text-slate-400/70 font-light"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Inhale peace, exhale tension.
            </motion.p>
          </motion.div>
        )}

        {/* ── Phase 2 & 3: Reading & Post-Reading Pause ── */}
        {(phase === "reading" || phase === "post_reading_pause") && (
          <motion.div
            key={`reading-${currentVerseIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.8 } }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex w-full flex-col items-center space-y-10 text-center"
          >
            {error ? (
              <p className="text-destructive text-lg font-light">{error}</p>
            ) : !currentVerse ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-1 w-24 bg-cyan-500/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-slate-400/60 font-light tracking-widest text-xs uppercase">
                  Entering Tranquility...
                </p>
              </div>
            ) : (
              <div className="relative flex w-full max-w-[900px] justify-center items-center">
                {/* Outer Glowing Rings */}
                <div className="pointer-events-none absolute h-[550px] w-[550px] rounded-full border border-white/5 opacity-20 hidden md:block" />
                <div className="pointer-events-none absolute h-[680px] w-[680px] rounded-full border border-white/5 opacity-10 hidden md:block" />

                {/* Circular Container */}
                <button
                  onClick={() => {
                    if (totalInnerPages > 1 && safeInnerIndex < totalInnerPages - 1) {
                      setInnerPageIndex(safeInnerIndex + 1);
                    } else {
                      toggleAudio();
                    }
                  }}
                  className="relative aspect-square w-[min(92vw,620px)] rounded-full border border-white/10 bg-transparent shadow-[0_0_120px_rgba(30,58,138,0.2)] overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
                  aria-label="Toggle audio or advance page"
                >
                  {/* Play/Pause Overlay Hint */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {!isPlaying && phase === "reading" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/20 backdrop-blur-sm rounded-full p-6 border border-white/10"
                      >
                        <Play size={32} className="text-white ml-1" />
                      </motion.div>
                    )}
                  </div>

                  {/* Progress Arc */}
                  <div className="absolute inset-0 pointer-events-none -rotate-90">
                    <svg className="w-full h-full">
                      <circle
                        cx="50%" cy="50%" r="49.5%"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                      <motion.circle
                        cx="50%" cy="50%" r="49.5%"
                        fill="transparent"
                        stroke="url(#progressGradient)"
                        strokeWidth="2"
                        strokeDasharray="314% 314%"
                        initial={{ strokeDashoffset: "314%" }}
                        animate={{ strokeDashoffset: `${314 - 3.14 * verseProgress}%` }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Zone-based Layout */}
                  <div className="absolute inset-0 flex flex-col pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`inner-${safeInnerIndex}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col h-full"
                      >
                        {/* Zone 1: Top Meta (15%) */}
                        <div className="h-[15%] flex flex-col items-center justify-end pb-1">
                          <p className="text-[9px] font-mono tracking-[0.3em] text-cyan-200/20 uppercase">
                            {currentVerse.surahEnglishName} • {currentVerse.numberInSurah}
                          </p>
                          {totalInnerPages > 1 && (
                            <div className="flex space-x-1.5 mt-1">
                              {Array.from({ length: totalInnerPages }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-0.5 rounded-full transition-all duration-500 ${
                                    i === safeInnerIndex
                                      ? "w-4 bg-cyan-400/40"
                                      : "w-1 bg-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Zone 2: Arabic (50%) */}
                        <div className="h-[50%] flex items-center justify-center px-[15%]">
                          <p
                            className="font-arabic text-center text-[#e9d291] drop-shadow-[0_0_20px_rgba(233,210,145,0.2)] leading-[1.7]"
                            style={{
                              fontSize: `clamp(1.4rem, ${arabicFontSize}vw, 3.5rem)`,
                            }}
                          >
                            {currentArabicText}
                          </p>
                        </div>

                        {/* Zone 3: Translation (35%) */}
                        <div className="h-[35%] flex items-start justify-center px-[18%]">
                          <p
                            className="font-light text-center text-slate-200/80 leading-relaxed"
                            style={{
                              fontSize: `clamp(0.75rem, ${banglaFontSize}vw, 1.3rem)`,
                            }}
                          >
                            {currentBanglaText}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Phase 4: Guided Action ── */}
        {phase === "action" && data && (
          <motion.div
            key="action"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8 } }}
            className="w-full flex flex-col items-center text-center space-y-12"
          >
            <div className="space-y-6">
              <p className="text-sm text-cyan-400 font-bold tracking-[0.3em] uppercase opacity-80">
                {data.messages.actionPrompt}
              </p>
              <h3 className="text-5xl md:text-7xl font-arabic leading-relaxed text-[#e9d291] drop-shadow-[0_0_20px_rgba(233,210,145,0.2)]">
                {data.action.arabic}
              </h3>
              <p className="text-xl md:text-3xl text-slate-300 font-light max-w-2xl mx-auto italic opacity-90">
                {data.action.bangla}
              </p>
              <p className="text-sm text-slate-500 max-w-md mx-auto pt-4 tracking-wide font-light">
                &quot;{data.action.meaning}&quot;
              </p>
            </div>

            <div className="pt-8 flex flex-col items-center space-y-8">
              <button
                onClick={handleTap}
                disabled={count >= data.action.count}
                className={`w-48 h-48 rounded-full border border-white/10 transition-all duration-700 flex items-center justify-center relative overflow-hidden backdrop-blur-xl ${
                  count >= data.action.count
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/5 hover:bg-white/10 active:scale-95 cursor-pointer text-white shadow-[0_0_80px_rgba(255,255,255,0.05)]"
                }`}
                aria-label={`Count: ${count} of ${data.action.count}`}
              >
                <div className="flex flex-col items-center z-10">
                  <span className="text-6xl font-light mb-1">{count}</span>
                  <span className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase">
                    Goal: {data.action.count}
                  </span>
                </div>

                {/* Dynamic Progress Fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-cyan-400/20"
                  initial={{ height: "0%" }}
                  animate={{ height: `${(count / data.action.count) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
              </button>

              <p className="text-xs text-slate-400 tracking-widest uppercase opacity-40">
                Tap the circle to count
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Phase 5: Micro-stillness ── */}
        {phase === "completion_pause" && (
          <motion.div
            key="completion_pause"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-12"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                className="w-56 h-56 rounded-full border border-cyan-400/20 absolute"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <CheckCircle2 className="w-20 h-20 text-cyan-400/60 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
              </motion.div>
            </div>
            <p className="text-2xl md:text-3xl font-light tracking-wide text-slate-200 text-center max-w-lg leading-relaxed">
              {data?.messages?.completionPause}
            </p>
          </motion.div>
        )}

        {/* ── Phase 6: End State ── */}
        {phase === "end" && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-16 text-center"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl mx-auto">
                {data?.messages?.endMessage}
              </h2>
              <div className="h-0.5 w-12 bg-cyan-500/40 mx-auto rounded-full" />
            </div>

            <Button
              onClick={onReset}
              size="lg"
              className="px-12 h-14 rounded-full bg-white text-slate-900 hover:bg-slate-200 transition-all font-bold tracking-widest uppercase text-xs"
            >
              Return to Peace
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}