"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "../../../components/Navbar";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface FreeWriteEntry {
  id?: string;
  date: string;
  creativityLevel: string;
  preview: string;
  wordCount?: number;
}

// Fonction pour mapper le niveau de créativité à l'enum Prisma
const mapCreativityLevelToEnum = (emoji: string): string => {
  const emojiMap: Record<string, string> = {
    "🧠": "DEBUTANT",
    "✨": "INTERMEDIAIRE",
    "🎨": "AVANCE",
    "💡": "INTERMEDIAIRE",
    "🚀": "AVANCE"
  };
  
  return emojiMap[emoji] || "INTERMEDIAIRE";
};

export default function FreeWriteGame() {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [creativityLevel, setCreativityLevel] = useState("");
  const [freeWriteEntries, setFreeWriteEntries] = useState<FreeWriteEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  const creativityLevels = [
    { emoji: "🧠", name: "Génie en herbe", color: "bg-blue-400" },
    { emoji: "✨", name: "Étincelle créative", color: "bg-yellow-300" },
    { emoji: "🎨", name: "Artiste confirmé", color: "bg-indigo-300" },
    { emoji: "💡", name: "Idée lumineuse", color: "bg-green-400" },
    { emoji: "🚀", name: "Voyageur de l'imagination", color: "bg-purple-400" }
  ];

  useEffect(() => {
    const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(count);
    setProgress(Math.min((count / 1000) * 100, 100));
  }, [text]);

  // Récupération des entrées précédentes depuis la base de données
  useEffect(() => {
    const fetchEntries = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/writing/freewrite');
        if (!response.ok) throw new Error('Erreur lors de la récupération des entrées');
        
        const data = await response.json();
        
        // Formatage des données pour l'affichage
        const formattedEntries = data.entries.map((entry: any) => ({
          id: entry.id,
          date: format(new Date(entry.writingEntry.createdAt), "d MMMM", { locale: fr }),
          creativityLevel: getEmojiFromLevel(entry.creativityLevel),
          preview: entry.writingEntry.content.substring(0, 50) + "...",
          wordCount: entry.writingEntry.wordCount
        }));
        
        setFreeWriteEntries(formattedEntries);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Impossible de charger tes créations précédentes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [session, status]);

  // Fonction pour convertir le niveau de créativité de l'enum en emoji
  const getEmojiFromLevel = (level: string): string => {
    const levelMap: Record<string, string> = {
      "DEBUTANT": "🧠",
      "INTERMEDIAIRE": "✨",
      "AVANCE": "🚀"
    };
    
    return levelMap[level] || "✨";
  };

  const handleSave = async () => {
    if (status !== "authenticated") {
      toast.error("Tu dois être connecté pour sauvegarder ton chef-d'œuvre!");
      return;
    }
    
    if (creativityLevel === "") {
      toast.error("Choisis ton niveau de créativité avant de sauver ton chef-d'œuvre!");
      return;
    }
    
    if (wordCount === 0) {
      toast.error("Ton chef-d'œuvre semble un peu vide... Écris quelque chose!");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Création du titre à partir des premiers mots
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const title = words.slice(0, 5).join(" ") + "...";
      
      // Préparation des données à envoyer
      const entryData = {
        wordCount,
        title,
        content: text,
        exerciseType: "ECRITURE_LIBRE",
        creativityLevel: mapCreativityLevelToEnum(creativityLevel)
      };
      
      // Envoi des données à l'API
      const response = await fetch('/api/writing/freewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }
      
      const result = await response.json();
      
      // Ajout de la nouvelle entrée à la liste des entrées affichées
      const newEntry: FreeWriteEntry = {
        id: result.id,
        date: format(new Date(), "d MMMM", { locale: fr }),
        creativityLevel,
        preview: text.substring(0, 50) + "...",
        wordCount
      };
      
      setFreeWriteEntries([newEntry, ...freeWriteEntries]);
      
      // Mise à jour de l'état
      toast.success("👏 MAGNIFIQUE! Ta création est sauvegardée. Ton quotient de créativité vient de grimper de 20%!");
      
      // Réinitialisation du formulaire
      setText("");
      setCreativityLevel("");
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Oups! Une erreur s'est produite lors de la sauvegarde. Réessaye!");
    } finally {
      setIsSaving(false);
    }
  };

  const selectCreativityLevel = (selectedLevel: string) => {
    setCreativityLevel(selectedLevel);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-teal-400"}`}>
        <div className="absolute inset-0 bg-[url('/waves.svg')] opacity-20 pointer-events-none" />
        
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto pt-8 px-4"
        >
          <motion.div
            variants={itemVariants}
            className="text-5xl font-black mb-2 text-center transform -rotate-2"
            style={{ textShadow: darkMode ? "3px 3px 0px #4ADE80" : "3px 3px 0px #000" }}
          >
            ÉCRITURE LIBRE
            <br />
            <span className={`text-3xl ${darkMode ? "bg-teal-600" : "bg-black"} ${darkMode ? "text-white" : "text-teal-400"} px-4 py-2 inline-block rotate-2`}>
              Libère ton cerveau et booste ta créativité sans limites!
            </span>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="text-center mb-6"
          >
            <span className={`inline-block ${darkMode ? "bg-gray-800" : "bg-white"} px-4 py-2 font-bold border-2 ${darkMode ? "border-teal-600" : "border-black"} transform rotate-2`}>
              {today}
            </span>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Creativity Level Selection */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-2">
              <motion.h3 
                className={`inline-block ${darkMode ? "bg-teal-600" : "bg-black"} ${darkMode ? "text-white" : "text-teal-400"} px-4 py-2 font-bold transform rotate-2`}
              >
                Quel niveau de créativité dégages-tu aujourd'hui?
              </motion.h3>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {creativityLevels.map((level, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectCreativityLevel(level.emoji)}
                  className={`${darkMode ? "bg-teal-600 hover:bg-teal-500" : "bg-black hover:bg-gray-800"} text-white px-4 py-2 font-bold transform ${Math.random() > 0.5 ? "rotate-2" : "-rotate-2"} border-2 ${darkMode ? "border-teal-600" : "border-black"} ${creativityLevel === level.emoji ? 'ring-4 ring-white' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level.emoji} {level.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Writing Section */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${darkMode ? "text-teal-300" : "text-black"}`}>
                MON ÉCRIN CRÉATIF {creativityLevel && <span className="text-2xl ml-2">{creativityLevel}</span>}
              </span>
              <span className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                MOTS: {wordCount}/1000
              </span>
            </div>
            
            <textarea
              placeholder="Lâche tout ce que ton cerveau invente ici... Chaque mot te rapproche de l'illumination créative!"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full p-6 rounded-none text-lg border-4 ${darkMode ? "border-teal-600 bg-gray-800 text-white" : "border-black bg-white text-black"} ${isExpanded ? "h-96" : "h-64"} transition-all`}
            ></textarea>
            
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-sm ${darkMode ? "text-teal-300" : "text-black"} font-bold underline`}
              >
                {isExpanded ? "Réduire l'espace" : "Plus d'espace pour créer"}
              </button>
              
              <span className={`text-sm ${darkMode ? "text-teal-300" : "text-gray-700"} font-bold`}>
                {wordCount >= 1000 ? "👑 Tu es roi/reine de la créativité!" : `Encore ${1000 - wordCount} mots pour ton chef-d'œuvre`}
              </span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} h-6 border-2 ${darkMode ? "border-teal-600" : "border-black"}`}>
              <motion.div
                className={`h-full ${progress >= 100 ? (darkMode ? "bg-green-500" : "bg-green-500") : (darkMode ? "bg-teal-600" : "bg-teal-600")}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              >
                {progress >= 30 && (
                  <div className="text-center text-white font-bold text-sm py-0.5">
                    {Math.round(progress)}% DE CRÉATIVITÉ LIBÉRÉE
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleSave}
              className={`${darkMode ? "bg-teal-600 hover:bg-teal-500" : "bg-black hover:bg-teal-500 hover:text-white"} ${darkMode ? "text-white" : "text-teal-400"} px-8 py-4 text-xl font-black border-4 ${darkMode ? "border-teal-600 hover:border-teal-500" : "border-black"} transition-all relative`}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={wordCount === 0 || isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SAUVEGARDE EN COURS...
                </span>
              ) : wordCount === 0 ? (
                "COMMENCE À CRÉER!"
              ) : (
                "SAUVEGARDER TON CHEF-D'ŒUVRE 🎉"
              )}
            </motion.button>
          </motion.div>

          {/* Previous Entries */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <h3 className={`font-bold mb-4 text-center ${darkMode ? "text-teal-300" : "text-black"}`}>PRÉCÉDENTES CRÉATIONS</h3>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : freeWriteEntries.length === 0 ? (
              <div className={`text-center p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border-2 ${darkMode ? "border-teal-600" : "border-black"}`}>
                <p className="font-bold mb-2">Pas encore de créations sauvegardées.</p>
                <p>C'est le moment parfait pour libérer ton génie créatif!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {freeWriteEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 ${darkMode ? "bg-gray-800 border-teal-600" : "bg-white border-black"} border-2 transform ${index % 2 === 0 ? "rotate-2" : "-rotate-2"}`}
                    whileHover={{ scale: 1.03, rotate: 0 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{entry.date}</span>
                      <span className="text-2xl">{entry.creativityLevel}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {entry.preview}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {entry.wordCount} mots
                      </span>
                      <button className={`text-sm font-bold ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                        Lire plus...
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Mode Switch */}
          <div className="fixed bottom-4 right-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full p-3 ${darkMode ? "bg-teal-400 text-black" : "bg-gray-900 text-white"}`}
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