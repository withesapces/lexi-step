// /lib/streakUtils.ts
import { PrismaClient } from "@prisma/client";
import { startOfDay, differenceInDays } from "date-fns";

/**
 * Récupère les données de streak d'un utilisateur
 */
export async function getStreakData(prisma: PrismaClient, userId: string) {
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
 * Met à jour la streak d'un utilisateur après une nouvelle entrée d'écriture
 */
export async function updateUserStreak(prisma: PrismaClient, userId: string) {
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
async function checkStreakBadges(prisma: PrismaClient, userId: string, currentStreak: number) {
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