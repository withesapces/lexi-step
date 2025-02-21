"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Moodboard from "../components/moodboard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState(200);
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalWords: 0,
    today: 0,
    week: 0,
    month: 0
  });
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // Récupérer les stats et les badges au chargement
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoadingStats(true);
        // Récupérer les stats
        const statsRes = await fetch("/api/user/stats");
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setUserStats({
            streak: stats.currentStreak,
            totalWords: stats.total,
            today: stats.today,
            week: stats.week,
            month: stats.month
          });
          setDailyGoal(stats.dailyGoal);
        }
        
        // Récupérer les badges
        const badgesRes = await fetch("/api/user/badge");
        if (badgesRes.ok) {
          const badgesData = await badgesRes.json();
          setBadges(badgesData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      } finally {
        setLoadingStats(false);
      }
    }
    
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  // Rediriger si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyWordGoal: dailyGoal }),
      });
      if (res.ok) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des réglages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats d'utilisateur formatées pour l'affichage
  const stats = [
    { 
      label: "JOURS CONSÉCUTIFS", 
      value: userStats.streak, 
      icon: "🔥", 
      color: "bg-pink-400" 
    },
    { 
      label: "MOTS TOTAUX", 
      value: userStats.totalWords.toLocaleString(), 
      icon: "📝", 
      color: "bg-blue-400" 
    },
    { 
      label: "NIVEAU CÉRÉBRAL", 
      value: userStats.totalWords > 50000 ? "GÉNIE" : userStats.totalWords > 20000 ? "PRO" : "DÉBUTANT", 
      icon: "🧠", 
      color: "bg-green-400" 
    },
  ];

  if (status === "loading" || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300">
        <div className="text-4xl font-black animate-pulse transform rotate-3 bg-black text-yellow-300 p-6 border-4 border-black">
          CHARGEMENT DU CERVEAU...
        </div>
      </div>
    );
  }

  const user = session?.user;

  // Calculer le pourcentage de progression quotidienne
  const dailyProgressPercent = Math.min(100, (userStats.today / dailyGoal) * 100);

  return (
    <div className="min-h-screen bg-yellow-300 overflow-hidden">
      <Navbar />
      
      {/* Effet de confetti pour la sauvegarde */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: "-10%", 
                left: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                top: "110%", 
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 0.5
              }}
              className={`absolute w-4 h-4 ${
                ["bg-pink-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"][
                  Math.floor(Math.random() * 4)
                ]
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        
        {/* En-tête du profil */}
        <section className="py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto px-4"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar avec style brutal */}
              <motion.div
                whileHover={{ rotate: -5 }}
                className="w-48 h-48 bg-white border-8 border-black rounded-none overflow-hidden relative"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400">
                  <span className="text-7xl">{user?.name?.charAt(0) || "?"}</span>
                </div>
                <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-2 py-1 transform rotate-12">
                  {userStats.totalWords > 50000 ? "GÉNIE" : 
                   userStats.totalWords > 20000 ? "PRO" : "NOVICE"}
                </div>
              </motion.div>

              {/* Informations utilisateur */}
              <div className="flex-1">
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-5xl font-black mb-4 transform -rotate-2"
                  style={{ textShadow: "3px 3px 0px #000" }}
                >
                  {user?.name || "GÉNIE ANONYME"}
                </motion.h1>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black text-white px-4 py-2 inline-block transform rotate-1 mb-4"
                >
                  <span className="font-bold">{user?.email || "cerveau@lexistep.com"}</span>
                </motion.div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                      className={`${stat.color} border-4 border-black p-4 text-center`}
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-xl font-black">{stat.value}</div>
                      <div className="text-sm font-bold">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section des objectifs */}
        <section className="py-16 bg-white border-y-8 border-black">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-4xl font-black mb-12 text-center transform -rotate-1">
              <span className="bg-black text-white px-4 py-2 inline-block">
                ENTRAÎNEMENT CÉRÉBRAL
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulaire d'objectif */}
              <motion.div
                whileHover={{ rotate: -1 }}
                className="p-6 bg-pink-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-6">🎯 TON OBJECTIF QUOTIDIEN</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xl font-black mb-4">
                      COMBIEN DE MOTS PAR JOUR ?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="200"
                        max="1000"
                        step="50"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="w-full h-6 appearance-none bg-black rounded-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-yellow-300 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black"
                      />
                      <span className="text-3xl font-black bg-white border-4 border-black px-4 py-2 min-w-[120px] text-center">
                        {dailyGoal}
                      </span>
                    </div>
                    <p className="mt-2 font-bold">
                      {dailyGoal < 300
                        ? "NIVEAU DÉBUTANT - C'est un bon début!"
                        : dailyGoal < 600
                        ? "NIVEAU INTERMÉDIAIRE - Tu développes ton cerveau!"
                        : "NIVEAU EXPERT - Tu vas devenir un génie!"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-black text-white font-black py-3 px-6 text-xl border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
                    disabled={loading}
                  >
                    {loading ? "SAUVEGARDE EN COURS..." : "BOOSTER MON CERVEAU 🧠"}
                  </motion.button>
                </form>
              </motion.div>

              {/* Progression actuelle - Mise à jour avec les données de la BDD */}
              <motion.div
                whileHover={{ rotate: 1 }}
                className="p-6 bg-blue-400 border-4 border-black relative overflow-hidden"
              >
                <h3 className="text-2xl font-black mb-6">⚡️ TA PROGRESSION</h3>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black">AUJOURD'HUI</span>
                    <span className="font-black bg-white border-2 border-black px-2 py-1">
                      {userStats.today} / {dailyGoal} MOTS
                    </span>
                  </div>
                  
                  <div className="w-full h-8 bg-white border-4 border-black mb-6">
                    <div 
                      className="h-full bg-green-400 border-r-4 border-black transition-all duration-500"
                      style={{ width: `${dailyProgressPercent}%` }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Cette semaine</span>
                        <span className="font-bold">{userStats.week.toLocaleString()} mots</span>
                      </div>
                      <div className="w-full h-4 bg-white border-2 border-black">
                        <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (userStats.week / (dailyGoal * 7)) * 100)}%` }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Ce mois</span>
                        <span className="font-bold">{userStats.month.toLocaleString()} mots</span>
                      </div>
                      <div className="w-full h-4 bg-white border-2 border-black">
                        <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (userStats.month / (dailyGoal * 30)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-black text-white font-black py-3 px-6 text-xl mt-6 border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
                  >
                    CONTINUER À ÉCRIRE ✍️
                  </motion.button>
                </div>
                
                {/* Éléments décoratifs */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-300 rounded-full opacity-30" />
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-pink-500 rounded-full opacity-20" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Section des badges - Mise à jour avec les données de la BDD */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform rotate-1">
                TES BADGES DE GÉNIE
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={badge.earned ? { scale: 1.03, rotate: badge.id % 2 === 0 ? 2 : -2 } : {}}
                  className={`p-6 border-4 border-black text-center ${
                    badge.earned ? "bg-white" : "bg-gray-200 grayscale"
                  }`}
                >
                  <div className="text-5xl mb-4">{badge.icon}</div>
                  <h3 className="text-xl font-black mb-2">{badge.name}</h3>
                  <p className="font-bold text-sm">
                    {badge.description}
                  </p>
                  {!badge.earned && (
                    <div className="mt-4 bg-black text-white py-1 px-2 inline-block text-xs font-black transform -rotate-2">
                      À DÉBLOQUER
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Dans votre ProfilePage, ajoutez le Moodboard avant la section des badges */}
<section className="py-16 bg-white border-y-8 border-black">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="max-w-5xl mx-auto px-4"
  >
    <h2 className="text-4xl font-black mb-12 text-center transform rotate-1">
      <span className="bg-black text-white px-4 py-2 inline-block">
        TON CERVEAU ÉMOTIONNEL
      </span>
    </h2>
    
    <Moodboard />
  </motion.div>
</section>

        {/* Section déconnexion */}
        <section className="py-16 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-4xl font-black mb-8">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-2">
                BESOIN DE REPOS CÉRÉBRAL ?
              </span>
            </h2>
            <p className="text-xl mb-8 font-bold">
              (Mais n'oublie pas : chaque jour sans écrire = 1 million de neurones qui s'ennuient)
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-2xl font-black bg-yellow-300 text-black px-8 py-4 rounded-none border-4 border-yellow-300 hover:bg-white transition-all"
            >
              DÉCONNEXION TEMPORAIRE 🧠💤
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}