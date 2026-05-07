"use client";

import { use } from "react";
import { EmotionId } from "@/lib/emotions";
import { Intervention } from "@/components/intervention";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function InterventionPage({ params }: { params: Promise<{ emotion: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const emotion = unwrappedParams.emotion as EmotionId;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/backgrounds/intervention.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(4,14,33,0.4),rgba(2,6,18,0.95))]" />
      
      {/* Subtle Animated Particles/Stars effect could be added here */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      <motion.div
        key="intervention"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex w-full justify-center"
      >
        <Intervention
          emotion={emotion}
          onReset={() => router.push("/")}
        />
      </motion.div>
    </main>
  );
}
