// src/config/moods.ts

/**
 * Configuration centralisée des moods pour toute l'application
 */
export interface Mood {
  emoji: string;
  label: string;
  value: string;
  color: string; // Pour les affichages visuels (moodboard, etc.)
  positivityScore?: number; // Score de positivité pour les calculs de hauteur
}

// Base de données des moods disponibles dans l'application
export const MOODS: Mood[] = [
  // Moods positifs
  { emoji: "😊", label: "Joyeux", value: "happy", color: "bg-yellow-400", positivityScore: 90 },
  { emoji: "🥳", label: "Excité", value: "excited", color: "bg-purple-400", positivityScore: 100 },
  { emoji: "😎", label: "Confiant", value: "confident", color: "bg-orange-400", positivityScore: 80 },

  // Moods neutres
  { emoji: "😌", label: "Détendu", value: "relaxed", color: "bg-green-400", positivityScore: 60 },
  { emoji: "🤔", label: "Pensif", value: "thoughtful", color: "bg-cyan-400", positivityScore: 50 },

  // Moods négatifs
  { emoji: "😔", label: "Triste", value: "sad", color: "bg-blue-400", positivityScore: 30 },
  { emoji: "😤", label: "Frustré", value: "frustrated", color: "bg-red-400", positivityScore: 20 },
  { emoji: "😴", label: "Fatigué", value: "tired", color: "bg-gray-400", positivityScore: 10 }
];


/**
 * Fonctions utilitaires pour travailler avec les moods
 */

// Obtenir un mood par sa valeur
export function getMoodByValue(value: string): Mood | undefined {
  return MOODS.find(mood => mood.value === value);
}

// Obtenir un mood par son label
export function getMoodByLabel(label: string): Mood | undefined {
  return MOODS.find(mood => mood.label.toLowerCase() === label.toLowerCase());
}

// Mapping pour la compatibilité entre les anciens formats et le nouveau
export const MOOD_LEGACY_MAPPING: Record<string, string> = {
  "heureux": "happy",
  "joyeux": "happy",
  "content": "happy",
  
  "détendu": "relaxed",
  "calme": "relaxed",
  "serein": "relaxed",
  
  "pensif": "thoughtful",
  "réfléchi": "thoughtful",
  "curieux": "thoughtful",
  
  "triste": "sad",
  "mélancolique": "sad",
  "nostalgique": "sad",
  
  "frustré": "frustrated",
  "énervé": "frustrated",
  "agacé": "frustrated",
  
  "fatigué": "tired",
  "épuisé": "tired",
  "las": "tired",
  
  "excité": "excited",
  "enthousiaste": "excited",
  "inspiré": "excited",
  
  "confiant": "confident",
  "sûr": "confident",
  "déterminé": "confident"
};

// Convertir les anciennes valeurs de mood vers le nouveau format
export function normalizeMoodValue(value: string): string {
  // Si c'est déjà un format valide
  if (MOODS.some(m => m.value === value)) {
    return value;
  }
  
  // Si c'est un ancien format connu
  if (value.toLowerCase() in MOOD_LEGACY_MAPPING) {
    return MOOD_LEGACY_MAPPING[value.toLowerCase()];
  }
  
  // Valeur par défaut
  return "thoughtful";
}

/**
 * Calcule la hauteur d'affichage en fonction du type d'humeur
 * Plus l'humeur est positive, plus la barre sera haute
 * @param mood Objet mood ou valeur de mood
 * @param maxHeight Hauteur maximale en pixels (optionnel, défaut: 200)
 * @returns Hauteur en pixels (format string avec 'px')
 */
export function calculateMoodHeight(mood: Mood | string, maxHeight: number = 200): string {
  // Si on reçoit une chaîne, on récupère l'objet mood correspondant
  const moodObj = typeof mood === 'string' ? getMoodByValue(mood) : mood;
  
  // Valeur par défaut (milieu) si l'humeur n'est pas trouvée
  if (!moodObj) {
    return `${maxHeight / 2}px`;
  }
  
  // Utiliser le score de positivité défini dans l'objet mood
  const positivityScore = moodObj.positivityScore !== undefined ? moodObj.positivityScore : 50;
  
  // Convertir le score en hauteur réelle
  const heightValue = (positivityScore / 100) * maxHeight;
  
  return `${heightValue}px`;
}