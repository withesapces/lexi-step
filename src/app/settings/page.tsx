// /src/app/settings/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { AVAILABLE_AVATARS, Avatar, generateDiceBearAvatar } from "../../config/avatars";
import BadgeGallery from "../components/BadgeGallery";
import StyledMoodTracker from "../components/moodboard";
import { SubscriptionButton } from 'src/app/components/SubscriptionButton';
import { getUserSubscriptionPlan } from "@/lib/subscription";


interface Stat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface StatCardPopupProps {
  stat: Stat | null;
  isOpen: boolean;
  onClose: () => void;
}

const StatCardPopup = ({ stat, isOpen, onClose }: StatCardPopupProps) => {
  if (!isOpen || !stat) return null;
  
  // Définition du contenu spécifique à chaque type de statistique
  const getPopupContent = () => {
    switch(stat.label) {
      case "NIVEAU CÉRÉBRAL":
        return {
          icon: "🧠",
          title: "TON CERVEAU EST ÉNORME",
          description: "Le niveau cérébral mesure ta production totale d'écriture.",
          details: [
            { label: "DÉBUTANT", value: "0 - 5 000 mots", description: "Ton cerveau commence à peine à s'échauffer." },
            { label: "INTERMÉDIAIRE", value: "5 000 - 10 000 mots", description: "Tu développes de nouvelles connexions neuronales." },
            { label: "AVANCÉ", value: "10 000 - 20 000 mots", description: "Ton cortex préfrontal s'illumine comme un sapin de Noël." },
            { label: "PRO", value: "20 000 - 50 000 mots", description: "La NASA s'intéresse à ton activité cérébrale." },
            { label: "GÉNIE", value: "50 000 - 100 000 mots", description: "Einstein serait jaloux de tes capacités." },
            { label: "LÉGENDAIRE", value: "100 000+ mots", description: "Ton cerveau pourrait alimenter une petite ville en électricité." }
          ],
          currentValue: stat.value,
          tip: "Écris régulièrement pour développer ton cerveau encore plus rapidement !"
        };
      case "NIVEAU FLUIDITÉ":
        return {
          icon: "💧",
          title: "TA PLUME COULE COMME...",
          description: "La fluidité mesure ta cadence quotidienne d'écriture en moyenne.",
          details: [
            { label: "RUISSEAU", value: "0 - 400 mots/jour", description: "Un gentil filet d'eau qui commence son parcours." },
            { label: "RIVIÈRE", value: "400 - 800 mots/jour", description: "Un flux constant et impressionnant." },
            { label: "TORRENT", value: "800+ mots/jour", description: "Rien ne peut arrêter ton flux d'écriture." }
          ],
          currentValue: stat.value,
          tip: "Essaie d'écrire à la même heure chaque jour pour améliorer ta fluidité !"
        };
      case "NIVEAU CONSTANCE":
        return {
          icon: "📅",
          title: "LA RÉGULARITÉ FAIT LE MAÎTRE",
          description: "La constance mesure combien de jours consécutifs tu as écrit.",
          details: [
            { label: "OCCASIONNEL", value: "0 - 14 jours", description: "Tu viens quand ça te chante." },
            { label: "RÉGULIER", value: "14 - 30 jours", description: "Tu as adopté une belle routine." },
            { label: "MARATHON", value: "30+ jours", description: "Rien ne peut t'arrêter, même pas le dimanche." }
          ],
          currentValue: stat.value,
          tip: "Fixe-toi un objectif de série et ne la brise pas !"
        };
      // Ajoutez d'autres cas selon vos statistiques
      default:
        return {
          icon: stat.icon,
          title: stat.label,
          description: "Statistique d'écriture personnalisée",
          details: [
            { label: stat.value, value: "Valeur actuelle", description: "Continue ton bon travail !" }
          ],
          currentValue: stat.value,
          tip: "Continue d'écrire régulièrement pour progresser !"
        };
    }
  };
  
  const content = getPopupContent();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div 
        className="bg-white border-4 border-black p-6 w-full max-w-2xl my-8"
        style={{ boxShadow: "8px 8px 0px #000" }}
        initial={{ scale: 0.9, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
      >
        {/* Close button fixed at the top right of the popup */}
        <div className="sticky top-0 flex justify-end mb-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="bg-black text-white font-bold px-3 py-1"
            aria-label="Fermer"
          >
            X
          </motion.button>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{content.icon}</div>
          <h2 className="text-4xl font-black mb-4 transform -rotate-1">
            <span className={`${stat.color} px-4 py-2 inline-block`}>
              {content.title}
            </span>
          </h2>
          <p className="text-lg font-bold">
            {content.description}
          </p>
        </div>
        
        <div className="bg-gray-100 border-4 border-black p-4 mb-6">
          <h3 className="text-xl font-black mb-4">NIVEAU ACTUEL: {content.currentValue}</h3>
          
          <div className="space-y-4">
            {content.details.map((level, index) => (
              <div 
                key={index}
                className={`p-3 border-2 border-black ${content.currentValue === level.label ? `${stat.color} border-4` : 'bg-white'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-lg">{level.label}</span>
                  <span className="font-bold">{level.value}</span>
                </div>
                <p className="text-sm mt-1">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-yellow-100 border-4 border-black p-4 mb-6">
          <h3 className="text-lg font-black mb-2">💡 ASTUCE DE GÉNIE</h3>
          <p className="font-bold">
            {content.tip}
          </p>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-black text-white font-black text-xl px-6 py-3 border-4 border-black"
          >
            RETOUR À MON PROFIL
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState(200);
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalWords: 0,
    today: 0,
    week: 0,
    month: 0
  });
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [diceBearAvatar, setDiceBearAvatar] = useState<string | null>(null);

  const [subscription, setSubscription] = useState(null); // ✅ Ajoute un état local
  const [loadingSubscription, setLoadingSubscription] = useState(true); 



  const avatarSvg = useMemo(() => {
    if (session?.user?.id) {
      // Use a consistent seed generation
      return generateDiceBearAvatar(`${session.user.id}-avatar`);
    }
    return null;
  }, [session?.user?.id]);

    // Rediriger si non authentifié
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/auth/login");
      }
    }, [status, router]);

  // Récupérer les stats et les badges au chargement
  useEffect(() => {
    async function fetchUserData() {
        try {
            setLoadingStats(true);
            
            // Récupérer d'abord l'avatar
            const avatarRes = await fetch("/api/user/avatar");
            let avatarData = null;
            if (avatarRes.ok) {
                avatarData = await avatarRes.json();
                console.log("Données de l'avatar récupérées:", avatarData);

                // Trouver l'avatar correspondant
                const foundAvatar = AVAILABLE_AVATARS.find(a => a.id === avatarData.currentAvatar);
                if (foundAvatar) {
                    setSelectedAvatar(foundAvatar);
                }

                // Mettre à jour l'avatar DiceBear
                if (avatarData.currentAvatarUrl) {
                    setDiceBearAvatar(avatarData.currentAvatarUrl);
                }
            }

            // Récupérer les statistiques
            const statsRes = await fetch("/api/user/stats");
            if (statsRes.ok) {
                const stats = await statsRes.json();
                console.log("Données utilisateur récupérées:", stats);

                setUserStats({
                    streak: stats.currentStreak,
                    totalWords: stats.total,
                    today: stats.today,
                    week: stats.week,
                    month: stats.month
                });
                setDailyGoal(stats.dailyGoal);

                // Récupérer les badges
                const badgesRes = await fetch("/api/user/badge");
                if (badgesRes.ok) {
                    const badgesData = await badgesRes.json();
                    setBadges(badgesData);
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données utilisateur:", error);
        } finally {
            setLoadingStats(false);
        }
    }

    if (status === "authenticated") {
        fetchUserData();
    }
  }, [status]);


  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/stripe/subscription"); // ✅ Appel à l'API route
        if (res.ok) {
          const sub = await res.json();
          setSubscription(sub);
        } else {
          console.error("Erreur API abonnement :", await res.text());
        }
      } catch (error) {
        console.error("Erreur de chargement de l'abonnement :", error);
      } finally {
        setLoadingSubscription(false);
      }
    }

    if (status === "authenticated") {
      fetchSubscription();
    }
  }, [status]);

  if (status === "loading" || loadingSubscription) {
    return <div>Chargement...</div>; // ✅ Gère le chargement
  }

  const renderAvatarSection = () => {
    // Priorité : avatarUrl du serveur > diceBearAvatar > avatar générique
    const avatarToDisplay = diceBearAvatar || 
    (selectedAvatar 
      ? generateDiceBearAvatar(`${session?.user?.id}-${selectedAvatar.id}`) 
      : null);
    return (
      <motion.div
        whileHover={{ rotate: -5 }}
        whileTap={{ scale: 0.95 }}
        className="w-48 h-48 bg-white border-8 border-black rounded-none overflow-hidden relative cursor-pointer"
        onClick={() => setIsAvatarModalOpen(true)}
      >
        {avatarToDisplay ? (
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: avatarToDisplay }}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${AVAILABLE_AVATARS[0].gradientFrom} ${AVAILABLE_AVATARS[0].gradientTo}`}>
            <div className="text-4xl">?</div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderAvatarSelectionModal = () => {
    if (!isAvatarModalOpen) return null;

    const handleSaveAvatar = async () => {
      if (!selectedAvatar) return;

      try {
        const response = await fetch("/api/user/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarId: selectedAvatar.id })
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Avatar saved successfully:", data);
          
          // Mettre à jour l'avatar localement
          setDiceBearAvatar(data.avatarUrl);
          
          // Fermer la modal
          setIsAvatarModalOpen(false);
          
          // Animation de succès
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          const errorData = await response.json();
          console.error("Échec de la sauvegarde de l'avatar", errorData);
          // Optionnel : afficher un message d'erreur
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'avatar:", error);
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <motion.div 
          className="bg-white border-4 border-black p-6 w-full max-w-2xl my-8"
          style={{ boxShadow: "8px 8px 0px #000" }}
          initial={{ scale: 0.9, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
        >
          <h2 className="text-4xl font-black mb-8 text-center">
            CHOISIS TON AVATAR 🧠
          </h2>

          <div className="grid grid-cols-5 gap-4 mb-8">
            {AVAILABLE_AVATARS.map((avatar) => {
  const svgAvatar = generateDiceBearAvatar(`${session?.user?.id}-${avatar.id}`);

  return (
                <motion.div
                  key={avatar.id}
                  className={`w-full aspect-square border-4 cursor-pointer transition-all 
                    ${selectedAvatar?.id === avatar.id 
                      ? 'border-green-500 scale-105' 
                      : 'border-black hover:border-blue-500'}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: svgAvatar }}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAvatar}
              disabled={!selectedAvatar}
              className={`px-6 py-3 border-4 border-black font-black text-white 
                ${selectedAvatar 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              SAUVEGARDER
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAvatarModalOpen(false)}
              className="px-6 py-3 border-4 border-black font-black bg-red-500 text-white hover:bg-red-600"
            >
              ANNULER
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyWordGoal: dailyGoal }),
      });

      if (res.ok) {
        // Afficher l'animation de confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Actualiser les statistiques après la mise à jour des paramètres
        // car la streak a peut-être été mise à jour
        const statsRes = await fetch("/api/user/stats");
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setUserStats({
            streak: stats.currentStreak,
            totalWords: stats.total,
            today: stats.today,
            week: stats.week,
            month: stats.month
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des réglages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats d'utilisateur formatées pour l'affichage
  const stats = [
    {
      label: "JOURS CONSÉCUTIFS",
      value: userStats.streak,
      icon: "🔥",
      color: "bg-pink-400"
    },
    {
      label: "MOTS TOTAUX",
      value: userStats.totalWords.toLocaleString(),
      icon: "📝",
      color: "bg-blue-400"
    },
    {
      label: "NIVEAU CÉRÉBRAL",
      value: userStats.totalWords > 100000 ? "LÉGENDAIRE" : 
             userStats.totalWords > 50000 ? "GÉNIE" : 
             userStats.totalWords > 20000 ? "PRO" : 
             userStats.totalWords > 10000 ? "AVANCÉ" : 
             userStats.totalWords > 5000 ? "INTERMÉDIAIRE" : 
             "DÉBUTANT",
      icon: "🧠",
      color: "bg-green-400"
    }
  ];

  if (status === "loading" || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-300">
        <div className="text-4xl font-black animate-pulse transform rotate-3 bg-black text-yellow-300 p-6 border-4 border-black">
          CHARGEMENT DU CERVEAU...
        </div>
      </div>
    );
  }

  const user = session?.user;

  // Calculer le pourcentage de progression quotidienne
  const dailyProgressPercent = Math.min(100, (userStats.today / dailyGoal) * 100);


  return (
    <div className="min-h-screen bg-yellow-300 overflow-hidden">
      <Navbar />

      {/* Effet de confetti pour la sauvegarde */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                top: "110%",
                rotate: 360,
                opacity: 0
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 0.5
              }}
              className={`absolute w-4 h-4 ${["bg-pink-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"][
                Math.floor(Math.random() * 4)
              ]
                }`}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

        {/* En-tête du profil */}
        <section className="py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto px-4"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar avec style brutal */}
              {renderAvatarSection()}
              {renderAvatarSelectionModal()}

              {/* Informations utilisateur */}
              <div className="flex-1">
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-5xl font-black mb-4 transform -rotate-2"
                  style={{ textShadow: "3px 3px 0px #000" }}
                >
                  {user?.username || "GÉNIE ANONYME"}
                </motion.h1>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black text-white px-4 py-2 inline-block transform rotate-1 mb-4"
                >
                  <span className="font-bold">{user?.email || "cerveau@lexistep.com"}</span>
                </motion.div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                      className={`${stat.color} border-4 border-black p-4 text-center cursor-pointer`}
                      onClick={() => {
                        setSelectedStat(stat);
                        setIsPopupOpen(true);
                      }}
                    >
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-xl font-black">{stat.value}</div>
                      <div className="text-sm font-bold">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Popup pour les statistiques */}
                <StatCardPopup 
                  stat={selectedStat} 
                  isOpen={isPopupOpen && selectedStat !== null} 
                  onClose={() => setIsPopupOpen(false)} 
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section des objectifs */}
        <section className="py-16 bg-white border-y-8 border-black">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-4xl font-black mb-12 text-center transform -rotate-1">
              <span className="bg-black text-white px-4 py-2 inline-block">
                ENTRAÎNEMENT CÉRÉBRAL
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulaire d'objectif */}
              <motion.div
                whileHover={{ rotate: -1 }}
                className="p-6 bg-pink-400 border-4 border-black"
              >
                <h3 className="text-2xl font-black mb-6">🎯 TON OBJECTIF QUOTIDIEN</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xl font-black mb-4">
                      COMBIEN DE MOTS PAR JOUR ?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="200"
                        max="1000"
                        step="50"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="w-full h-6 appearance-none bg-black rounded-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-yellow-300 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black"
                      />
                      <span className="text-3xl font-black bg-white border-4 border-black px-4 py-2 min-w-[120px] text-center">
                        {dailyGoal}
                      </span>
                    </div>
                    <p className="mt-2 font-bold">
                      {dailyGoal < 300
                        ? "NIVEAU DÉBUTANT - C'est un bon début!"
                        : dailyGoal < 600
                          ? "NIVEAU INTERMÉDIAIRE - Tu développes ton cerveau!"
                          : "NIVEAU EXPERT - Tu vas devenir un génie!"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-black text-white font-black py-3 px-6 text-xl border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
                    disabled={loading}
                  >
                    {loading ? "SAUVEGARDE EN COURS..." : "BOOSTER MON CERVEAU 🧠"}
                  </motion.button>
                </form>
              </motion.div>

              {/* Progression actuelle - Mise à jour avec les données de la BDD */}
              <motion.div
                whileHover={{ rotate: 1 }}
                className="p-6 bg-blue-400 border-4 border-black relative overflow-hidden"
              >
                <h3 className="text-2xl font-black mb-6">⚡️ TA PROGRESSION</h3>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black">AUJOURD'HUI</span>
                    <span className="font-black bg-white border-2 border-black px-2 py-1">
                      {userStats.today} / {dailyGoal} MOTS
                    </span>
                  </div>

                  <div className="w-full h-8 bg-white border-4 border-black mb-6">
                    <div
                      className="h-full bg-green-400 border-r-4 border-black transition-all duration-500"
                      style={{ width: `${dailyProgressPercent}%` }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Cette semaine</span>
                        <span className="font-bold">{userStats.week.toLocaleString()} mots</span>
                      </div>
                      <div className="w-full h-4 bg-white border-2 border-black">
                        <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (userStats.week / (dailyGoal * 7)) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Ce mois</span>
                        <span className="font-bold">{userStats.month.toLocaleString()} mots</span>
                      </div>
                      <div className="w-full h-4 bg-white border-2 border-black">
                        <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (userStats.month / (dailyGoal * 30)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-black text-white font-black py-3 px-6 text-xl mt-6 border-4 border-black hover:bg-yellow-300 hover:text-black transition-all"
                  >
                    CONTINUER À ÉCRIRE ✍️
                  </motion.button>
                </div>

                {/* Éléments décoratifs */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-300 rounded-full opacity-30" />
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-pink-500 rounded-full opacity-20" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Section des badges - Mise à jour avec les données de la BDD */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              <span className="bg-black text-white px-4 py-2 inline-block transform rotate-1">
                TES BADGES DE GÉNIE
              </span>
            </h2>

            {/* Nouveau composant de galerie de badges */}
            <BadgeGallery badges={badges} />
          </motion.div>
        </section>

        {/* Dans votre ProfilePage, ajoutez le Moodboard avant la section des badges */}
        <section className="py-16 bg-white border-y-8 border-black">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <h2 className="text-4xl font-black mb-12 text-center transform rotate-1">
              <span className="bg-black text-white px-4 py-2 inline-block">
                🌌 COSMOS ÉMOTIONNEL
              </span>
            </h2>

            <StyledMoodTracker />
          </motion.div>
        </section>

        {/* Gestion de l'abonnement */}
        <section className="py16 bg-black text-white">
        <h2 className="text-xl font-semibold mb-4">Abonnement</h2>

            <p className="text-gray-700 mb-1">
              Statut: <span className="font-medium">{subscription.isPro ? 'Pro' : 'Gratuit'}</span>
            </p>
            {subscription.isPro && (
              <p className="text-sm text-gray-500">
                Votre abonnement se renouvellera le{' '}
                {new Date(subscription.stripeCurrentPeriodEnd!).toLocaleDateString('fr-FR')}
              </p>
            )}
          <SubscriptionButton isPro={subscription.isPro} />
        </section>

        {/* Section déconnexion */}
        <section className="py-16 bg-black text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-4xl font-black mb-8">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-2">
                BESOIN DE REPOS CÉRÉBRAL ?
              </span>
            </h2>
            <p className="text-xl mb-8 font-bold">
              (Mais n'oublie pas : chaque jour sans écrire = 1 million de neurones qui s'ennuient)
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-2xl font-black bg-yellow-300 text-black px-8 py-4 rounded-none border-4 border-yellow-300 hover:bg-white transition-all"
            >
              DÉCONNEXION TEMPORAIRE 🧠💤
            </motion.button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}