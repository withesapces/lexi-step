import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MOODS, Mood, normalizeMoodValue, getMoodByValue, calculateMoodHeight } from "../../config/moods";

interface MoodHistoryEntry {
    id: string;
    date: string;
    moodValue: string;
    wordCount: number;
}

export default function StyledMoodTracker() {
    const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timespan, setTimespan] = useState<"week" | "month" | "year">("month");

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
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

    // Récupérer l'historique des moods au chargement
    useEffect(() => {
        async function fetchMoodHistory() {
            try {
                setLoading(true);
                const response = await fetch("/api/user/mood");
                if (response.ok) {
                    const data = await response.json();
                    setMoodHistory(data.sort((a: MoodHistoryEntry, b: MoodHistoryEntry) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    ));
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'historique des moods:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMoodHistory();
    }, []);

    // Obtenir les détails d'un mood à partir de sa valeur
    const getMoodDetails = (moodValue: string): Mood => {
        const normalizedValue = normalizeMoodValue(moodValue);
        const mood = getMoodByValue(normalizedValue);
        return mood || MOODS[2]; // Mood par défaut si non trouvé
    };

    // Filtrer les données selon la période sélectionnée
    const getFilteredData = () => {
        const now = new Date();
        const cutoffDate = new Date();

        if (timespan === "week") {
            cutoffDate.setDate(now.getDate() - 7);
        } else if (timespan === "month") {
            cutoffDate.setMonth(now.getMonth() - 1);
        } else {
            cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        return moodHistory.filter(entry => new Date(entry.date) >= cutoffDate);
    };

    // Préparer les données pour le graphique
    const prepareChartData = () => {
        const filteredData = getFilteredData();

        return filteredData.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('fr-FR'),
            mood: getMoodDetails(entry.moodValue),
            wordCount: entry.wordCount
        }));
    };

    // État de chargement stylisé
    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center bg-yellow-300 border-4 border-black" style={{ boxShadow: "6px 6px 0px #000" }}>
                <motion.div
                    className="text-xl font-black bg-black text-white px-6 py-3"
                    animate={{
                        rotate: [0, -3, 3, -3, 0],
                        scale: [1, 1.05, 0.95, 1.05, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    CALCUL DE TON GÉNIE ÉMOTIONNEL...
                    <motion.span
                        className="inline-block ml-2"
                        animate={{ rotate: [0, 0, 180, 180, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        🧠
                    </motion.span>
                </motion.div>
            </div>
        );
    }

    const chartData = prepareChartData();

    // Si aucune donnée n'est disponible pour la période sélectionnée
    if (chartData.length === 0) {
        return (
            <div className="p-6 bg-white border-4 border-black relative" style={{ boxShadow: "8px 8px 0px #000" }}>
                <h2 className="text-3xl font-black transform -rotate-2 bg-black text-yellow-300 inline-block px-4 py-2 mb-6">
                    💡 MOOD TRACKER DE GÉNIE
                </h2>

                <div className="flex justify-center mb-6">
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("week")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
              ${timespan === "week" ? "bg-pink-400 text-black" : "bg-white"}`}
                    >
                        7 DERNIERS JOURS
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("month")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
              ${timespan === "month" ? "bg-blue-400 text-black" : "bg-white"}`}
                    >
                        30 DERNIERS JOURS
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("year")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
              ${timespan === "year" ? "bg-yellow-400 text-black" : "bg-white"}`}
                    >
                        ANNÉE COMPLÈTE
                    </motion.button>
                </div>

                <div className="text-center py-10 bg-yellow-100 border-3 border-black">
                    <motion.p
                        className="text-2xl font-black mb-4 transform -rotate-2"
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [-2, -1, -2]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        PAS DE DONNÉES D'HUMEUR
                    </motion.p>
                    <motion.div
                        className="text-6xl mx-auto"
                        animate={{
                            rotate: [0, 10, 0, -10, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        🕵️
                    </motion.div>
                    <p className="mt-4 font-bold bg-black text-white inline-block px-6 py-2 transform rotate-1">
                        Écris quelque chose pour montrer ton génie émotionnel!
                    </p>
                </div>
            </div>
        );
    }

    // Obtenir l'humeur dominante
    const getDominantMood = () => {
        const moodCounts: Record<string, number> = {};
        chartData.forEach(entry => {
            moodCounts[entry.mood.value] = (moodCounts[entry.mood.value] || 0) + 1;
        });

        let maxCount = 0;
        let dominantMoodValue = MOODS[2].value;

        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                dominantMoodValue = mood;
            }
        });

        return getMoodByValue(dominantMoodValue) || MOODS[2];
    };

    const dominantMood = getDominantMood();

    return (
        <motion.div
            className="p-6 bg-white border-4 border-black relative overflow-hidden"
            style={{ boxShadow: "8px 8px 0px #000" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Éléments décoratifs */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-yellow-300 rounded-full opacity-30" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-pink-400 rounded-full opacity-20" />


            {/* Info sur l'humeur dominante */}
            <motion.div
                className="flex justify-center items-center mb-8"
                variants={itemVariants}
            >
                <div className="bg-yellow-300 p-3 transform border-2 border-black text-center">
                    <h3 className="font-bold text-sm">
                        HUMEUR DOMINANTE: {dominantMood.emoji} {dominantMood.label.toUpperCase()}
                    </h3>
                </div>
            </motion.div>


            {/* Contrôles de période */}
            <motion.div className="flex justify-center mb-6" variants={itemVariants}>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("week")}
                    className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
            ${timespan === "week" ? "bg-pink-400 text-black" : "bg-white"}`}
                >
                    7 DERNIERS JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("month")}
                    className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
            ${timespan === "month" ? "bg-blue-400 text-black" : "bg-white"}`}
                >
                    30 DERNIERS JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("year")}
                    className={`px-4 py-2 mx-2 font-black text-sm border-3 border-black 
            ${timespan === "year" ? "bg-yellow-400 text-black" : "bg-white"}`}
                >
                    ANNÉE COMPLÈTE
                </motion.button>
            </motion.div>

            {/* Graphique stylisé */}
            <motion.div
                className="relative h-64 mt-12 mb-8 border-b-4 border-l-4 border-black pl-2"
                variants={itemVariants}
            >
                {/* Légende axe vertical */}
                <div className="absolute -left-16 top-1/2 transform -rotate-90 origin-center">
                    <p className="font-bold text-sm">NIVEAU DE GÉNIE ÉMOTIONNEL</p>
                </div>

                {/* Barres du graphique */}
                <div className="flex items-end h-full pl-2 space-x-1 relative">
                    {chartData.map((day, index) => (
                        <motion.div
                            key={`${day.date}-${index}`}
                            className="flex flex-col items-center flex-1"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <motion.div
                                className={`w-full ${day.mood.color} border-2 border-black relative group`}
                                style={{ height: calculateMoodHeight(day.mood) }}
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "3px 3px 0px rgba(0,0,0,0.8)"
                                }}
                            >
                                {/* Emoji flottant au-dessus de la barre */}
                                <motion.div
                                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-2xl"
                                    animate={{
                                        y: [0, -5, 0, -5, 0],
                                        rotate: [0, 5, 0, -5, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    {day.mood.emoji}
                                </motion.div>

                                {/* Info-bulle au survol */}
                                <div className="hidden group-hover:block absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black p-2 z-10 w-32">
                                    <p className="text-xs font-bold">{day.date}</p>
                                    <p className="text-xs">{day.mood.label}</p>
                                    <p className="text-xs">{day.wordCount} mots</p>
                                </div>
                            </motion.div>

                            {/* Date sous la barre (pour les périodes courtes) */}
                            {(timespan === "week" || chartData.length < 10) && (
                                <p className="text-xs mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                                    {day.date.split('/').slice(0, 2).join('/')}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Légende des humeurs */}
            <motion.div
                className="flex justify-center mt-6 mb-4"
                variants={itemVariants}
            >
                <div className="bg-black p-2 transform">
                    <div className="flex space-x-4">
                        {MOODS.map(mood => (
                            <div key={mood.value} className="flex items-center">
                                <span className="mr-1 text-lg">{mood.emoji}</span>
                                <span className="text-xs text-white font-bold">{mood.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}