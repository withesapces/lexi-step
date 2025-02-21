import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Mood {
    emoji: string;
    label: string;
    value: string;
  }
  
  interface MoodSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (mood: Mood) => void;
    darkMode?: boolean;
  }
  

const moods = [
  { emoji: "😊", label: "Joyeux", value: "happy" },
  { emoji: "😌", label: "Détendu", value: "relaxed" },
  { emoji: "🤔", label: "Pensif", value: "thoughtful" },
  { emoji: "😔", label: "Triste", value: "sad" },
  { emoji: "😤", label: "Frustré", value: "frustrated" },
  { emoji: "😴", label: "Fatigué", value: "tired" },
  { emoji: "🥳", label: "Excité", value: "excited" },
  { emoji: "😎", label: "Confiant", value: "confident" }
];

export default function MoodSelector({
    isOpen,
    onClose,
    onSelect,
    darkMode = false,
  }: MoodSelectorProps) {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  
    const handleMoodSelect = (mood: Mood) => {
      setSelectedMood(mood);
      onSelect(mood);
      onClose();
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
  
              <div className="text-center mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Comment te sens-tu après cette séance d'écriture?
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Choisis l'emoji qui représente le mieux ton humeur
                </p>
              </div>
  
              <div className="grid grid-cols-4 gap-4">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      darkMode
                        ? 'hover:bg-gray-700 focus:bg-gray-700'
                        : 'hover:bg-gray-100 focus:bg-gray-100'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div
                      className={`text-xs font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {mood.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  