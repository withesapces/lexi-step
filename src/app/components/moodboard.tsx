import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MOODS, Mood, normalizeMoodValue, getMoodByValue } from "../../config/moods";

interface MoodHistoryEntry {
    id: string;
    date: string;
    moodValue: string;
    wordCount: number;
}

interface MoodSummary {
    date: string; // Date de début de la période (jour, semaine ou mois)
    endDate?: string; // Date de fin pour les regroupements (semaine ou mois)
    periodType: "day" | "week" | "month"; // Type de période
    averageMoodValue: number;
    totalEntries: number;
    totalWords: number;
    moods: {
        [key: string]: number;
    };
    dominantMood: Mood;
    // Pour la vue détaillée d'une semaine
    dailyMoods?: {
        date: string;
        dominantMood: Mood;
        entries: number;
    }[];
}

export default function StyledMoodTracker() {
    const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
    const [filteredSummaries, setFilteredSummaries] = useState<MoodSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [timespan, setTimespan] = useState<"week" | "month" | "year">("month");
    const [selectedPeriod, setSelectedPeriod] = useState<MoodSummary | null>(null);

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
                    const sortedData = data.sort((a: MoodHistoryEntry, b: MoodHistoryEntry) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                    setMoodHistory(sortedData);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'historique des moods:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMoodHistory();
    }, []);

    // Mettre à jour les résumés lorsque les données ou la période changent
    useEffect(() => {
        if (moodHistory.length > 0) {
            const summaries = createPeriodSummaries(moodHistory, timespan);
            setFilteredSummaries(summaries);
            setSelectedPeriod(null); // Réinitialiser la sélection
        }
    }, [moodHistory, timespan]);

    // Obtenir le premier jour de la semaine pour une date donnée
    const getWeekStartDate = (date: Date): Date => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuster si c'est dimanche
        const weekStart = new Date(date);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    };

    // Obtenir le premier jour du mois pour une date donnée
    const getMonthStartDate = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    // Création des résumés adaptés à la période
    const createPeriodSummaries = (entries: MoodHistoryEntry[], period: "week" | "month" | "year"): MoodSummary[] => {
        // Filtrer les entrées selon la période sélectionnée
        const now = new Date();
        const cutoffDate = new Date();

        if (period === "week") {
            cutoffDate.setDate(now.getDate() - 7);
        } else if (period === "month") {
            cutoffDate.setMonth(now.getMonth() - 1);
        } else {
            cutoffDate.setFullYear(now.getFullYear() - 1);
        }

        const filteredEntries = entries.filter(entry => new Date(entry.date) >= cutoffDate);

        // Regrouper selon la période
        const groupedEntries: Record<string, MoodHistoryEntry[]> = {};

        filteredEntries.forEach(entry => {
            const entryDate = new Date(entry.date);
            let groupKey: string;
            let periodType: "day" | "week" | "month";

            if (period === "week") {
                // Pour la semaine, regrouper par jour
                groupKey = entryDate.toISOString().split('T')[0];
                periodType = "day";
            } else if (period === "month") {
                // Pour le mois, regrouper par semaine
                const weekStart = getWeekStartDate(entryDate);
                groupKey = weekStart.toISOString().split('T')[0];
                periodType = "week";
            } else {
                // Pour l'année, regrouper par mois
                const monthStart = getMonthStartDate(entryDate);
                groupKey = monthStart.toISOString().split('T')[0];
                periodType = "month";
            }

            if (!groupedEntries[groupKey]) {
                groupedEntries[groupKey] = [];
            }
            groupedEntries[groupKey].push(entry);
        });

        // Créer les résumés pour chaque groupe
        const summaries: MoodSummary[] = Object.entries(groupedEntries).map(([startDate, groupEntries]) => {
            // Compter les occurrences de chaque humeur
            const moodCounts: Record<string, number> = {};
            let totalMoodValue = 0;
            
            groupEntries.forEach(entry => {
                const normalizedMoodValue = normalizeMoodValue(entry.moodValue);
                moodCounts[normalizedMoodValue] = (moodCounts[normalizedMoodValue] || 0) + 1;
                totalMoodValue += parseFloat(normalizedMoodValue);
            });

            // Trouver l'humeur dominante
            let maxCount = 0;
            let dominantMoodValue = Object.keys(MOODS)[2]; // Valeur par défaut
            
            Object.entries(moodCounts).forEach(([mood, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    dominantMoodValue = mood;
                }
            });

            // Calculer le nombre total de mots
            const totalWords = groupEntries.reduce((sum, entry) => sum + entry.wordCount, 0);

            const periodType = period === "week" ? "day" : (period === "month" ? "week" : "month");

            // Pour les semaines, ajouter des détails quotidiens
            let dailyMoods;
            let endDate;

            if (periodType === "week") {
                // Regrouper par jour au sein de la semaine
                const dailyGroups: Record<string, MoodHistoryEntry[]> = {};
                groupEntries.forEach(entry => {
                    const dayKey = new Date(entry.date).toISOString().split('T')[0];
                    if (!dailyGroups[dayKey]) {
                        dailyGroups[dayKey] = [];
                    }
                    dailyGroups[dayKey].push(entry);
                });

                dailyMoods = Object.entries(dailyGroups).map(([date, entries]) => {
                    // Trouver l'humeur dominante pour ce jour
                    const dayCounts: Record<string, number> = {};
                    entries.forEach(entry => {
                        const mood = normalizeMoodValue(entry.moodValue);
                        dayCounts[mood] = (dayCounts[mood] || 0) + 1;
                    });

                    let maxDayCount = 0;
                    let dayDominantMood = Object.keys(MOODS)[2];
                    
                    Object.entries(dayCounts).forEach(([mood, count]) => {
                        if (count > maxDayCount) {
                            maxDayCount = count;
                            dayDominantMood = mood;
                        }
                    });

                    return {
                        date,
                        dominantMood: getMoodByValue(dayDominantMood) || MOODS[2],
                        entries: entries.length
                    };
                }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // Calculer la date de fin (dernier jour de la semaine)
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(startDateObj);
                endDateObj.setDate(startDateObj.getDate() + 6);
                endDate = endDateObj.toISOString().split('T')[0];
            } else if (periodType === "month") {
                // Calculer la date de fin du mois
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(startDateObj);
                endDateObj.setMonth(startDateObj.getMonth() + 1);
                endDateObj.setDate(0); // Dernier jour du mois
                endDate = endDateObj.toISOString().split('T')[0];
            }

            return {
                date: startDate,
                endDate,
                periodType,
                averageMoodValue: totalMoodValue / groupEntries.length,
                totalEntries: groupEntries.length,
                totalWords,
                moods: moodCounts,
                dominantMood: getMoodByValue(dominantMoodValue) || MOODS[2],
                dailyMoods
            };
        });

        // Trier par date
        return summaries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // État de chargement stylisé
    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
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

    // Calculer la couleur d'une période basée sur son humeur dominante
    const getPeriodColor = (summary: MoodSummary) => {
        return summary.dominantMood.color;
    };

    // Calculer la taille des bulles en fonction du nombre d'entrées
    const getBubbleSize = (entriesCount: number) => {
        const minSize = 50;
        const maxSize = 100;
        const size = minSize + Math.min(entriesCount * 5, maxSize - minSize);
        return size;
    };

    // Obtenir l'humeur dominante de la période complète
    const getPeriodDominantMood = () => {
        if (filteredSummaries.length === 0) return MOODS[2];

        const allMoods: Record<string, number> = {};
        
        filteredSummaries.forEach(summary => {
            Object.entries(summary.moods).forEach(([mood, count]) => {
                allMoods[mood] = (allMoods[mood] || 0) + count;
            });
        });

        let maxCount = 0;
        let dominantMoodValue = Object.keys(MOODS)[2];

        Object.entries(allMoods).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                dominantMoodValue = mood;
            }
        });

        return getMoodByValue(dominantMoodValue) || MOODS[2];
    };

    // Formater une date pour l'affichage
    const formatDate = (dateString: string, format: "short" | "medium" | "long" = "medium") => {
        const date = new Date(dateString);
        
        if (format === "short") {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });
        } else if (format === "medium") {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: '2-digit'
            });
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    };

    // Obtenir le libellé de la période
    const getPeriodLabel = (summary: MoodSummary) => {
        if (summary.periodType === "day") {
            return formatDate(summary.date, "short");
        } else if (summary.periodType === "week") {
            return `${formatDate(summary.date, "short")} - ${formatDate(summary.endDate || summary.date, "short")}`;
        } else {
            const date = new Date(summary.date);
            return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        }
    };

    // Si aucune donnée n'est disponible pour la période sélectionnée
    if (filteredSummaries.length === 0) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-center mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("week")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-2 border-black 
              ${timespan === "week" ? "bg-pink-400 text-black" : "bg-white"}`}
                    >
                        7 DERNIERS JOURS
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("month")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-2 border-black 
              ${timespan === "month" ? "bg-blue-400 text-black" : "bg-white"}`}
                    >
                        30 DERNIERS JOURS
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimespan("year")}
                        className={`px-4 py-2 mx-2 font-black text-sm border-2 border-black 
              ${timespan === "year" ? "bg-yellow-400 text-black" : "bg-white"}`}
                    >
                        ANNÉE COMPLÈTE
                    </motion.button>
                </div>

                <div className="text-center py-20 bg-yellow-100 border-2 border-black max-w-3xl mx-auto">
                    <motion.p
                        className="text-3xl font-black mb-6 transform -rotate-2"
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [-2, -1, -2]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        TON UNIVERS ÉMOTIONNEL EST VIDE
                    </motion.p>
                    <motion.div
                        className="text-8xl mx-auto"
                        animate={{
                            rotate: [0, 10, 0, -10, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        🚀
                    </motion.div>
                    <p className="mt-6 font-bold bg-black text-white inline-block px-6 py-2 transform rotate-1">
                        Écris quelque chose pour créer ton cosmos émotionnel!
                    </p>
                </div>
            </div>
        );
    }

    const periodDominantMood = getPeriodDominantMood();

    return (
        <motion.div
            className="max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Contrôles de période */}
            <motion.div className="flex justify-center mb-8" variants={itemVariants}>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("week")}
                    className={`px-6 py-3 mx-2 font-black text-sm border-2 border-black 
                    ${timespan === "week" ? "bg-pink-400 text-black" : "bg-white"}`}
                >
                    7 DERNIERS JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("month")}
                    className={`px-6 py-3 mx-2 font-black text-sm border-2 border-black 
                    ${timespan === "month" ? "bg-blue-400 text-black" : "bg-white"}`}
                >
                    30 DERNIERS JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("year")}
                    className={`px-6 py-3 mx-2 font-black text-sm border-2 border-black 
                    ${timespan === "year" ? "bg-yellow-400 text-black" : "bg-white"}`}
                >
                    ANNÉE COMPLÈTE
                </motion.button>
            </motion.div>

            {/* Info sur l'humeur dominante */}
            <motion.div
                className="flex justify-center items-center mb-8"
                variants={itemVariants}
            >
                <div className="bg-yellow-300 p-4 transform rotate-1 border-2 border-black text-center">
                    <h3 className="font-bold text-lg">
                        PLANÈTE DOMINANTE: {periodDominantMood.emoji} {periodDominantMood.label.toUpperCase()}
                    </h3>
                </div>
            </motion.div>

            {/* Visualisation Cosmos des humeurs */}
            <motion.div 
                className="relative h-[600px] bg-gray-900 border-2 border-black overflow-hidden mb-10"
                variants={itemVariants}
            >
                {/* Background stars */}
                {Array.from({ length: 150 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() < 0.2 ? '3px' : '1px',
                            height: Math.random() < 0.2 ? '3px' : '1px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}

                {/* Mood planets - placement adaptatif selon le nombre et le type de périodes */}
                {filteredSummaries.map((summary, index) => {
                    // Calculer la position en fonction du nombre d'éléments
                    const total = filteredSummaries.length;
                    const columns = Math.min(Math.ceil(Math.sqrt(total)), 5);
                    const rows = Math.ceil(total / columns);
                    
                    const col = index % columns;
                    const row = Math.floor(index / columns);
                    
                    // Calculs des positions avec espacement
                    const xPos = 10 + (col * (80 / (columns === 1 ? 1 : columns - 1)));
                    const yPos = 10 + (row * (80 / (rows === 1 ? 1 : rows - 1)));
                    
                    // Taille proportionnelle au nombre d'entrées
                    const size = getBubbleSize(summary.totalEntries);
                    
                    return (
                        <motion.div
                            key={summary.date}
                            className={`absolute ${getPeriodColor(summary)} border-2 border-black rounded-full flex items-center justify-center cursor-pointer`}
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${xPos}%`,
                                top: `${yPos}%`,
                            }}
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 20px rgba(255,255,255,0.6)"
                            }}
                            onClick={() => setSelectedPeriod(summary)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring", 
                                delay: index * 0.05 
                            }}
                        >
                            <div className="text-center">
                                <div className="text-2xl">{summary.dominantMood.emoji}</div>
                                <div className="text-xs font-bold text-black">
                                    {summary.periodType === "month" 
                                        ? new Date(summary.date).toLocaleDateString('fr-FR', { month: 'short' })
                                        : formatDate(summary.date, "short")}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Détails de la période sélectionnée */}
                {selectedPeriod && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-6"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h3 className="font-bold text-xl">
                                    {getPeriodLabel(selectedPeriod)} {selectedPeriod.dominantMood.emoji}
                                </h3>
                                <p className="text-sm">
                                    {selectedPeriod.totalEntries} entrée{selectedPeriod.totalEntries > 1 ? 's' : ''} · {selectedPeriod.totalWords} mots
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                {Object.entries(selectedPeriod.moods).map(([mood, count]) => {
                                    const moodObj = getMoodByValue(mood) || MOODS[2];
                                    return (
                                        <div key={mood} className="flex items-center">
                                            <span className="text-xl mr-1">{moodObj.emoji}</span>
                                            <span className="text-sm">×{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <motion.button
                                className="bg-black text-white px-4 py-2 text-sm font-bold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedPeriod(null)}
                            >
                                FERMER
                            </motion.button>
                        </div>

                        {/* Détail quotidien pour les semaines */}
                        {selectedPeriod.periodType === "week" && selectedPeriod.dailyMoods && (
                            <div className="mt-4 pt-3 border-t border-gray-300">
                                <h4 className="text-sm font-bold mb-4">Détail par jour</h4>
                                <div className="flex justify-between">
                                    {selectedPeriod.dailyMoods.map(day => (
                                        <div key={day.date} className="flex flex-col items-center">
                                            <div className={`w-12 h-12 ${day.dominantMood.color} rounded-full flex items-center justify-center border border-black`}>
                                                <span className="text-xl">{day.dominantMood.emoji}</span>
                                            </div>
                                            <span className="text-sm mt-2">{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                                            <span className="text-xs">{day.entries > 1 ? `${day.entries} entrées` : '1 entrée'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Légende des humeurs */}
            <motion.div
                className="flex justify-center mt-8 mb-4"
                variants={itemVariants}
            >
                <div className="bg-black p-4 transform rotate-1">
                    <div className="flex flex-wrap justify-center gap-6">
                        {MOODS.map(mood => (
                            <div key={mood.value} className="flex items-center">
                                <span className="mr-2 text-2xl">{mood.emoji}</span>
                                <span className="text-sm text-white font-bold">{mood.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}