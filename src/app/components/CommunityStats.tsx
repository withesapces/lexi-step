// components/CommunityStats.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CommunityStats {
  wordsToday: number;
  streakingMembers: number;
  onlineWriters: number;
}

export default function CommunityStats() {
  const [stats, setStats] = useState<CommunityStats>({
    wordsToday: 0,
    streakingMembers: 0,
    onlineWriters: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/community');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching community stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-black text-white mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-black mb-6">
              <span className="bg-yellow-300 text-black px-4 py-2 inline-block transform -rotate-3" 
                    style={{boxShadow: "5px 5px 0 rgba(255,255,255,0.5)"}}>
                STATS COMMUNAUTÉ
              </span>
            </h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-white bg-opacity-10"></div>
                  <div className="h-16 bg-white bg-opacity-10"></div>
                  <div className="h-16 bg-white bg-opacity-10"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between bg-white bg-opacity-10 p-4 border-l-4 border-yellow-300 transform -rotate-1">
                    <span className="font-bold text-lg">Mots écrits aujourd'hui:</span>
                    <span className="font-black text-xl text-yellow-300">
                      {stats.wordsToday.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between bg-white bg-opacity-10 p-4 border-l-4 border-yellow-300 transform rotate-1">
                    <span className="font-bold text-lg">Membres en streak (7+ jours):</span>
                    <span className="font-black text-xl text-yellow-300">
                      {stats.streakingMembers}
                    </span>
                  </div>
                  <div className="flex justify-between bg-white bg-opacity-10 p-4 border-l-4 border-yellow-300 transform -rotate-1">
                    <span className="font-bold text-lg">Écrivains en ligne:</span>
                    <span className="font-black text-xl text-yellow-300">
                      {stats.onlineWriters}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Rest of your component remains the same */}
          <div className="w-full md:w-1/2 bg-yellow-300 text-black p-6 border-4 border-white transform rotate-2" 
               style={{
                 clipPath: "polygon(0% 0%, 98% 2%, 100% 98%, 2% 100%)",
                 boxShadow: "12px 12px 0 rgba(255,255,255,0.3)"
               }}>
            <h3 className="text-2xl font-black mb-4 bg-black text-white inline-block px-3 py-1 transform -rotate-2">
              RAPPEL NEUROSCIENTIFIQUE 🧠
            </h3>
            <p className="font-bold mb-4 text-lg">
              Écrire 200-1000 mots quotidiennement pendant 30 jours consécutifs améliore:
            </p>
            <ul className="font-medium">
              <li className="mb-2 bg-black bg-opacity-10 p-2 border-l-4 border-black transform -rotate-1">
                <span className="font-black mr-2">+28%</span> Mémoire à court terme
              </li>
              <li className="mb-2 bg-black bg-opacity-10 p-2 border-l-4 border-black transform rotate-1">
                <span className="font-black mr-2">+37%</span> Créativité générale
              </li>
              <li className="mb-2 bg-black bg-opacity-10 p-2 border-l-4 border-black transform -rotate-1">
                <span className="font-black mr-2">+42%</span> Résolution de problèmes
              </li>
              <li className="bg-black bg-opacity-10 p-2 border-l-4 border-black transform rotate-1">
                <span className="font-black mr-2">+53%</span> Clarté mentale
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}