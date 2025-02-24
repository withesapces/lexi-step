// /lib/userStatsService.ts
import { PrismaClient } from "@prisma/client";
import { startOfDay, subDays, startOfWeek, startOfMonth, endOfDay } from "date-fns";

/**
 * Récupère toutes les statistiques d'écriture pour un utilisateur
 */
export async function getUserWritingStats(prisma: PrismaClient, userId: string) {
  const today = new Date();
  
  // Définir les périodes
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Semaine commence le lundi
  const startOfCurrentMonth = startOfMonth(today);
  
  // Récupérer les stats pour aujourd'hui
  const todayStats = await prisma.writingEntry.aggregate({
    where: {
      userId,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday
      }
    },
    _sum: {
      wordCount: true
    }
  });
  
  // Récupérer les stats pour la semaine en cours
  const weekStats = await prisma.writingEntry.aggregate({
    where: {
      userId,
      createdAt: {
        gte: startOfCurrentWeek
      }
    },
    _sum: {
      wordCount: true
    }
  });
  
  // Récupérer les stats pour le mois en cours
  const monthStats = await prisma.writingEntry.aggregate({
    where: {
      userId,
      createdAt: {
        gte: startOfCurrentMonth
      }
    },
    _sum: {
      wordCount: true
    }
  });
  
  // Récupérer le total de mots tous temps
  const totalStats = await prisma.writingEntry.aggregate({
    where: {
      userId
    },
    _sum: {
      wordCount: true
    }
  });
  
  // Récupérer les réglages utilisateur pour l'objectif quotidien
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  // Récupérer les données de streak
  const streakData = await prisma.writingStreak.findUnique({
    where: { userId }
  });
  
  return {
    today: todayStats._sum.wordCount || 0,
    week: weekStats._sum.wordCount || 0,
    month: monthStats._sum.wordCount || 0,
    total: totalStats._sum.wordCount || 0,
    dailyGoal: userSettings?.dailyWordGoal || 200,
    currentStreak: streakData?.currentStreak || 0,
    longestStreak: streakData?.longestStreak || 0
  };
}

/**
 * Récupère tous les badges d'un utilisateur avec leurs traductions
 */
export async function getUserBadges(prisma: PrismaClient, userId: string, locale = "fr") {
  // Récupérer tous les badges disponibles avec leurs traductions
  const allBadges = await prisma.badge.findMany({
    include: {
      translations: {
        where: { locale }
      }
    }
  });
  
  // Récupérer les badges que l'utilisateur a déjà obtenus
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true }
  });
  
  // Set des IDs de badges obtenus pour recherche rapide
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
  
  // Formater les badges pour l'affichage frontend
  return allBadges.map(badge => {
    const translation = badge.translations[0];
    return {
      id: badge.id,
      name: translation?.name || badge.defaultName || "Badge sans nom",
      description: translation?.description || badge.defaultDescription || "Description non disponible",
      earned: earnedBadgeIds.has(badge.id),
      // Ajouter la catégorie du badge
      category: badge.category || "Autres",
      // Déterminer l'icône en fonction du type de badge
      icon: determineIconForBadge(badge.condition, badge.conditionValue)
    };
  });
}

/**
 * Détermine l'icône appropriée en fonction du type de badge
 */
function determineIconForBadge(condition: string | null, value: number | null): string {
  if (!condition) return "🏆";
  
  switch (condition) {
    case "streak":
      if (value && value >= 30) return "🔥";
      if (value && value >= 21) return "🧠";
      return "📅";
    case "words_total":
      if (value && value >= 50000) return "⚡️";
      if (value && value >= 10000) return "📝";
      return "✍️";
    case "words_week":
      if (value && value >= 5000) return "🏃";
      return "🎯";
    case "topics":
      return "🧐";
    case "no_errors":
      return "🥷";
    case "novel":
      return "📚";
    default:
      return "🏆";
  }
}