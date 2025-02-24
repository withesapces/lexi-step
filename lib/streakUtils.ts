// /lib/streakUtils.ts
import type { Prisma } from "@prisma/client";
import { startOfDay, differenceInDays } from "date-fns";

/**
 * Récupère les données de streak d'un utilisateur
 */
export async function getStreakData(prisma: Prisma.TransactionClient, userId: string) {
  // Récupérer la streak de l'utilisateur ou en créer une nouvelle si elle n'existe pas
  let streak = await prisma.writingStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    streak = await prisma.writingStreak.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  }

  return streak;
}

/**
 * Vérifie si l'utilisateur a atteint son objectif journalier
 * Exportée pour pouvoir être utilisée dans d'autres parties de l'application
 */
export async function hasReachedDailyGoal(prisma: Prisma.TransactionClient, userId: string): Promise<boolean> {
  // Récupérer l'objectif quotidien de l'utilisateur
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  const dailyWordGoal = userSettings?.dailyWordGoal || 200; // Valeur par défaut si non définie
  
  // Récupérer le nombre total de mots écrits aujourd'hui
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dailyEntries = await prisma.writingEntry.findMany({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  });
  
  // Calculer le nombre total de mots écrits aujourd'hui
  const totalWordsToday = dailyEntries.reduce((total, entry) => total + entry.wordCount, 0);
  
  // Vérifier si l'objectif est atteint
  return totalWordsToday >= dailyWordGoal;
}

/**
 * Met à jour la streak d'un utilisateur après une nouvelle entrée d'écriture
 */
export async function updateUserStreak(prisma: Prisma.TransactionClient, userId: string) {
  // Vérifier si l'utilisateur a atteint son objectif journalier
  const goalReached = await hasReachedDailyGoal(prisma, userId);
  
  // Si l'objectif n'est pas atteint, ne pas mettre à jour la streak
  if (!goalReached) {
    return await getStreakData(prisma, userId);
  }
  
  // Récupérer la streak actuelle
  const streak = await getStreakData(prisma, userId);
  const today = startOfDay(new Date());
  
  // Par défaut, on suppose que la streak continue
  let currentStreak = streak.currentStreak;
  let longestStreak = streak.longestStreak;
  let lastWritingDay = streak.lastWritingDay;
  
  // Si c'est la première entrée jamais
  if (!lastWritingDay) {
    currentStreak = 1;
    longestStreak = 1;
  } 
  // Si la dernière entrée était aujourd'hui, ne rien changer
  else if (startOfDay(new Date(lastWritingDay)).getTime() === today.getTime()) {
    // Rien à faire, l'utilisateur a déjà écrit aujourd'hui
  }
  // Si la dernière entrée était hier, augmenter la streak
  else if (differenceInDays(today, new Date(lastWritingDay)) === 1) {
    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }
  // Si l'utilisateur a sauté des jours, réinitialiser la streak
  else {
    currentStreak = 1;
  }
  
  // Mettre à jour la streak
  await prisma.writingStreak.upsert({
    where: { userId },
    update: {
      currentStreak,
      longestStreak,
      lastWritingDay: today,
    },
    create: {
      userId,
      currentStreak,
      longestStreak,
      lastWritingDay: today,
    },
  });
  
  // Vérifier si l'utilisateur a débloqué des badges de streak
  await checkStreakBadges(prisma, userId, currentStreak);
  
  return { currentStreak, longestStreak };
}

/**
 * Vérifie si l'utilisateur a débloqué des badges liés à sa streak
 */
async function checkStreakBadges(prisma: Prisma.TransactionClient, userId: string, currentStreak: number) {
  // Récupérer tous les badges de type "streak"
  const streakBadges = await prisma.badge.findMany({
    where: {
      condition: "streak",
      conditionValue: {
        lte: currentStreak
      }
    }
  });
  
  // Pour chaque badge éligible, vérifier s'il est déjà obtenu
  for (const badge of streakBadges) {
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });
    
    // Si le badge n'est pas déjà obtenu, l'attribuer
    if (!existingBadge) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });
    }
  }
}