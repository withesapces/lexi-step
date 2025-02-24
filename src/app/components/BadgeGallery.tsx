// /src/components/BadgeGallery.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Badge = {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  category?: string;
};

type CategoryBadges = {
  name: string;
  icon: string;
  badges: Badge[];
};

const BadgeGallery = ({ badges }: { badges: Badge[] }) => {
  // Créer les catégories à partir des badges récupérés de la BDD
  const getBadgeCategories = (): CategoryBadges[] => {
    // Récupérer toutes les catégories uniques des badges
    const categories = new Set(badges.map(badge => badge.category || "Autres"));
    
    // Mapper les icônes aux catégories (en fonction de votre logique métier)
    const categoryIcons: Record<string, string> = {
      "streak": "🔥",
      "words_total": "✍️",
      "words_week": "🎯",
      "topics": "🧐", 
      "no_errors": "🥷",
      "novel": "📚",
      "Autres": "🏆"
    };
    
    // Créer les groupes de badges par catégorie
    return Array.from(categories).map(category => ({
      name: category,
      icon: categoryIcons[category] || "🏆",
      badges: badges.filter(badge => (badge.category || "Autres") === category)
    })).sort((a, b) => {
      // Mettre la catégorie "Autres" à la fin
      if (a.name === "Autres") return 1;
      if (b.name === "Autres") return -1;
      return a.name.localeCompare(b.name);
    });
  };

  const categories = getBadgeCategories();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.name || "");
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const badgesPerPage = 6; // Nombre de badges par page

  const filteredBadges = (categoryBadges: Badge[]) => {
    switch (filter) {
      case "earned":
        return categoryBadges.filter(badge => badge.earned);
      case "locked":
        return categoryBadges.filter(badge => !badge.earned);
      default:
        return categoryBadges;
    }
  };

  // Compteur de badges débloqués
  const earnedCount = badges.filter(badge => badge.earned).length;
  const totalBadges = badges.length;
  const progressPercentage = Math.round((earnedCount / totalBadges) * 100);

  // Obtenir les badges actuels pour la pagination
  const getCurrentBadges = (badges: Badge[]) => {
    const filteredBadgesList = filteredBadges(badges);
    const indexOfLastBadge = currentPage * badgesPerPage;
    const indexOfFirstBadge = indexOfLastBadge - badgesPerPage;
    return filteredBadgesList.slice(indexOfFirstBadge, indexOfLastBadge);
  };

  // Calculer le nombre total de pages pour la catégorie active
  const getCurrentCategory = () => {
    return categories.find(cat => cat.name === activeCategory);
  };
  
  const totalPages = () => {
    const currentCategory = getCurrentCategory();
    if (!currentCategory) return 1;
    
    const filteredBadgesList = filteredBadges(currentCategory.badges);
    return Math.ceil(filteredBadgesList.length / badgesPerPage);
  };

  // Réinitialiser la page à 1 lorsque la catégorie ou le filtre change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, filter]);

  // Fonction pour traduire les noms de catégories pour l'affichage
  const translateCategoryName = (categoryName: string): string => {
    const translations: Record<string, string> = {
      "streak": "Régularité",
      "words_total": "Écriture",
      "words_week": "Objectifs",
      "topics": "Thèmes",
      "no_errors": "Perfection", 
      "novel": "Projets",
      "Autres": "Autres"
    };
    
    return translations[categoryName] || categoryName;
  };

  return (
    <div className="w-full">
      {/* Jauge de progression globale */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-xl">PROGRESSION DES BADGES</span>
          <span className="bg-black text-white font-black px-2 py-1">
            {earnedCount} / {totalBadges}
          </span>
        </div>
        <div className="w-full h-8 bg-white border-4 border-black">
          <div 
            className="h-full bg-green-400 transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage >= 10 && (
              <span className="absolute inset-0 flex items-center justify-center font-black text-black">
                {progressPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {["all", "earned", "locked"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as "all" | "earned" | "locked")}
              className={`px-4 py-2 font-bold border-2 border-black transform ${
                filter === option
                  ? "bg-black text-white rotate-0"
                  : "bg-white text-black hover:bg-yellow-300 -rotate-1"
              }`}
            >
              {option === "all" ? "TOUS" : option === "earned" ? "DÉBLOQUÉS" : "À DÉBLOQUER"}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation des catégories */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.05, rotate: Math.random() < 0.5 ? 1 : -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 font-bold whitespace-nowrap border-2 border-black ${
                activeCategory === category.name
                  ? "bg-black text-white"
                  : "bg-white hover:bg-yellow-300"
              }`}
            >
              {category.icon} {translateCategoryName(category.name).toUpperCase()}
              <span className="ml-2 bg-white text-black px-2 rounded-full text-sm">
                {category.badges.filter(b => b.earned).length}/{category.badges.length}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Affichage des badges */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + filter + currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {categories
            .filter(cat => cat.name === activeCategory)
            .map(category => {
              const currentBadges = getCurrentBadges(category.badges);
              const currentTotalPages = totalPages();
              const hasMultiplePages = currentTotalPages > 1;
              
              return (
                <div key={category.name} className="space-y-6">
                  {filteredBadges(category.badges).length === 0 ? (
                    <div className="text-center py-8 border-4 border-dashed border-black bg-gray-100">
                      <p className="text-xl font-black">
                        {filter === "earned" ? "PAS ENCORE DE BADGE DÉBLOQUÉ DANS CETTE CATÉGORIE" : 
                         filter === "locked" ? "TOUS LES BADGES SONT DÉBLOQUÉS DANS CETTE CATÉGORIE!" : 
                         "AUCUN BADGE DANS CETTE CATÉGORIE"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {currentBadges.map((badge) => (
                          <motion.div
                            key={badge.id}
                            whileHover={badge.earned ? { scale: 1.03, rotate: badge.id.charCodeAt(0) % 2 === 0 ? 1 : -1 } : {}}
                            className={`p-4 border-4 border-black text-center ${
                              badge.earned ? "bg-white" : "bg-gray-200 grayscale"
                            }`}
                          >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h3 className="text-lg font-black mb-1">{badge.name}</h3>
                            <p className="text-sm font-bold">
                              {badge.description}
                            </p>
                            {!badge.earned && (
                              <div className="mt-2 bg-black text-white py-1 px-2 inline-block text-xs font-black transform -rotate-2">
                                À DÉBLOQUER
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {hasMultiplePages && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border-2 border-black font-bold ${
                              currentPage === 1 
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                                : "bg-white hover:bg-yellow-300 transform hover:-rotate-1"
                            }`}
                          >
                            ←
                          </button>
                          
                          {Array.from({ length: currentTotalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 border-2 border-black font-bold ${
                                currentPage === page
                                  ? "bg-black text-white"
                                  : "bg-white hover:bg-yellow-300 transform hover:rotate-1"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, currentTotalPages))}
                            disabled={currentPage === currentTotalPages}
                            className={`px-3 py-1 border-2 border-black font-bold ${
                              currentPage === currentTotalPages 
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                                : "bg-white hover:bg-yellow-300 transform hover:rotate-1"
                            }`}
                          >
                            →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BadgeGallery;