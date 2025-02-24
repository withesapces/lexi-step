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
  // Création des catégories à partir des badges
  const getBadgeCategories = (): CategoryBadges[] => {
    const categories = new Set(badges.map(badge => badge.category || "Autres"));
    
    const categoryIcons: Record<string, string> = {
      "streak": "🔥",
      "words_total": "✍️",
      "words_week": "🎯",
      "topics": "🧐", 
      "no_errors": "🥷",
      "novel": "📚",
      "Autres": "🏆"
    };
    
    return Array.from(categories).map(category => ({
      name: category,
      icon: categoryIcons[category] || "🏆",
      badges: badges.filter(badge => (badge.category || "Autres") === category)
    })).sort((a, b) => {
      if (a.name === "Autres") return 1;
      if (b.name === "Autres") return -1;
      return a.name.localeCompare(b.name);
    });
  };

  const categories = getBadgeCategories();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.name || "");

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const badgesPerPage = 6; // Nombre de badges par page

  // Utiliser directement la liste des badges sans filtre
  const getCurrentBadges = (badges: Badge[]) => {
    const indexOfLastBadge = currentPage * badgesPerPage;
    const indexOfFirstBadge = indexOfLastBadge - badgesPerPage;
    return badges.slice(indexOfFirstBadge, indexOfLastBadge);
  };

  // Obtenir la catégorie active
  const getCurrentCategory = () => {
    return categories.find(cat => cat.name === activeCategory);
  };
  
  const totalPages = () => {
    const currentCategory = getCurrentCategory();
    if (!currentCategory) return 1;
    return Math.ceil(currentCategory.badges.length / badgesPerPage);
  };

  // Réinitialiser la page à 1 lorsque la catégorie change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Traduction des noms de catégories pour l'affichage
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

  // Calcul de la progression globale
  const earnedCount = badges.filter(badge => badge.earned).length;
  const totalBadges = badges.length;
  const progressPercentage = Math.round((earnedCount / totalBadges) * 100);

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
          key={activeCategory + currentPage}
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
                  {category.badges.length === 0 ? (
                    <div className="text-center py-8 border-4 border-dashed border-black bg-gray-100">
                      <p className="text-xl font-black">AUCUN BADGE DANS CETTE CATÉGORIE</p>
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
