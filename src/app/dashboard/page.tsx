"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";

export default function GameModePage() {
  const { data: session, status } = useSession();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(200);

  // Après le montage, on définit mounted à true et on calcule le scrollWidth
  useEffect(() => {
    setMounted(true);
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      setScrollWidth(carousel.scrollWidth - carousel.offsetWidth);
    }

    // Récupérer les statistiques utilisateur depuis l'API
    const fetchUserStats = async () => {
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
      }
    };

    fetchUserStats();

    // Récupérer le dernier mode utilisé depuis localStorage
    const lastMode = localStorage.getItem("lastGameMode");
    if (lastMode) {
      setActiveMode(lastMode);
    }
  }, []);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

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

  const gameModes = [
    {
      id: "journal-intime",
      title: "JOURNAL INTIME",
      description: "Écris tes émotions et réduis ton stress de 42% en 21 jours!",
      bgColor: "bg-pink-400",
      redirectUrl: "/dashboard/game/journal-intime",
      emoji: "📓",
      prompts: ["Comment te sens-tu aujourd'hui?", "Qu'est-ce qui t'a marqué cette semaine?"]
    },
    {
      id: "free-writing",
      title: "ÉCRITURE LIBRE",
      description: "Libère ton cerveau et booste ta créativité sans limites!",
      bgColor: "bg-yellow-300",
      redirectUrl: "/dashboard/game/free-writing",
      emoji: "✨",
      prompts: ["Écris sans t'arrêter pendant 5 minutes", "Laisse couler tes pensées..."]
    },
    {
      id: "prompt-writing",
      title: "PROMPTS QUOTIDIENS",
      description: "Réponds à nos défis pour décupler ta capacité cognitive!",
      bgColor: "bg-blue-400",
      redirectUrl: "/dashboard/game/prompt-writing",
      emoji: "🧠",
      prompts: ["Si tu pouvais voyager dans le temps...", "Imagine une technologie du futur..."]
    },
    {
      id: "collaborative-writing",
      title: "ÉCRITURE COLLABORATIVE",
      description: "Augmente ton QI en co-créant avec d'autres génies en devenir!",
      bgColor: "bg-purple-400",
      redirectUrl: "/dashboard/game/collaborative-writing",
      emoji: "👥",
      prompts: ["18 auteurs en ligne maintenant!", "3 histoires qui attendent ta contribution"]
    },
  ];

  // Fonctions de navigation horizontale
  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleModeSelect = (modeId: string) => {
    setActiveMode(modeId);
    localStorage.setItem("lastGameMode", modeId);
    launchConfetti();
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
                <div className="bg-black text-white p-4 transform rotate-1 border-2 border-black">
                  <div className="font-bold">STREAK ACTUELLE</div>
                  <div className="text-4xl font-black text-yellow-300">{streakDays} JOURS 🔥</div>
                </div>
                
                <div className="bg-white p-4 transform -rotate-1 border-2 border-black">
                  <div className="font-bold">OBJECTIF QUOTIDIEN</div>
                  <div className="text-2xl font-black">{dailyGoal} MOTS</div>
                </div>
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
        
        {/* Game Mode Selection with Interactive Details */}
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            {mounted && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 z-10 font-black text-xl hidden md:block"
                  onClick={scrollLeft}
                >
                  ←
                </motion.button>
                
                <div
                  ref={carouselRef}
                  className="flex space-x-4 overflow-x-auto p-4 md:p-6 scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {gameModes.map((mode) => (
                    <motion.div
                      key={mode.id}
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: Math.random() > 0.5 ? 2 : -2,
                        zIndex: 10
                      }}
                      className={`snap-center w-[280px] md:w-[320px] h-[340px] flex-shrink-0 p-6 ${mode.bgColor} border-4 border-black cursor-pointer transition-all flex flex-col justify-between ${activeMode === mode.id ? 'ring-8 ring-white' : ''}`}
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      <div className="text-4xl mb-2">{mode.emoji}</div>
                      <h2 className="text-2xl font-black mb-3">{mode.title}</h2>
                      <p className="font-bold text-lg mb-3">{mode.description}</p>
                      
                      <div className="p-3 bg-black bg-opacity-10 border-2 border-black mb-4">
                        <p className="font-bold text-sm">AUJOURD'HUI:</p>
                        <p className="text-sm italic">{mode.prompts[0]}</p>
                      </div>
                      
                      <Link href={mode.redirectUrl}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-black text-white font-black py-3 px-4 border-2 border-black hover:bg-white hover:text-black transition-all w-full"
                        >
                          ÉCRIRE MAINTENANT → 
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-gray-800 z-10 font-black text-xl hidden md:block"
                  onClick={scrollRight}
                >
                  →
                </motion.button>
              </div>
            )}
          </div>
        </section>
        
        {/* Selected Mode Details */}
        {activeMode && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 px-4"
          >
            <div className="max-w-5xl mx-auto">
              <div className={`p-6 border-4 border-black ${gameModes.find(m => m.id === activeMode)?.bgColor || 'bg-white'}`}>
                <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                  {gameModes.find(m => m.id === activeMode)?.emoji} 
                  {gameModes.find(m => m.id === activeMode)?.title}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black bg-opacity-10 p-4 border-2 border-black">
                    <h3 className="font-bold mb-2">DÉFI DU JOUR:</h3>
                    <p className="text-lg">{gameModes.find(m => m.id === activeMode)?.prompts[0]}</p>
                  </div>
                  
                  <div className="bg-black bg-opacity-10 p-4 border-2 border-black">
                    <h3 className="font-bold mb-2">STATISTIQUES:</h3>
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold">SESSIONS</div>
                        <div className="text-xl">12</div>
                      </div>
                      <div>
                        <div className="font-bold">TOTAL MOTS</div>
                        <div className="text-xl">9,437</div>
                      </div>
                      <div>
                        <div className="font-bold">NIVEAU</div>
                        <div className="text-xl">4 🧠</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={gameModes.find(m => m.id === activeMode)?.redirectUrl || "#"}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-black text-white font-black py-4 px-8 border-2 border-black hover:bg-white hover:text-black transition-all"
                    >
                      COMMENCER L'ÉCRITURE
                    </motion.button>
                  </Link>
                  
                  <Link href={`/dashboard/stats/${activeMode}`}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white text-black font-bold py-4 px-8 border-2 border-black hover:bg-black hover:text-white transition-all"
                    >
                      VOIR PROGRESSION
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Community Motivation */}
        <section className="py-12 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-black mb-4">
                  <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-2">
                    STATS COMMUNAUTÉ
                  </span>
                </h2>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between bg-white bg-opacity-10 p-3">
                    <span className="font-bold">Mots écrits aujourd'hui:</span>
                    <span className="font-black">124,736</span>
                  </div>
                  <div className="flex justify-between bg-white bg-opacity-10 p-3">
                    <span className="font-bold">Membres en streak (7+ jours):</span>
                    <span className="font-black">312</span>
                  </div>
                  <div className="flex justify-between bg-white bg-opacity-10 p-3">
                    <span className="font-bold">Écrivains en ligne:</span>
                    <span className="font-black">47</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-300 text-black p-6 border-4 border-white transform rotate-1 max-w-md">
                <h3 className="text-2xl font-black mb-3">RAPPEL NEUROSCIENTIFIQUE 🧠</h3>
                <p className="font-bold mb-3">Écrire 200-1000 mots quotidiennement pendant 30 jours consécutifs améliore:</p>
                <ul className="list-disc pl-5 font-medium">
                  <li>Mémoire à court terme +28%</li>
                  <li>Créativité générale +37%</li>
                  <li>Résolution de problèmes +42%</li>
                  <li>Clarté mentale +53%</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}