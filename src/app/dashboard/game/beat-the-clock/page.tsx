"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Trophy, Target, AlertTriangle, XCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";

type Intensity = "super" | "fast" | "medium" | "slow" | "idle";

const FlameEffect = ({ intensity }: { intensity: Intensity }) => (
  <div className="absolute -inset-2 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bottom-0"
        style={{
          left: `${i * 5}%`,
          backgroundColor: intensity === "super" ? "#ff0000" : "#ff4d00",
          width: "20px",
          height: "40px",
          filter: "blur(8px)",
        }}
        animate={{
          height: ["40px", "60px", "40px"],
          y: [0, -20, 0],
        }}
        transition={{
          duration: intensity === "super" ? 0.3 : (0.5 + Math.random() * 0.5),
          repeat: Infinity,
          delay: Math.random() * 0.5,
        }}
      />
    ))}
  </div>
);

export default function SpeedWritingGame() {
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [speedState, setSpeedState] = useState<Intensity>("idle");
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastWordCount, setLastWordCount] = useState(0);
  const [timeLimit, setTimeLimit] = useState(600);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [goalWords, setGoalWords] = useState(300);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(Date.now());
  const [streakTimeout, setStreakTimeout] = useState<NodeJS.Timeout | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  const challenges = [
    "🔥 DÉFI TITANESQUE: Écris 300 mots en 10 minutes ou le monde explose!",
    "⚡️ MISSION CRITIQUE: 300 mots minimum, chaque mot compte pour sauver l'humanité!",
    "🚀 OBJECTIF SUPERSONIC: Dépasse 300 mots en mode turbo! Pas le droit à l'erreur!",
    "💥 ALERTE MAXIMALE: L'univers s'effondre si tu n'atteins pas 300 mots!",
    "⚔️ COMBAT FINAL: Toi contre le chrono - Objectif 300 mots minimum!",
  ];
  const [challenge, setChallenge] = useState(challenges[0]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= timeLimit - 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            setShowEndScreen(true);
            return timeLimit;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLimit]);

  // Fonction pour gérer la détection des mots et le calcul de la vitesse
  const handleTextChange = (newText: string) => {
    if (!isPlaying) return;
    
    setText(newText);
    const now = Date.now();
    const currentWords = newText.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const wordsChanged = currentWords - lastWordCount;
    
    if (wordsChanged > 0) {
      const timeDiff = (now - lastTypingTime) / 1000;
      const instantWPM = (wordsChanged / timeDiff) * 60;

      // Mettre à jour le combo et la vitesse
      if (instantWPM >= 120) {
        setSpeedState("super");
        setCombo(prev => {
          const newCombo = Math.min(prev + 2, 10);
          setMaxCombo(Math.max(newCombo, maxCombo));
          return newCombo;
        });
      } else if (instantWPM >= 80) {
        setSpeedState("fast");
        setCombo(prev => {
          const newCombo = Math.min(prev + 1, 10);
          setMaxCombo(Math.max(newCombo, maxCombo));
          return newCombo;
        });
      } else if (instantWPM >= 40) {
        setSpeedState("medium");
      } else {
        setSpeedState("slow");
      }

      // Gérer la série de mots
      setCurrentStreak(prev => {
        const newStreak = prev + wordsChanged;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });

      // Réinitialiser le timeout de la série
      if (streakTimeout) {
        clearTimeout(streakTimeout);
      }
      
      const newTimeout = setTimeout(() => {
        setCurrentStreak(0);
        setSpeedState("idle");
        setCombo(0);
      }, 2000);
      
      setStreakTimeout(newTimeout);
      
      setLastTypingTime(now);
      setLastWordCount(currentWords);
    }

    setWordCount(currentWords);
    const wordsPerMin = Math.round((currentWords / (timer / 60)) || 0);
    setWordsPerMinute(wordsPerMin);

    const expectedWords = (timer / timeLimit) * goalWords;
    setShowWarning(currentWords < expectedWords - 20);
  };

  const startGame = () => {
    setText("");
    setTimer(0);
    setIsPlaying(true);
    setShowEndScreen(false);
    setLastWordCount(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setLastTypingTime(Date.now());
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleQuit = () => {
    setShowQuitDialog(true);
  };

  const confirmQuit = () => {
    setIsPlaying(false);
    setShowEndScreen(true);
    setShowQuitDialog(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (streakTimeout) clearTimeout(streakTimeout);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streakTimeout) clearTimeout(streakTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-purple-300"}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

        {/* Header avec compteur d'objectif et bouton quitter */}
        <motion.div className="max-w-4xl mx-auto pt-8 px-4">
          <motion.div className="flex justify-between items-center mb-6">
            <motion.div
              className="text-5xl font-black text-center transform -rotate-1"
              style={{ textShadow: darkMode ? "3px 3px 0px #9333EA" : "3px 3px 0px #000" }}
            >
              BEAT THE CLOCK
              <br />
              <span
                className={`text-3xl ${darkMode ? "bg-purple-700" : "bg-black"} ${
                  darkMode ? "text-white" : "text-purple-300"
                } px-4 py-2 inline-block rotate-1`}
              >
                MODE SUPERSONIC
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.div
                className={`text-2xl font-bold ${wordCount >= goalWords ? "text-green-500" : "text-red-500"}`}
                animate={{ scale: wordCount >= goalWords ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                <Target className="inline-block mr-2" />
                {wordCount}/{goalWords} mots
              </motion.div>
              {isPlaying && (
                <button onClick={handleQuit} className="p-2 text-red-500 hover:text-red-600">
                  <XCircle size={24} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Timer et Stats */}
          <div className="flex justify-between items-center mb-6">
            <motion.div
              className={`text-6xl font-black ${timer >= timeLimit - 30 ? "text-red-500" : ""}`}
              animate={{ scale: timer >= timeLimit - 30 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timer >= timeLimit - 30 ? Infinity : 0, duration: 0.5 }}
            >
              {formatTime(timeLimit - timer)}
            </motion.div>

            <div className="flex gap-4">
              <motion.div className="text-xl font-bold" animate={{ scale: combo > 0 ? [1, 1.2, 1] : 1 }}>
                <Flame className="inline-block mr-2" />
                Combo: x{combo}
              </motion.div>
              <motion.div
                className="text-xl font-bold"
                animate={{ scale: currentStreak > bestStreak ? [1, 1.2, 1] : 1 }}
              >
                <Trophy className="inline-block mr-2" />
                Record: {bestStreak}
              </motion.div>
            </div>
          </div>

          {/* Défi */}
          <motion.div
            className={`text-xl font-bold text-center p-6 mb-6 ${darkMode ? "bg-purple-900" : "bg-white"} border-4 ${
              darkMode ? "border-purple-600" : "border-black"
            } transform rotate-1`}
          >
            {challenge}
          </motion.div>

          {/* Zone d'écriture avec effets */}
          <motion.div className="relative mb-8">
            {speedState !== "idle" && <FlameEffect intensity={speedState} />}
            <textarea
          ref={textareaRef}
          placeholder={isPlaying ? "ÉCRIS COMME SI TA VIE EN DÉPENDAIT! ⚡️" : "Prêt à relever le défi ?"}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className={`w-full p-6 rounded-none text-lg border-4 ${
            darkMode ? "border-purple-600 bg-gray-800 text-white" : "border-black bg-white text-black"
          } h-64 ${speedState === "super" ? "animate-pulse" : ""}`}
          disabled={!isPlaying || showEndScreen}
        />

            {/* Indicateur de vitesse */}
            <AnimatePresence>
              {speedState !== "idle" && (
                <motion.div
                  className={`absolute top-2 right-2 text-4xl ${speedState === "super" ? "animate-bounce" : ""}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {speedState === "super" ? "🔥" : speedState === "fast" ? "⚡️" : "✨"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alerte objectif */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  className="absolute bottom-2 right-2 text-red-500 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <AlertTriangle className="mr-2" />
                  Attention: En retard sur l'objectif!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats en temps réel */}
          <motion.div className="grid grid-cols-3 gap-4 mb-8 text-xl font-bold" animate={{ y: isPlaying ? 0 : 20, opacity: isPlaying ? 1 : 0 }}>
            <div className={`p-4 text-center ${darkMode ? "bg-purple-900" : "bg-white"} border-2 ${darkMode ? "border-purple-600" : "border-black"}`}>
              <Zap className="inline-block mr-2" />
              {wordsPerMinute} MPM
            </div>
            <div className={`p-4 text-center ${darkMode ? "bg-purple-900" : "bg-white"} border-2 ${darkMode ? "border-purple-600" : "border-black"}`}>
              <Trophy className="inline-block mr-2" />
              {currentStreak} mots d'affilée
            </div>
            <div className={`p-4 text-center ${darkMode ? "bg-purple-900" : "bg-white"} border-2 ${darkMode ? "border-purple-600" : "border-black"}`}>
              <Target className="inline-block mr-2" />
              {Math.max(0, goalWords - wordCount)} mots restants
            </div>
          </motion.div>

          {/* Bouton de démarrage */}
          {!isPlaying && !showEndScreen && (
            <motion.button
              onClick={startGame}
              className={`w-full ${darkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-black hover:bg-purple-400"} text-white px-8 py-4 text-2xl font-black border-4 ${
                darkMode ? "border-purple-600" : "border-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              COMMENCER LE DÉFI ⚡️
            </motion.button>
          )}

          {/* Écran de fin */}
          <AnimatePresence>
            {showEndScreen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              >
                <motion.div
                  className={`${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-lg border-4 ${
                    darkMode ? "border-purple-600" : "border-black"
                  } max-w-lg w-full mx-4`}
                >
                  <h2 className="text-4xl font-black mb-4 text-center">
                    {wordCount >= goalWords ? "🏆 MISSION ACCOMPLIE! 🏆" : "💔 ÉCHEC DE LA MISSION 💔"}
                  </h2>
                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold mb-4">Résultats de la mission:</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
                        <p className="text-lg font-bold">Mots écrits</p>
                        <p className="text-3xl font-black">{wordCount}</p>
                      </div>
                      <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
                        <p className="text-lg font-bold">Vitesse moyenne</p>
                        <p className="text-3xl font-black">{wordsPerMinute} MPM</p>
                      </div>
                      <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
                        <p className="text-lg font-bold">Meilleure série</p>
                        <p className="text-3xl font-black">{bestStreak}</p>
                      </div>
                      <div className={`p-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg`}>
            <p className="text-lg font-bold">Combo max</p>
            <p className="text-3xl font-black">x{maxCombo}</p>
          </div>
                    </div>
                    <p className="text-xl mb-4">
                      {wordCount >= goalWords
                        ? "🌟 Tu as sauvé le monde avec tes mots! Impressionnant!"
                        : "😔 Le monde avait besoin de plus de mots... Retente ta chance!"}
                    </p>
                    {wordCount < goalWords && (
                      <p className="text-lg text-red-500 mb-4">
                        Il manquait {goalWords - wordCount} mots pour réussir la mission
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={startGame}
                      className={`px-6 py-3 ${darkMode ? "bg-purple-600 hover:bg-purple-500" : "bg-black hover:bg-purple-400"} text-white font-bold rounded-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      NOUVELLE MISSION 🚀
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal personnalisé pour la confirmation de l'abandon */}
          <AnimatePresence>
            {showQuitDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className={`${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-lg border-4 ${
                    darkMode ? "border-purple-600" : "border-black"
                  } max-w-md w-full mx-4`}
                >
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    ⚠️ Attention! Tu vas abandonner le défi!
                  </h2>
                  <p className="mb-6 text-center">
                    Quitter maintenant signifie perdre tout ton travail. Es-tu sûr de vouloir abandonner ?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowQuitDialog(false)}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Non, je continue!
                    </button>
                    <button
                      onClick={confirmQuit}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Oui, j'abandonne
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dark Mode Toggle */}
          <div className="fixed bottom-4 right-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full p-3 ${darkMode ? "bg-purple-300 text-black" : "bg-purple-900 text-white"}`}
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
