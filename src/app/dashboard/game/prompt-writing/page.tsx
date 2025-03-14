"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar";

export default function PromptWritingGame() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [dailyTopic, setDailyTopic] = useState(
    "Tape sur 'NOUVEAU DÉFI' et booste ton cerveau instantanément!"
  );
  const [maxWords, setMaxWords] = useState(200);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const challenges = [
    "Imagine que tu es un super-héros avec le pouvoir de transformer n'importe qui en génie : raconte ta première mission!",
    "Tu découvres que ton cerveau possède une pièce secrète. Que contient-elle et comment l'as-tu trouvée?",
    "Si tes neurones organisaient une fête, quelle serait l'invitation et qui viendrait?",
    "Un alien débarque et te demande d'expliquer pourquoi les humains écrivent. Ta réponse?",
    "Tu te réveilles avec la capacité de comprendre le langage des plantes. Première conversation?",
  ];

  useEffect(() => {
    setWordCount(
      text.trim().split(/\s+/).filter((word) => word.length > 0).length
    );
    setProgress(Math.min((wordCount / maxWords) * 100, 100));
  }, [text, maxWords, wordCount]);

  // Récupérer l'objectif quotidien depuis les settings
  useEffect(() => {
    async function fetchUserSettings() {
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const data = await res.json();
          setMaxWords(data.dailyWordGoal);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
      }
    }
    fetchUserSettings();
  }, []);

  const generateTopic = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setDailyTopic(challenges[randomIndex]);
  };

  const handleSave = () => {
    // Logique de sauvegarde ici
    alert(`🧠 VICTOIRE! Tu viens d'augmenter ton QI de 3 points! Continue demain pour devenir un génie total!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-yellow-300"}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" />
        
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto pt-8 px-4"
        >
          <motion.div
            variants={itemVariants}
            className="text-5xl font-black mb-6 text-center transform -rotate-1"
            style={{ textShadow: darkMode ? "3px 3px 0px #9333EA" : "3px 3px 0px #000" }}
          >
            DÉFI D'ÉCRITURE
            <br />
            <span className={`text-3xl ${darkMode ? "bg-purple-700" : "bg-black"} ${darkMode ? "text-white" : "text-yellow-300"} px-4 py-2 inline-block rotate-1`}>
              BOOSTE TON CERVEAU
            </span>
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Section Défi */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={generateTopic}
                className={`${darkMode ? "bg-purple-700" : "bg-black"} ${darkMode ? "text-white" : "text-yellow-300"} px-6 py-3 text-xl font-black border-4 ${darkMode ? "border-purple-700" : "border-black"} transform -rotate-1`}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                NOUVEAU DÉFI 🧠
              </motion.button>
            </div>
            <motion.div
              className={`text-xl font-bold text-center p-6 ${darkMode ? "bg-purple-900 border-purple-600" : "bg-white"} border-4 ${darkMode ? "border-purple-600" : "border-black"} transform rotate-1`}
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 1 }}
              transition={{ duration: 0.5 }}
            >
              {dailyTopic}
            </motion.div>
          </motion.div>

          {/* Section Objectif */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-block ${darkMode ? "bg-gray-800" : "bg-black"} ${darkMode ? "text-gray-200" : "text-white"} px-4 py-2 font-bold transform -rotate-1`}>
              OBJECTIF: <span className={darkMode ? "text-purple-400" : "text-yellow-300"}>{maxWords}</span> MOTS
            </div>
            <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              Pour modifier ton objectif de génie, rends-toi dans les réglages.
            </p>
          </motion.div>

          {/* Section d'Écriture */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <textarea
              placeholder="Laisse libre cours à ton génie intérieur... Chaque mot est un pas vers la super-intelligence !"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full p-6 rounded-none text-lg border-4 ${darkMode ? "border-purple-600 bg-gray-800 text-white" : "border-black bg-white text-black"} h-64`}
            ></textarea>
            <motion.div
              className={`flex justify-between mt-2 font-bold ${darkMode ? "text-purple-300" : "text-black"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm">
                {wordCount >= maxWords ? "🎉 OBJECTIF ATTEINT! TON QI AUGMENTE!" : `Encore ${maxWords - wordCount} mots avant le boost cognitif`}
              </span>
              <span>
                MOTS: {wordCount}
              </span>
            </motion.div>
          </motion.div>

          {/* Section Progression */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} h-8 border-2 ${darkMode ? "border-purple-600" : "border-black"}`}>
              <motion.div
                className={`h-full ${progress >= 100 ? (darkMode ? "bg-purple-500" : "bg-green-500") : (darkMode ? "bg-purple-600" : "bg-black")}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              >
                {progress >= 30 && (
                  <div className="text-center text-white font-bold py-1">
                    {Math.round(progress)}% BOOSTÉ
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Section Action */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleSave}
              className={`${darkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-black hover:bg-yellow-400 hover:text-black"} ${darkMode ? "text-white" : "text-yellow-300"} px-8 py-4 text-2xl font-black border-4 ${darkMode ? "border-purple-600 hover:border-purple-500" : "border-black"} transition-all`}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              disabled={wordCount === 0}
            >
              {wordCount === 0 ? "COMMENCE À ÉCRIRE!" : "SAUVEGARDER TON GÉNIE 🧠"}
            </motion.button>
          </motion.div>

          {/* Mode Switch */}
          <div className="fixed bottom-4 right-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full p-3 ${darkMode ? "bg-yellow-300 text-black" : "bg-purple-900 text-white"}`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? "☀️" : "🌙"}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}