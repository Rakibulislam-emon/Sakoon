"use client";

import { emotionsList, routinesList } from "@/lib/emotions";
import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Moon,
  Sun,
  UserCircle2,
  Sparkles,
  Wind,
  CloudRain,
  Brain,
  RotateCcw,
  Circle,
  Flame,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Icon mapping for emotions
const iconMap: Record<string, LucideIcon> = {
  anxiety: Wind,
  sadness: CloudRain,
  overthinking: Brain,
  guilt: RotateCcw,
  emptiness: Circle,
  stress: Activity,
  anger: Flame,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] as const },
  },
};

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#02040a] text-slate-200">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/home-bg.png"
          alt="Peaceful Landscape"
          fill
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-[#02040a]" />
      </div>

      {/* Floating Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12"
      >
        <div className="flex items-center gap-4">
          <span className="font-arabic text-3xl text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] leading-none select-none">
            س
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-light tracking-[0.3em] uppercase text-white/90">
              Sakoon
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-cyan-400/40 font-medium">
              Shifa for the Qalb
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all overflow-hidden"
            aria-label="Profile"
          >
            <UserCircle2 size={22} strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8 md:px-12 lg:pt-16"
      >
        {/* Hero Section */}
        <motion.section
          variants={itemVariants}
          className="mb-16 text-center md:mb-24"
        >
          <p className="font-arabic text-xl md:text-2xl text-cyan-200/30 mb-4 tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight text-white mb-4 leading-tight">
            Find your{" "}
            <span className="italic font-light text-cyan-100/90">Sakinah.</span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8 bg-cyan-500/20" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-cyan-400/40 font-medium italic">
              The tranquility that descends upon the heart
            </span>
            <div className="h-px w-8 bg-cyan-500/20" />
          </motion.div>
          <p className="text-base md:text-lg text-slate-400/80 max-w-xl mx-auto font-light leading-relaxed px-4">
            Silence the noise of the Dunya. Reconnect your Qalb with its Creator
            through the healing words of the Quran.
          </p>
        </motion.section>

        {/* Daily Amal Section */}
        <section className="mb-20 md:mb-28">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-slate-500 font-bold whitespace-nowrap">
              Prophetic Routines
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {routinesList.map((routine) => (
              <motion.button
                key={routine.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/intervention/${routine.id}`)}
                className="group relative h-56 md:h-64 overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 md:p-8 text-left transition-all backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                      {routine.id === "morning" ? (
                        <Sun size={26} strokeWidth={1.2} />
                      ) : (
                        <Moon size={26} strokeWidth={1.2} />
                      )}
                    </div>
                    <Sparkles
                      className="text-white/10 group-hover:text-cyan-400/30 transition-colors"
                      size={20}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-light text-white mb-2">
                      {routine.label}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 font-light max-w-[280px] leading-relaxed">
                      {routine.id === "morning"
                        ? "Sunnah Adhkar to shield your Qalb and invite Barakah into your day."
                        : "Surrender your heart to Al-Wakeel with Surah Al-Mulk and evening remembrance."}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* First Aid Section */}
        <section>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-slate-500 font-bold whitespace-nowrap">
              Shifa for the Heart
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>

          {/* Adaptive Grid for First Aid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {emotionsList.map((emotion) => {
              const EmotionIcon = iconMap[emotion.id] || Sparkles;
              return (
                <motion.button
                  key={emotion.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/intervention/${emotion.id}`)}
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] group"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                    <EmotionIcon size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-medium">
                      My Nafs feels
                    </span>
                    <span className="text-sm tracking-widest uppercase font-semibold text-slate-200">
                      {emotion.label.split("/")[0].trim()}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      </motion.div>

      {/* Subtle Bottom Ambient Glow */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[30vh] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </main>
  );
}
