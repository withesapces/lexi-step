"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Trophy, Award, Medal, Sparkles, Zap, Brain, Crown } from "lucide-react";
import Navbar from "../components/Navbar";

// Définition de l'interface pour les données utilisateur
interface UserData {
  id: string;
  name: string;
  streak: number;
  totalWords: number;
  badges: number;
  avatar: string;
}

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("streak"); // streak, words, badges

  // Mise à jour pour récupérer les données réelles de l'API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/leaderboard');

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();

        // Mettre à jour le state avec les données du leaderboard
        setLeaderboardData(data.leaderboard);

        // Vous pourriez également traiter les userStats ici si vous voulez
        // Par exemple, pour afficher un message spécial à l'utilisateur connecté
        if (data.userStats) {
          console.log("Stats utilisateur:", data.userStats);
          // Potentiellement stocker ces informations dans un autre state
          // setUserStats(data.userStats);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération du leaderboard:", error);
        // Afficher un message d'erreur à l'utilisateur si nécessaire
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trier les utilisateurs selon le filtre actif
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (filter === "streak") return b.streak - a.streak;
    if (filter === "words") return b.totalWords - a.totalWords;
    if (filter === "badges") return b.badges - a.badges;
    return 0;
  });

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
      transition: { duration: 0.5 }
    }
  };

  const getPlace = (index: number) => {
    if (index === 0) return { icon: <Crown size={24} />, color: "bg-yellow-300" };
    if (index === 1) return { icon: <Award size={24} />, color: "bg-gray-300" };
    if (index === 2) return { icon: <Medal size={24} />, color: "bg-amber-600" };
    return { icon: <Trophy size={24} />, color: "bg-white" };
  };

  const getBrainBoostText = (value: number, type: string) => {
    if (type === "streak") {
      if (value > 30) return "CERVEAU SURPUISSANT 🧠";
      if (value > 20) return "NEURONES EN FEU 🔥";
      if (value > 10) return "SYNAPSES ACTIVÉES ⚡";
      return "CERVEAU EN ÉVEIL 👀";
    }
    if (type === "words") {
      if (value > 50000) return "SHAKESPEARE DU FUTUR 📚";
      if (value > 30000) return "MACHINE À MOTS 🤖";
      if (value > 10000) return "PLUME DÉCHAÎNÉE ✏️";
      return "ÉCRIVAIN EN HERBE 🌱";
    }
    return "";
  };

  return (
    <div className="min-h-screen overflow-hidden bg-yellow-300">
      <Navbar />
      <div className="absolute inset-0 opacity-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-6xl font-black mb-4 transform -rotate-1">
            <span className="bg-black text-yellow-300 px-4 py-2 inline-block">
              CERVEAUX LÉGENDAIRES
            </span>
          </h1>
          <p className="text-2xl font-bold bg-blue-400 text-black px-6 py-3 transform rotate-1 inline-block border-4 border-black mb-8">
            🧠 QUI A LE PLUS GROS CORTEX PRÉFRONTAL ?
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 bg-white border-4 border-black p-6"
            style={{ boxShadow: "8px 8px 0px #000" }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="CHERCHER UN CERVEAU SUPÉRIEUR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-4 border-black p-3 pr-12 text-lg font-bold focus:bg-pink-100 focus:outline-none"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2" size={24} />
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter("streak")}
                  className={`px-4 py-2 font-black text-lg border-4 border-black ${filter === "streak" ? "bg-green-400" : "bg-white hover:bg-yellow-100"}`}
                >
                  <Zap className="inline-block mr-1" size={20} />
                  STREAK
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter("words")}
                  className={`px-4 py-2 font-black text-lg border-4 border-black ${filter === "words" ? "bg-green-400" : "bg-white hover:bg-yellow-100"}`}
                >
                  <Brain className="inline-block mr-1" size={20} />
                  MOTS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter("badges")}
                  className={`px-4 py-2 font-black text-lg border-4 border-black ${filter === "badges" ? "bg-green-400" : "bg-white hover:bg-yellow-100"}`}
                >
                  <Sparkles className="inline-block mr-1" size={20} />
                  BADGES
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard List */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block text-6xl mb-4"
              >
                🧠
              </motion.div>
              <p className="text-2xl font-black">CHARGEMENT DES SUPER-CERVEAUX...</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {sortedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 0.5 : -0.5 }}
                  className="bg-white border-4 border-black p-4 flex items-center relative"
                  style={{ boxShadow: "5px 5px 0px #000" }}
                >
                  {/* Place */}
                  <div className={`text-2xl font-black h-14 w-14 ${getPlace(index).color} border-4 border-black flex items-center justify-center mr-4`}>
                    {index < 3 ? getPlace(index).icon : index + 1}
                  </div>

                  {/* User Avatar */}
                  <div className="text-4xl mr-4">{user.avatar}</div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="font-black text-xl">{user.name}</div>
                    <div className="font-bold">
                      {getBrainBoostText(filter === "streak" ? user.streak : user.totalWords, filter)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-4 text-lg">
                    <div className={`font-black p-2 ${filter === "streak" ? "bg-green-400 transform rotate-2" : ""}`}>
                      <Zap className="inline-block mr-1" size={16} />
                      {user.streak} JOURS
                    </div>
                    <div className={`font-black p-2 ${filter === "words" ? "bg-green-400 transform -rotate-2" : ""}`}>
                      <Brain className="inline-block mr-1" size={16} />
                      {user.totalWords.toLocaleString()} MOTS
                    </div>
                    <div className={`font-black p-2 ${filter === "badges" ? "bg-green-400 transform rotate-2" : ""}`}>
                      <Sparkles className="inline-block mr-1" size={16} />
                      {user.badges} BADGES
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredUsers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white border-4 border-black"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-black mb-2">AUCUN CERVEAU TROUVÉ</h3>
                  <p className="font-bold">Ce génie est peut-être encore en train de s'entraîner...</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Motivation Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-pink-400 border-4 border-black p-6 text-center transform -rotate-1"
          >
            <h3 className="text-2xl font-black mb-4">TON CERVEAU N'EST PAS DANS LE TOP ?</h3>
            <p className="font-bold text-lg mb-6">
              Un peu d'écriture quotidienne et tu dépasseras tous ces pseudo-génies !
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white font-black text-xl py-3 px-8 border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
            >
              COMMENCER À ÉCRIRE MAINTENANT →
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}