"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Share2, BookOpen, Filter, Plus, Brain, Zap, AlertTriangle, DollarSign } from "lucide-react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Interface pour les écritures
interface WritingEntry {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  exerciseType: "JOURNAL_INTIME" | "ECRITURE_LIBRE" | "PROMPT_WRITING" | "COLLABORATIVE_WRITING";
  createdAt: string;
  userMood?: string;
}

export default function MyLibrary() {
  const router = useRouter();
  const [writings, setWritings] = useState<WritingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<WritingEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPublishPrompt, setShowPublishPrompt] = useState(false);

  useEffect(() => {
    const fetchWritings = async () => {
      setLoading(true);
      try {
        // Simuler une API call - à remplacer par votre vrai endpoint
        const response = await fetch('/api/writing-entries');
        
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        const data = await response.json();
        setWritings(data.writings);
      } catch (error) {
        console.error("Erreur lors de la récupération des écrits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWritings();
  }, []);

  // Animation variants
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
      transition: { duration: 0.4 }
    }
  };

  // Filtrage des écrits
  const filteredWritings = writings.filter(writing => {
    // Filtre par type d'exercice
    const typeMatch = selectedType ? writing.exerciseType === selectedType : true;
    
    // Filtre par recherche (titre)
    const searchMatch = writing.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  // Traduction des types d'exercices pour l'affichage
  const getExerciseTypeName = (type: string) => {
    switch(type) {
      case "JOURNAL_INTIME": return "Journal Intime";
      case "ECRITURE_LIBRE": return "Écriture Libre";
      case "PROMPT_WRITING": return "Prompt Writing";
      case "COLLABORATIVE_WRITING": return "Écriture Collaborative";
      default: return type;
    }
  };

  // Couleurs par type d'exercice
  const getExerciseColor = (type: string) => {
    switch(type) {
      case "JOURNAL_INTIME": return "bg-pink-400";
      case "ECRITURE_LIBRE": return "bg-blue-400";
      case "PROMPT_WRITING": return "bg-green-400";
      case "COLLABORATIVE_WRITING": return "bg-purple-400";
      default: return "bg-gray-300";
    }
  };

  // Emojis par type d'exercice
  const getExerciseEmoji = (type: string) => {
    switch(type) {
      case "JOURNAL_INTIME": return "📔";
      case "ECRITURE_LIBRE": return "✍️";
      case "PROMPT_WRITING": return "💡";
      case "COLLABORATIVE_WRITING": return "👥";
      default: return "📝";
    }
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Gérer la suppression
  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      try {
        const response = await fetch(`/api/writing-entries/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }
        
        // Retirer l'entrée de l'état local
        setWritings(prev => prev.filter(writing => writing.id !== id));
        setConfirmDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  // Gérer le partage
  const handleShare = async (writing: WritingEntry) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: writing.title,
          text: `Découvre ce que j'ai écrit: "${writing.title}"`,
          url: `${window.location.origin}/shared-writing/${writing.id}`,
        });
      } catch (error) {
        console.error("Erreur lors du partage:", error);
      }
    } else {
      // Fallback pour navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(`${window.location.origin}/shared-writing/${writing.id}`);
      alert("Lien copié dans le presse-papier !");
    }
  };

  // Vue détaillée d'un écrit
  const DetailView = () => {
    if (!detailView) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <motion.div 
          className="bg-white border-4 border-black p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          style={{ boxShadow: "8px 8px 0px #000" }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className={`inline-block px-3 py-1 ${getExerciseColor(detailView.exerciseType)} border-2 border-black text-sm font-bold mb-2 transform -rotate-1`}>
                {getExerciseEmoji(detailView.exerciseType)} {getExerciseTypeName(detailView.exerciseType)}
              </div>
              <h2 className="text-3xl font-black">{detailView.title || "Sans titre"}</h2>
              <p className="text-sm font-bold mt-1">
                {formatDate(detailView.createdAt)} • {detailView.wordCount} mots
                {detailView.userMood && ` • Humeur: ${detailView.userMood}`}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDetailView(null)}
              className="bg-black text-white font-bold px-3 py-1"
            >
              X
            </motion.button>
          </div>
          
          <div className="prose max-w-none border-4 border-black p-4 bg-yellow-50 mb-6" 
            style={{ minHeight: "300px" }}>
            {detailView.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare(detailView)}
                className="flex items-center gap-2 bg-blue-400 border-4 border-black px-4 py-2 font-black"
              >
                <Share2 size={20} />
                PARTAGER
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(detailView.id)}
                className="flex items-center gap-2 bg-red-400 border-4 border-black px-4 py-2 font-black"
              >
                <Trash2 size={20} />
                {confirmDelete === detailView.id ? "CONFIRMER" : "SUPPRIMER"}
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDetailView(null);
                setShowPublishPrompt(true);
              }}
              className="flex items-center gap-2 bg-green-400 border-4 border-black px-4 py-2 font-black"
            >
              <DollarSign size={20} />
              MONÉTISER
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Popup pour la monétisation
  const PublishPrompt = () => {
    if (!showPublishPrompt) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
      >
        <motion.div 
          className="bg-white border-4 border-black p-6 w-full max-w-2xl"
          style={{ boxShadow: "8px 8px 0px #000" }}
          initial={{ scale: 0.9, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
        >
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPublishPrompt(false)}
              className="bg-black text-white font-bold px-3 py-1"
            >
              X
            </motion.button>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-4xl font-black mb-4 transform -rotate-1">
              <span className="bg-yellow-300 px-4 py-2 inline-block">
                DEVIENS UN ÉCRIVAIN RICHE
              </span>
            </h2>
            <p className="text-lg font-bold">
              Et si ton écriture servait à autre chose qu'à faire grossir ton cerveau ?
            </p>
          </div>
          
          <div className="bg-pink-100 border-4 border-black p-4 mb-6">
            <h3 className="text-xl font-black mb-2">🚀 PUBLIE SUR INLEO</h3>
            <p className="font-bold">
              Des milliers de lecteurs attendent TES histoires. Nos écrivains gagnent en moyenne 247€ par mois.*
            </p>
            <p className="text-sm italic mt-2">*Cerveaux les plus productifs uniquement. La moyenne réelle est de 17€.</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowPublishPrompt(false);
                // Rediriger vers InLeo (à implémenter)
                window.open("https://inleo.com/publish", "_blank");
              }}
              className="bg-black text-white font-black text-xl px-6 py-3 border-4 border-black"
            >
              DEVENIR RICHE →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPublishPrompt(false)}
              className="bg-white text-black font-black text-xl px-6 py-3 border-4 border-black"
            >
              JE PRÉFÈRE RESTER PAUVRE
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Stats rapides en haut avec placeholders de chargement
  const StatsHeader = () => {
    const totalWords = writings.reduce((sum, writing) => sum + writing.wordCount, 0);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {loading ? (
          // Placeholders de chargement pour les stats
          <>
            <motion.div 
              className="bg-white bg-opacity-10 border-4 border-black p-4 text-center animate-pulse"
              style={{ boxShadow: "5px 5px 0px #000" }}
            >
              <div className="h-10 bg-gray-300 mb-2 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/2 mx-auto rounded"></div>
            </motion.div>
            <motion.div 
              className="bg-white bg-opacity-10 border-4 border-black p-4 text-center animate-pulse"
              style={{ boxShadow: "5px 5px 0px #000" }}
            >
              <div className="h-10 bg-gray-300 mb-2 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/2 mx-auto rounded"></div>
            </motion.div>
          </>
        ) : (
          // Stats réelles
          <>
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="bg-pink-400 border-4 border-black p-4 text-center"
              style={{ boxShadow: "5px 5px 0px #000" }}
            >
              <div className="text-4xl font-black mb-2">{writings.length}</div>
              <div className="font-bold">TEXTES</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="bg-blue-400 border-4 border-black p-4 text-center"
              style={{ boxShadow: "5px 5px 0px #000" }}
            >
              <div className="text-4xl font-black mb-2">{totalWords.toLocaleString()}</div>
              <div className="font-bold">MOTS ÉCRITS</div>
            </motion.div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-yellow-300">
      <Navbar />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

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
              MA BIBLIOTHÈQUE CÉRÉBRALE
            </span>
          </h1>
          <p className="text-2xl font-bold bg-blue-400 text-black px-6 py-3 transform rotate-1 inline-block border-4 border-black mb-8">
            🧠 L'ÉVIDENCE DE TON GÉNIE EN PIXELS
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Quick Stats */}
          <StatsHeader />
          
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 bg-white border-4 border-black p-6"
            style={{ boxShadow: "8px 8px 0px #000" }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="CHERCHER DANS TON GÉNIE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-4 border-black p-3 pr-12 text-lg font-bold focus:bg-pink-100 focus:outline-none"
                />
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2" size={24} />
              </div>

              {/* New Writing Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="bg-black text-white px-6 py-3 font-black text-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                NOUVEL ÉCRIT
              </motion.button>
            </div>
            
            {/* Filtres */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1 font-black border-2 border-black ${!selectedType ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-100'}`}
              >
                TOUS
              </button>
              
              {/* Générer les boutons de filtre dynamiquement à partir des types d'exercices disponibles */}
              {Array.from(new Set(writings.map(writing => writing.exerciseType))).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 font-black border-2 border-black ${selectedType === type ? getExerciseColor(type) : `bg-white hover:${getExerciseColor(type).replace('bg-', 'bg-').replace('400', '100')}`}`}
                >
                  {getExerciseEmoji(type)} {getExerciseTypeName(type).toUpperCase().split('_').join(' ')}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Library Grid */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block text-6xl mb-4"
              >
                📚
              </motion.div>
              <p className="text-2xl font-black">CHARGEMENT DE TON GÉNIE LITTÉRAIRE...</p>
            </div>
          ) : (
            <>
              {filteredWritings.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 gap-6"
                >
                  {filteredWritings.map((writing) => (
                    <motion.div
                      key={writing.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, rotate: Math.random() > 0.5 ? 0.7 : -0.7 }}
                      className="bg-white border-4 border-black p-4 flex flex-col h-full"
                      style={{ boxShadow: "5px 5px 0px #000" }}
                    >
                      <div className="flex justify-between mb-3">
                        <div className={`px-3 py-1 ${getExerciseColor(writing.exerciseType)} border-2 border-black text-sm font-bold transform -rotate-1`}>
                          {getExerciseEmoji(writing.exerciseType)} {getExerciseTypeName(writing.exerciseType)}
                        </div>
                        <div className="text-sm font-bold">{formatDate(writing.createdAt)}</div>
                      </div>
                      
                      <h3 className="text-xl font-black mb-3">
                        {writing.title || "Sans titre"}
                      </h3>
                      
                      <div className="bg-yellow-50 border-2 border-black p-3 mb-4 flex-grow max-h-32 overflow-hidden relative">
                        <div className="line-clamp-3">
                          {writing.content}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-50 to-transparent"></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <div className="text-sm font-bold">
                          {writing.wordCount} mots
                          {writing.userMood && ` • Humeur: ${writing.userMood}`}
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShare(writing)}
                            className="p-2 bg-blue-100 border-2 border-black"
                            title="Partager"
                          >
                            <Share2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDetailView(writing)}
                            className="p-2 bg-green-100 border-2 border-black"
                            title="Lire"
                          >
                            <BookOpen size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(writing.id)}
                            className={`p-2 ${confirmDelete === writing.id ? 'bg-red-400' : 'bg-red-100'} border-2 border-black`}
                            title={confirmDelete === writing.id ? 'Confirmer la suppression' : 'Supprimer'}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white border-4 border-black"
                  style={{ boxShadow: "8px 8px 0px #000" }}
                >
                  {selectedType || searchQuery ? (
                    <>
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-black mb-2">AUCUN ÉCRIT TROUVÉ</h3>
                      <p className="font-bold">Ton génie est peut-être ailleurs...</p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-2xl font-black mb-2">TON CERVEAU EST VIDE</h3>
                      <p className="font-bold mb-6">Il est temps de nourrir tes neurones avec des mots !</p>
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/new-writing')}
                        className="bg-black text-white px-6 py-3 font-black text-lg inline-flex items-center gap-2"
                      >
                        <Plus size={20} />
                        PREMIER ÉCRIT
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </>
          )}

          {/* Motivation Banner avec placeholder de chargement */}
          {writings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-pink-400 border-4 border-black p-6 text-center transform -rotate-1"
              style={{ boxShadow: "8px 8px 0px #000" }}
            >
              {loading ? (
                // Placeholder de chargement pour la bannière de motivation
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 w-3/4 mx-auto mb-4 rounded"></div>
                  <div className="h-6 bg-gray-300 w-1/2 mx-auto mb-6 rounded"></div>
                  <div className="h-12 bg-gray-300 w-40 mx-auto rounded"></div>
                </div>
              ) : (
                // Contenu réel
                <>
                  <h3 className="text-2xl font-black mb-4">
                    <Zap className="inline-block mr-2" size={24} />
                    TU ES À {Math.min(100, Math.floor((writings.length / 30) * 100))}% DU NIVEAU EINSTEIN
                  </h3>
                  <p className="font-bold text-lg mb-6">
                    {writings.length < 10 ? 
                      "Continue d'écrire pour transformer ton cerveau en supercalculateur !" :
                      "Tu es un mutant cérébral en devenir, persévère !"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/new-writing')}
                    className="bg-black text-white font-black text-xl py-3 px-8 border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
                  >
                    <Brain className="inline-block mr-2" size={20} />
                    ÉCRIRE ENCORE →
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-sm font-bold flex items-center justify-center">
              <AlertTriangle size={16} className="mr-2" />
              En supprimant une entrée, tu perds 0.5% de capacité cérébrale. Sois prudent.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      {detailView && <DetailView />}
      {showPublishPrompt && <PublishPrompt />}
    </div>
  );
}