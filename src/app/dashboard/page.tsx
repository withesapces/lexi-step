"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import GameModeSlider, { GameMode } from "../components/GameModeSlider";
import CommunityStats from "../components/CommunityStats";

export default function GameModePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);

  // Game modes data
  const gameModes: GameMode[] = [
    {
      id: "free-writing",
      title: "MODE ZEN",
      description: "Libère ton cerveau et booste ta créativité sans limites!",
      bgColor: "bg-yellow-300",
      redirectUrl: "/dashboard/game/free-writing",
      emoji: "✨",
      prompts: ["Écris sans t'arrêter pendant 5 minutes", "Laisse couler tes pensées..."]
    },
    {
      id: "journal-intime",
      title: "JOURNAL INTIME",
      description: "Écris tes émotions et réduis ton stress de 42% en 21 jours!",
      bgColor: "bg-pink-400",
      redirectUrl: "/dashboard/game/journal-intime",
      emoji: "📓",
      prompts: ["Comment te sens-tu aujourd'hui?", "Qu'est-ce qui t'a marqué cette semaine?"],
      isUnderConstruction: true
    },
    {
      id: "prompt-writing",
      title: "PROMPTS QUOTIDIENS",
      description: "Réponds à nos défis pour décupler ta capacité cognitive!",
      bgColor: "bg-blue-400",
      redirectUrl: "/dashboard/game/prompt-writing",
      emoji: "🧠",
      prompts: ["Si tu pouvais voyager dans le temps...", "Imagine une technologie du futur..."],
      isUnderConstruction: true
    },    
    {
      id: "beat-the-clock",
      title: "BEAT THE CLOCK",
      description: "Affronte le chrono et prouve ta rapidité dans ce défi d'écriture ultra-rapide !",
      bgColor: "bg-red-500",
      redirectUrl: "/dashboard/game/beat-the-clock",
      emoji: "⚡️",
      prompts: ["Écris 300 mots en 10 minutes ou le monde explose!"],
      isUnderConstruction: true
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // After mounting, initialize state and handle responsive behavior
  useEffect(() => {
    setMounted(true);

    // Fetch user statistics from the API
    const fetchUserStats = async () => {
      setIsStatsLoading(true);
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStreakDays(data.currentStreak || 0);
          setDailyGoal(data.dailyGoal || 200);
        } else {
          console.error("Erreur lors de la récupération des statistiques");
        }
      } catch (error) {
        console.error("Erreur serveur :", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchUserStats();

    // Get the last used mode from localStorage
    // const lastMode = localStorage.getItem("lastGameMode");
    // if (lastMode) {
    //   setActiveMode(lastMode);
    // }
  }, []);

  // Handler for mode selection
  const handleModeSelect = (modeId: string) => {
    setActiveMode(modeId);
    localStorage.setItem("lastGameMode", modeId);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300">
        <div className="text-4xl font-black animate-pulse transform rotate-3 bg-black text-yellow-300 p-6 border-4 border-black">
          CHARGEMENT DU CERVEAU...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="overflow-hidden bg-yellow-300 min-h-screen">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        
        {/* Header Section with User Stats */}
        <section className="pt-20 pb-4 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto px-4 relative"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <motion.div variants={itemVariants} className="mb-4 md:mb-0">
                <h1 className="text-5xl font-black transform -rotate-1"
                   style={{ textShadow: "3px 3px 0px #000" }}>
                  PRÊT À BOOSTER
                  <span className="bg-black text-yellow-300 px-3 py-1 ml-2 inline-block rotate-1">
                    TON CERVEAU?
                  </span>
                </h1>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isStatsLoading ? (
                  <>
                    <div className="bg-black text-white p-4 transform border-2 border-black">
                      <div className="font-bold">STREAK ACTUELLE</div>
                      <div className="h-12 bg-gray-700 animate-pulse rounded mt-1"></div>
                    </div>
                    
                    <div className="bg-white p-4 transform border-2 border-black">
                      <div className="font-bold">OBJECTIF QUOTIDIEN</div>
                      <div className="h-8 bg-gray-300 animate-pulse rounded mt-1"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-black text-white p-4 transform border-2 border-black">
                      <div className="font-bold">STREAK ACTUELLE</div>
                      <div className="text-4xl font-black text-yellow-300">{streakDays} JOURS 🔥</div>
                    </div>
                    
                    <div className="bg-white p-4 transform border-2 border-black">
                      <div className="font-bold">OBJECTIF QUOTIDIEN</div>
                      <div className="text-2xl font-black">{dailyGoal} MOTS</div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
            
            <motion.p
              variants={itemVariants}
              className="text-xl font-bold bg-black text-white px-6 py-3 transform rotate-1 inline-block mb-2"
            >
              🧠 CHAQUE JOUR D'ÉCRITURE = +1% DE PUISSANCE CÉRÉBRALE
            </motion.p>
          </motion.div>
        </section>
        
        {/* Game Mode Slider Section */}
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            {mounted && (
              <GameModeSlider 
                gameModes={gameModes} 
                onModeSelect={handleModeSelect}
                initialMode={activeMode}
              />
            )}
          </div>
        </section>
        
        {/* Community Stats Section */}
        <CommunityStats />
      </div>
    </>
  );
}