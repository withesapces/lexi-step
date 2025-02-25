import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MOODS, Mood, normalizeMoodValue, getMoodByValue } from "../../config/moods";

interface MoodHistoryEntry {
    id: string;
    date: string;
    moodValue: string;
    wordCount: number;
    exerciseType: string;
}

interface MoodStats {
    totalEntries: number;
    totalWords: number;
    averageMoodValue: number;
    dominantMood: Mood;
    moodDistribution: {
        [key: string]: number;
    };
    entriesByDay: {
        [key: string]: number;
    };
}

export default function SimplifiedMoodTracker() {
    const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
    const [stats, setStats] = useState<MoodStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [timespan, setTimespan] = useState<"week" | "month" | "all">("week");
    const [selectedEntry, setSelectedEntry] = useState<MoodHistoryEntry | null>(null);

    // Fetch mood history
    useEffect(() => {
        async function fetchMoodHistory() {
            try {
                setLoading(true);
                const response = await fetch("/api/user/mood");
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a: MoodHistoryEntry, b: MoodHistoryEntry) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
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

    // Filter entries based on timespan and calculate stats
    useEffect(() => {
        if (moodHistory.length === 0) return;

        const now = new Date();
        const cutoffDate = new Date();
        
        if (timespan === "week") {
            cutoffDate.setDate(now.getDate() - 7);
        } else if (timespan === "month") {
            cutoffDate.setMonth(now.getMonth() - 1);
        }

        const filteredEntries = timespan === "all" 
            ? [...moodHistory] 
            : moodHistory.filter(entry => new Date(entry.date) >= cutoffDate);

        // Calculate statistics
        const moodCounts: Record<string, number> = {};
        const entriesByDay: Record<string, number> = {};
        let totalMoodValue = 0;
        let totalWords = 0;

        filteredEntries.forEach(entry => {
            // Count moods
            const normalizedMoodValue = normalizeMoodValue(entry.moodValue);
            moodCounts[normalizedMoodValue] = (moodCounts[normalizedMoodValue] || 0) + 1;
            totalMoodValue += parseFloat(normalizedMoodValue);
            totalWords += entry.wordCount;

            // Group by day
            const dayStr = new Date(entry.date).toISOString().split('T')[0];
            entriesByDay[dayStr] = (entriesByDay[dayStr] || 0) + 1;
        });

        // Find dominant mood
        let maxCount = 0;
        let dominantMoodValue = Object.keys(MOODS)[2]; // Default value
        
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                dominantMoodValue = mood;
            }
        });

        setStats({
            totalEntries: filteredEntries.length,
            totalWords,
            averageMoodValue: filteredEntries.length > 0 ? totalMoodValue / filteredEntries.length : 0,
            dominantMood: getMoodByValue(dominantMoodValue) || MOODS[2],
            moodDistribution: moodCounts,
            entriesByDay,
        });
    }, [moodHistory, timespan]);

    // Format date for display
    const formatDate = (dateString: string, format: "short" | "medium" | "long" = "medium") => {
        const date = new Date(dateString);
        
        if (format === "short") {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });
        } else if (format === "medium") {
            return date.toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        } else {
            return date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get color based on mood
    const getMoodColor = (moodValue: string) => {
        const mood = getMoodByValue(normalizeMoodValue(moodValue)) || MOODS[2];
        return mood.color;
    };

    // Get period label based on timespan
    const getPeriodLabel = () => {
        if (timespan === "week") {
            return "7 derniers jours";
        } else if (timespan === "month") {
            return "30 derniers jours";
        } else {
            return "Historique complet";
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[300px] flex items-center justify-center">
                <motion.div 
                    initial={{ rotate: -3 }}
                    animate={{ 
                        rotate: 3,
                        transition: { repeat: Infinity, repeatType: "reverse", duration: 0.7 }
                    }}
                    className="bg-black text-yellow-300 px-6 py-3 border-4 border-black font-black text-xl"
                >
                    CHARGEMENT DE TES ÉMOTIONS...
                </motion.div>
            </div>
        );
    }

    // Empty state
    if (moodHistory.length === 0) {
        return (
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center py-10 bg-yellow-300 border-4 border-black"
                     style={{ boxShadow: "8px 8px 0px #000" }}>
                    <p className="text-2xl font-black mb-4 transform -rotate-2">PAS ENCORE D'ÉMOTIONS?!</p>
                    <p className="font-bold">Commence à écrire pour suivre ton humeur dans le temps.</p>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-black text-white font-black px-6 py-3 border-4 border-black"
                    >
                        DÉMARRER LE VOYAGE ÉMOTIONNEL
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            {/* Period controls */}
            <div className="flex justify-center mb-6">
                <motion.button
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("week")}
                    className={`px-4 py-2 mx-1 font-black border-4 border-black 
                    ${timespan === "week" ? "bg-blue-400" : "bg-white"}`}
                    style={timespan === "week" ? { boxShadow: "4px 4px 0px #000" } : {}}
                >
                    7 JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("month")}
                    className={`px-4 py-2 mx-1 font-black border-4 border-black 
                    ${timespan === "month" ? "bg-blue-400" : "bg-white"}`}
                    style={timespan === "month" ? { boxShadow: "4px 4px 0px #000" } : {}}
                >
                    30 JOURS
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimespan("all")}
                    className={`px-4 py-2 mx-1 font-black border-4 border-black 
                    ${timespan === "all" ? "bg-blue-400" : "bg-white"}`}
                    style={timespan === "all" ? { boxShadow: "4px 4px 0px #000" } : {}}
                >
                    TOUT
                </motion.button>
            </div>

            {/* Summary stats */}
            {stats && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white p-6 border-4 border-black"
                    style={{ boxShadow: "8px 8px 0px #000" }}
                >
                    <h2 className="text-2xl font-black mb-6 transform -rotate-1">
                        <span className="bg-pink-400 px-4 py-1 inline-block">
                            RÉSUMÉ DE {getPeriodLabel().toUpperCase()}
                        </span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column - Key stats */}
                        <div className="bg-yellow-100 p-4 border-4 border-black">
                            <div className="mb-6">
                                <p className="text-sm font-bold text-black mb-1">HUMEUR DOMINANTE</p>
                                <div className="flex items-center">
                                    <span className="text-4xl mr-2">{stats.dominantMood.emoji}</span>
                                    <span className="text-xl font-black transform rotate-1">{stats.dominantMood.label}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 border-4 border-black">
                                    <p className="text-sm font-bold text-black mb-1">ENTRÉES</p>
                                    <p className="text-2xl font-black">{stats.totalEntries}</p>
                                </div>
                                <div className="bg-white p-3 border-4 border-black">
                                    <p className="text-sm font-bold text-black mb-1">MOTS ÉCRITS</p>
                                    <p className="text-2xl font-black">{stats.totalWords}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right column - Mood distribution */}
                        <div className="bg-blue-100 p-4 border-4 border-black">
                            <p className="text-sm font-bold text-black mb-2">DISTRIBUTION DES HUMEURS</p>
                            <div className="space-y-3">
                                {Object.entries(stats.moodDistribution).map(([moodValue, count]) => {
                                    const mood = getMoodByValue(moodValue) || MOODS[2];
                                    const percentage = Math.round((count / stats.totalEntries) * 100);
                                    
                                    return (
                                        <div key={moodValue} className="flex items-center">
                                            <motion.span 
                                                className="text-xl mr-2"
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    rotate: [-2, 2, -2],
                                                    transition: { 
                                                        repeat: Infinity,
                                                        repeatType: "reverse",
                                                        duration: 2,
                                                        delay: Math.random() * 2
                                                    }
                                                }}
                                            >
                                                {mood.emoji}
                                            </motion.span>
                                            <div className="flex-grow">
                                                <div className="h-6 bg-white border-2 border-black rounded-none overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full ${mood.color}`}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm font-black w-12 text-right bg-black text-white px-1">
                                                {percentage}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Timeline section */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 border-4 border-black"
                style={{ boxShadow: "8px 8px 0px #000" }}
            >
                <h2 className="text-2xl font-black mb-6 transform rotate-1">
                    <span className="bg-green-400 px-4 py-1 inline-block">
                        HISTORIQUE DES HUMEURS
                    </span>
                </h2>
                
                <div className="space-y-4">
                    {moodHistory
                        .filter(entry => {
                            if (timespan === "all") return true;
                            
                            const entryDate = new Date(entry.date);
                            const cutoffDate = new Date();
                            
                            if (timespan === "week") {
                                cutoffDate.setDate(cutoffDate.getDate() - 7);
                            } else if (timespan === "month") {
                                cutoffDate.setMonth(cutoffDate.getMonth() - 1);
                            }
                            
                            return entryDate >= cutoffDate;
                        })
                        .map((entry, index, filteredArray) => {
                            const entryDate = new Date(entry.date).toISOString().split('T')[0];
                            const prevDate = index > 0 ? new Date(filteredArray[index - 1].date).toISOString().split('T')[0] : null;
                            const showDate = index === 0 || entryDate !== prevDate;
                            const mood = getMoodByValue(normalizeMoodValue(entry.moodValue)) || MOODS[2];

                            return (
                                <div key={entry.id}>
                                    {showDate && (
                                        <motion.div 
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="border-t-4 border-dashed border-black pt-4 mt-6 mb-3"
                                        >
                                            <span className="bg-black text-white font-black px-3 py-1 inline-block transform rotate-1">
                                                {formatDate(entry.date, "long")}
                                            </span>
                                        </motion.div>
                                    )}
                                    
                                    <motion.div 
                                        whileHover={{ 
                                            scale: 1.02, 
                                            rotate: selectedEntry?.id === entry.id ? -2 : 2,
                                            transition: { duration: 0.2 }
                                        }}
                                        className={`flex items-center p-4 border-4 ${selectedEntry?.id === entry.id ? 'border-black bg-yellow-100' : 'border-gray-300 bg-white hover:border-black'} 
                                            cursor-pointer transition-all duration-200`}
                                        style={selectedEntry?.id === entry.id ? { boxShadow: "6px 6px 0px #000" } : {}}
                                        onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                                    >
                                        <div className={`w-12 h-12 ${getMoodColor(entry.moodValue)} rounded-none flex items-center justify-center mr-4 border-4 border-black`}>
                                            <span className="text-xl">{mood.emoji}</span>
                                        </div>
                                        
                                        <div className="flex-grow">
                                            <div className="flex justify-between">
                                                <p className="font-black">{mood.label}</p>
                                                <p className="text-sm font-bold bg-black text-white px-2 transform rotate-1">{formatTime(entry.date)}</p>
                                            </div>
                                            <p className="text-sm font-bold mt-1">
                                                {entry.wordCount} MOTS • {entry.exerciseType}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })
                    }
                </div>
            </motion.div>
            
            {/* Mood Legend */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-yellow-300 p-4 border-4 border-black"
                style={{ boxShadow: "8px 8px 0px #000" }}
            >
                <div className="flex flex-wrap gap-4 justify-center">
                    {MOODS.map(mood => (
                        <motion.div 
                            key={mood.value} 
                            className="flex items-center bg-white px-3 py-1 border-2 border-black"
                            whileHover={{ rotate: 3, scale: 1.1 }}
                        >
                            <span className="mr-1 text-xl">{mood.emoji}</span>
                            <span className="text-sm font-bold">{mood.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}