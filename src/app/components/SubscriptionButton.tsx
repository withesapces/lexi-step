// src/components/SubscriptionButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <button
      onClick={handleSubscription}
      disabled={isLoading}
      className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {isLoading 
        ? 'Chargement...' 
        : isPro 
          ? 'Gérer mon abonnement' 
          : 'Passer à la version Pro'}
    </button>
  );
}