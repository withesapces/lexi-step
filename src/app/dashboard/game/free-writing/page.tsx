"use client";

import { useState, useEffect } from "react";
import WritingGameTemplate from "../../../components/templates/WritingGameTemplate";
import { motion } from "framer-motion";

export default function FreeWriteGame() {
  const [showTips, setShowTips] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Effect to trigger button animation after 5 seconds
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setShouldAnimate(true);
      
      // Stop the animation after 10 seconds
      const stopAnimationTimer = setTimeout(() => {
        setShouldAnimate(false);
      }, 10000);
      
      return () => clearTimeout(stopAnimationTimer);
    }, 5000);
    
    return () => clearTimeout(animationTimer);
  }, []);

  // Configuration spécifique pour le mode d'écriture libre
  const gameConfig = {
    title: "MODE ZEN",
    subtitle: "Guérison par les mots",
    exerciseType: "FREEWRITE",
    placeholderText: "Laisse couler tes pensées et émotions sans filtre...",
    dailyWordGoalDefault: 200,
    minWordsToSave: 200,
    saveButtonText: "LIBÈRE TON ESPRIT 🧠✨",
    successToastText: "👏 BRAVO! Tu viens de faire quelque chose de bon pour ta santé mentale.",
    getProgressMessage: (current: number, goal: number) => {
      return current >= goal
        ? "🌈 Sensation de bien-être débloquée!"
        : `Encore ${goal - current} mots pour ressentir les bienfaits`;
    }
  };

  // Composant pour afficher les conseils et bienfaits
  const ZenBenefits = () => (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showTips ? 1 : 0, height: showTips ? "auto" : 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 overflow-hidden"
    >
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-teal-600 p-4">
        <h3 className="font-bold text-center mb-3 dark:text-white">LES BIENFAITS DE L'ÉCRITURE ZEN</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">🧠</span>
            <span className="dark:text-white">Réduit l'anxiété et le stress en donnant un sens à ton vécu</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💤</span>
            <span className="dark:text-white">Améliore la qualité du sommeil</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💪</span>
            <span className="dark:text-white">Renforce ta "mémoire de travail" et facilite l'apprentissage</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">❤️</span>
            <span className="dark:text-white">Régule la tension, le rythme cardiaque et la respiration</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🔄</span>
            <span className="dark:text-white">Effet cathartique: transforme les émotions négatives</span>
          </li>
        </ul>
        
        <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-600">
          <h4 className="font-bold text-center mb-2 dark:text-white">CONSEILS POUR BIEN COMMENCER</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">⏱️</span>
              <span className="dark:text-white">Écris sans t'arrêter pendant 10-15 minutes minimum</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🚫</span>
              <span className="dark:text-white">Ne te soucie pas de la grammaire ou des fautes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌱</span>
              <span className="dark:text-white">Commence par "Aujourd'hui, je ressens..." si tu es bloqué(e)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔒</span>
              <span className="dark:text-white">Rappelle-toi que ce texte est privé et pour toi seul(e)</span>
            </li>
          </ul>
        </div>
        
        <p className="mt-3 text-sm italic text-center dark:text-white">Écrire 20 minutes plusieurs fois par semaine peut changer ta vie</p>
      </div>
    </motion.div>
  );

  // Animation variants for the InfoButton
  const buttonVariants = {
    idle: { scale: 1 },
    wiggle: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, 5, -5, 3, 0],
      transition: {
        duration: 0.8,
        repeat: 3,
        repeatType: "reverse" as const
      }
    }
  };

  // Icône d'information flottante avec meilleure visibilité
  const InfoButton = () => (
    <motion.button
      onClick={() => setShowTips(!showTips)}
      className="fixed right-4 bottom-20 z-10 rounded-full bg-white dark:bg-teal-600 text-teal-600 dark:text-white w-12 h-12 flex items-center justify-center shadow-lg border-2 border-teal-600 dark:border-white"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      variants={buttonVariants}
      animate={shouldAnimate ? "wiggle" : "idle"}
      title="Pourquoi l'écriture fait du bien?"
    >
      {showTips ? "❌" : "ℹ️"}
    </motion.button>
  );

  return (
    <>
      <InfoButton />
      <WritingGameTemplate 
        config={gameConfig}
        beforeTextarea={
          <>
            <ZenBenefits />
          </>
        }
      />
    </>
  );
}