// /src/app/components/templates/WritingGameTemplate.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "../Navbar";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import MoodSelector from '../MoodSelector';

export interface WritingEntry {
  id?: string;
  date: string;
  preview: string;
  wordCount?: number;
}

export interface GameConfig {
  title: string;
  subtitle: string;
  exerciseType: string;
  placeholderText: string;
  dailyWordGoalDefault: number;
  minWordsToSave: number;
  saveButtonText: string;
  successToastText: string;
  getProgressMessage: (current: number, goal: number) => string;
}

interface WritingGameTemplateProps {
  config: GameConfig;
  additionalControls?: React.ReactNode;
  customProgressBar?: React.ReactNode;
  beforeTextarea?: React.ReactNode;
  afterTextarea?: React.ReactNode;
}

export default function WritingGameTemplate({
  config,
  additionalControls,
  customProgressBar,
  beforeTextarea,
  afterTextarea
}: WritingGameTemplateProps) {
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entries, setEntries] = useState<WritingEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyWordGoal, setDailyWordGoal] = useState(config.dailyWordGoalDefault);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [shake, setShake] = useState(false);

  const shakeVariants = {
    initial: { x: 0 },
    shake: {
      x: [0, -50, 50, -50, 50, 0],
      transition: { duration: 0.6 }
    }
  };

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  // Récupérer les réglages de l'utilisateur
  useEffect(() => {
    const fetchSettings = async () => {
      if (status !== "authenticated" || !session?.user?.email) return;
      try {
        const response = await fetch('/api/user/settings');
        if (!response.ok) throw new Error('Erreur lors de la récupération des réglages');
        const data = await response.json();
        setDailyWordGoal(data.dailyWordGoal || config.dailyWordGoalDefault);
      } catch (error) {
        console.error("Erreur settings:", error);
      }
    };
    fetchSettings();
  }, [session, status, config.dailyWordGoalDefault]);

  // Calcul du nombre de mots et de la progression
  useEffect(() => {
    const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(count);
    setProgress(Math.min((count / dailyWordGoal) * 100, 100));
  }, [text, dailyWordGoal]);

  // Récupération des entrées précédentes
  useEffect(() => {
    const fetchEntries = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/writing/${config.exerciseType.toLowerCase()}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des entrées');
        
        const data = await response.json();
        
        // Formatage des données pour l'affichage
        const formattedEntries = data.entries.map((entry: any) => ({
          id: entry.id,
          date: format(new Date(entry.writingEntry.createdAt), "d MMMM", { locale: fr }),
          preview: entry.writingEntry.content.substring(0, 50) + "...",
          wordCount: entry.writingEntry.wordCount
        }));
        
        setEntries(formattedEntries);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Impossible de charger tes créations précédentes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [session, status, config.exerciseType]);

  const handleSave = async () => {
    // Si aucun texte n'est présent, focussez le textarea et déclenchez le shake
    if (text.trim().length === 0) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    
    if (status !== "authenticated") {
      toast.error("Tu dois être connecté pour sauvegarder ton chef-d'œuvre!");
      return;
    }
    
    if (wordCount < config.minWordsToSave) {
      toast.error(`Ton chef-d'œuvre semble un peu vide... Écris au moins ${config.minWordsToSave} mots !`);
      return;
    }
    
    // Ouvrir le sélecteur d'humeur avant de sauvegarder
    setIsMoodSelectorOpen(true);
  };
  
  // Fonction pour gérer la sauvegarde après la sélection de l'humeur
  const handleSaveWithMood = async (mood: { value: any; }) => {
    try {
      setIsSaving(true);
      
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const title = words.slice(0, 5).join(" ") + "...";
      
      const entryData = {
        wordCount,
        title,
        content: text,
        exerciseType: config.exerciseType,
        userMood: mood.value
      };
      
      const response = await fetch(`/api/writing/${config.exerciseType.toLowerCase()}`, {
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
      
      const newEntry = {
        id: result.id,
        date: format(new Date(), "d MMMM", { locale: fr }),
        preview: text.substring(0, 50) + "...",
        wordCount
      };
      
      setEntries([newEntry, ...entries]);
      toast.success(config.successToastText);
      setText("");
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Oups! Une erreur s'est produite lors de la sauvegarde. Réessaye!");
    } finally {
      setIsSaving(false);
      setIsMoodSelectorOpen(false);
    }
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
            {config.title}
            <br />
            <span className={`text-3xl ${darkMode ? "bg-teal-600" : "bg-black"} ${darkMode ? "text-white" : "text-teal-400"} px-4 py-2 inline-block rotate-2`}>
              {config.subtitle}
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
          {/* Writing Section */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${darkMode ? "text-teal-300" : "text-black"}`}>
                MON TEXTE
              </span>
              <span className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                MOTS: {wordCount}/{dailyWordGoal}
              </span>
            </div>
            
            {beforeTextarea}
            
            <motion.textarea
              ref={textareaRef}
              placeholder={config.placeholderText}
              value={text}
              onChange={(e) => setText(e.target.value)}
              variants={shakeVariants}
              animate={shake ? "shake" : "initial"}
              className={`w-full p-6 rounded-none text-lg border-4 ${darkMode ? "border-teal-600 bg-gray-800 text-white" : "border-black bg-white text-black"} ${isExpanded ? "h-96" : "h-64"} transition-all`}
            />
            
            {afterTextarea}
            
            <div className="flex justify-between mt-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-sm ${darkMode ? "text-teal-300" : "text-black"} font-bold underline`}
              >
                {isExpanded ? "Réduire l'espace" : "Plus d'espace pour créer"}
              </button>
              
              <span className={`text-sm ${darkMode ? "text-teal-300" : "text-gray-700"} font-bold`}>
                {config.getProgressMessage(wordCount, dailyWordGoal)}
              </span>
            </div>
            
            {additionalControls}
          </motion.div>

          {/* Progress Bar */}
          {customProgressBar || (
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
                      {Math.round(progress)}% DE LIBÉRATION
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

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
              disabled={isSaving}
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
                config.saveButtonText
              )}
            </motion.button>
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
        
        <MoodSelector
          isOpen={isMoodSelectorOpen}
          onClose={() => setIsMoodSelectorOpen(false)}
          onSelect={handleSaveWithMood}
          darkMode={darkMode}
        />
      </div>
    </>
  );
}