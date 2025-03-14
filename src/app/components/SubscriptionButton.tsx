// src/components/SubscriptionButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type SubscriptionButtonProps = {
  isPro: boolean;
};

export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSubscription}
      disabled={isLoading}
      className="w-full bg-black text-white font-black py-3 px-6 text-xl border-4 border-black hover:bg-yellow-300 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ boxShadow: "8px 8px 0px #000" }}
    >
      {isLoading 
        ? 'CHARGEMENT...' 
        : isPro 
          ? 'GÉRER MON ABONNEMENT 🧠' 
          : 'BOOSTER MON CERVEAU 🚀'}
    </motion.button>
  );
}