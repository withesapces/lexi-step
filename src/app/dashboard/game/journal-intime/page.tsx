"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "../../../components/Navbar";

interface JournalEntry {
  date: string;
  mood: string;
  preview: string;
}

type PromptCategory = "gratitude" | "reflection" | "emotions";


interface JournalPrompts {
    gratitude: string[];
    reflection: string[];
    emotions: string[];
  }

const journalPrompts: JournalPrompts = {
  gratitude: [
    "Qu'est-ce qui t'a fait sourire aujourd'hui? Pourquoi?",
    "Quelles sont 3 choses pour lesquelles tu es reconnaissant(e) aujourd'hui?",
    "Qui t'a aidé récemment et comment pourrais-tu le remercier?"
  ],
  reflection: [
    "Quel a été le moment le plus marquant de ta journée et pourquoi?",
    "Comment te sens-tu différent aujourd'hui par rapport à hier?",
    "Quelle leçon as-tu apprise aujourd'hui que tu voudrais te rappeler?"
  ],
  emotions: [
    "Quelle émotion a dominé ta journée? Qu'est-ce qui l'a déclenchée?",
    "Y a-t-il une émotion que tu as du mal à exprimer? Comment pourrais-tu la libérer?",
    "Comment ton corps réagit-il au stress aujourd'hui? Où le ressens-tu?"
  ]
};

export default function JournalIntimeGame() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxWords, setMaxWords] = useState(200);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [mood, setMood] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  const moodOptions = [
    { emoji: "😊", name: "Joyeux", color: "bg-green-400" },
    { emoji: "😌", name: "Calme", color: "bg-blue-300" },
    { emoji: "😐", name: "Neutre", color: "bg-gray-300" },
    { emoji: "😔", name: "Mélancolique", color: "bg-indigo-300" },
    { emoji: "😤", name: "Frustré", color: "bg-orange-300" },
    { emoji: "😫", name: "Stressé", color: "bg-red-300" }
  ];

  // Chargement des données simulées
  useEffect(() => {
    setStreakDays(16);
    setJournalEntries([
      { date: "15 février", mood: "😊", preview: "Aujourd'hui était une journée productive..." },
      { date: "14 février", mood: "😌", preview: "J'ai pris le temps de méditer ce matin..." },
      { date: "13 février", mood: "😤", preview: "Journée difficile au travail, mais j'ai appris..." }
    ]);
  }, []);

  useEffect(() => {
    const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(count);
    setProgress(Math.min((count / maxWords) * 100, 100));
  }, [text, maxWords]);

  // Récupérer l'objectif quotidien depuis les settings
  useEffect(() => {
    async function fetchUserSettings() {
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const data = await res.json();
          setMaxWords(data.dailyWordGoal || 200);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
      }
    }
    fetchUserSettings();
  }, []);

  const handleSave = () => {
    if (mood === "") {
      setShowMoodTracker(true);
      return;
    }
    alert(`🧠 PARFAIT! Ton journal est enregistré. Ton niveau de conscience émotionnelle vient d'augmenter de 6%!`);
  };

  const selectPromptCategory = (category: PromptCategory) => {
    const prompts = journalPrompts[category];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setSelectedPrompt(prompts[randomIndex]);
  };

  const selectMood = (selectedMood: string) => {
    setMood(selectedMood);
    setShowMoodTracker(false);
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
        duration: 0.4
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-pink-400"}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto pt-8 px-4"
        >
          <motion.div
            variants={itemVariants}
            className="text-5xl font-black mb-2 text-center transform -rotate-1"
            style={{ textShadow: darkMode ? "3px 3px 0px #EC4899" : "3px 3px 0px #000" }}
          >
            JOURNAL INTIME
            <br />
            <span className={`text-3xl ${darkMode ? "bg-pink-600" : "bg-black"} ${darkMode ? "text-white" : "text-pink-400"} px-4 py-2 inline-block rotate-1`}>
              THÉRAPIE CÉRÉBRALE
            </span>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="text-center mb-6"
          >
            <span className={`inline-block ${darkMode ? "bg-gray-800" : "bg-white"} px-4 py-2 font-bold border-2 ${darkMode ? "border-pink-600" : "border-black"} transform rotate-1`}>
              {today}
            </span>
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Section Statistiques */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 flex flex-wrap gap-4 justify-center"
          >
            <motion.div 
              variants={itemVariants}
              className={`p-4 ${darkMode ? "bg-gray-800 border-pink-600" : "bg-white border-black"} border-2 transform -rotate-1`}
            >
              <div className="font-bold text-sm">STREAK</div>
              <div className="text-2xl font-black">{streakDays} JOURS 🔥</div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className={`p-4 ${darkMode ? "bg-gray-800 border-pink-600" : "bg-white border-black"} border-2 transform rotate-1`}
            >
              <div className="font-bold text-sm">OBJECTIF</div>
              <div className="text-2xl font-black">{maxWords} MOTS</div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className={`p-4 ${darkMode ? "bg-gray-800 border-pink-600" : "bg-white border-black"} border-2 transform -rotate-1`}
            >
              <div className="font-bold text-sm">HUMEUR DOMINANTE</div>
              <div className="text-2xl font-black">😌 CETTE SEMAINE</div>
            </motion.div>
          </motion.div>

          {/* Section Inspiration */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-4">
              <motion.h3 
                className={`inline-block ${darkMode ? "bg-pink-600" : "bg-black"} ${darkMode ? "text-white" : "text-pink-400"} px-4 py-2 font-bold transform rotate-1`}
              >
                INSPIRATION DU JOUR
              </motion.h3>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <motion.button
                onClick={() => selectPromptCategory("gratitude")}
                className={`${darkMode ? "bg-pink-600 hover:bg-pink-500" : "bg-black hover:bg-gray-800"} text-white px-4 py-2 font-bold transform -rotate-1 border-2 ${darkMode ? "border-pink-600" : "border-black"}`}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                GRATITUDE 🙏
              </motion.button>
              
              <motion.button
                onClick={() => selectPromptCategory("reflection")}
                className={`${darkMode ? "bg-pink-600 hover:bg-pink-500" : "bg-black hover:bg-gray-800"} text-white px-4 py-2 font-bold transform rotate-1 border-2 ${darkMode ? "border-pink-600" : "border-black"}`}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                RÉFLEXION 🤔
              </motion.button>
              
              <motion.button
                onClick={() => selectPromptCategory("emotions")}
                className={`${darkMode ? "bg-pink-600 hover:bg-pink-500" : "bg-black hover:bg-gray-800"} text-white px-4 py-2 font-bold transform -rotate-1 border-2 ${darkMode ? "border-pink-600" : "border-black"}`}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                ÉMOTIONS 💖
              </motion.button>
            </div>
            
            {selectedPrompt && (
              <motion.div
                className={`text-lg font-bold text-center p-6 ${darkMode ? "bg-gray-800 border-pink-600" : "bg-white border-black"} border-2 transform ${Math.random() > 0.5 ? "rotate-1" : "-rotate-1"}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {selectedPrompt}
              </motion.div>
            )}
          </motion.div>

          {/* Section d'Écriture */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${darkMode ? "text-pink-300" : "text-black"}`}>
                MON JOURNAL {mood && <span className="text-2xl ml-2">{mood}</span>}
              </span>
              <span className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                MOTS: {wordCount}/{maxWords}
              </span>
            </div>
            
            <textarea
              placeholder="Écris ce que tu ressens aujourd'hui... Chaque mot réduit ton stress et améliore ton bien-être émotionnel !"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full p-6 rounded-none text-lg border-4 ${darkMode ? "border-pink-600 bg-gray-800 text-white" : "border-black bg-white text-black"} ${isExpanded ? "h-96" : "h-64"} transition-all`}
            ></textarea>
            
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-sm ${darkMode ? "text-pink-300" : "text-black"} font-bold underline`}
              >
                {isExpanded ? "Réduire l'espace" : "Plus d'espace"}
              </button>
              
              <span className={`text-sm ${darkMode ? "text-pink-300" : "text-gray-700"} font-bold`}>
                {wordCount >= maxWords ? "🎉 OBJECTIF ATTEINT! TON CERVEAU TE REMERCIE!" : `Encore ${maxWords - wordCount} mots pour libérer tes émotions`}
              </span>
            </div>
          </motion.div>

          {/* Section Progression */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} h-6 border-2 ${darkMode ? "border-pink-600" : "border-black"}`}>
              <motion.div
                className={`h-full ${progress >= 100 ? (darkMode ? "bg-green-500" : "bg-green-500") : (darkMode ? "bg-pink-600" : "bg-pink-600")}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              >
                {progress >= 30 && (
                  <div className="text-center text-white font-bold text-sm py-0.5">
                    {Math.round(progress)}% DE DÉCHARGE ÉMOTIONNELLE
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Section Action */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleSave}
              className={`${darkMode ? "bg-pink-600 hover:bg-pink-500" : "bg-black hover:bg-pink-500 hover:text-white"} ${darkMode ? "text-white" : "text-pink-400"} px-8 py-4 text-xl font-black border-4 ${darkMode ? "border-pink-600 hover:border-pink-500" : "border-black"} transition-all`}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              disabled={wordCount === 0}
            >
              {wordCount === 0 ? "COMMENCE À ÉCRIRE!" : "SAUVEGARDER TON JOURNAL 💖"}
            </motion.button>
          </motion.div>

          {/* Précédentes entrées */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h3 className={`font-bold mb-4 text-center ${darkMode ? "text-pink-300" : "text-black"}`}>PRÉCÉDENTES ENTRÉES</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {journalEntries.map((entry, index) => (
                <motion.div
                  key={index}
                  className={`p-4 ${darkMode ? "bg-gray-800 border-pink-600" : "bg-white border-black"} border-2 transform ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{entry.date}</span>
                    <span className="text-2xl">{entry.mood}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {entry.preview}
                  </p>
                  <button className={`text-sm mt-2 font-bold ${darkMode ? "text-pink-400" : "text-pink-600"}`}>
                    Lire plus...
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mode Switch */}
          <div className="fixed bottom-4 right-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full p-3 ${darkMode ? "bg-pink-400 text-black" : "bg-gray-900 text-white"}`}
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
