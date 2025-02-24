// /lib/badgeService.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserWritingStats } from "./userStatsService";

/**
 * Vérifie et attribue des badges à un utilisateur après une soumission d'écriture
 */
export async function checkAndAwardBadges(
  prisma: PrismaClient | Prisma.TransactionClient,
  userId: string,
  currentWordCount: number
) {
  // Récupérer les statistiques de l'utilisateur
  const stats = await getUserWritingStats(prisma as PrismaClient, userId);

  const enhancedStats = {
    ...stats,
    // La soumission actuelle peut ne pas être comptabilisée dans stats.today si la transaction n'est pas encore validée
    currentSubmission: currentWordCount,
  };
  
  // Récupérer tous les badges que l'utilisateur n'a pas encore obtenus
  const unearnedBadges = await prisma.badge.findMany({
    where: {
      userBadges: {
        none: {
          userId
        }
      }
    }
  });
  
  // Liste des badges à attribuer
  const badgesToAward = [];
  
  // Vérifier chaque badge en fonction de sa condition
  for (const badge of unearnedBadges) {
    if (!badge.condition || !badge.conditionValue) continue;
    
    let awarded = false;
    
    switch (badge.condition) {
      case "streak":
        // Vérifier si l'utilisateur a atteint la streak requise
        if (stats.currentStreak >= badge.conditionValue) {
          awarded = true;
        }
        break;
        
      case "total_words":
        // Vérifier si l'utilisateur a écrit le nombre total de mots requis
        if (stats.total >= badge.conditionValue) {
          awarded = true;
        }
        break;
        
      // TODO : Faire ici
      case "session_words":
        // Vérifier si l'utilisateur a écrit le nombre de mots dans une session requis
        if (enhancedStats.currentSubmission >= badge.conditionValue) {
          awarded = true;
        }
        break;
        
      case "weekly_goal":
        // Vérifier si l'utilisateur a écrit le nombre de mots quotidien requis
        if (stats.week >= badge.conditionValue) {
          awarded = true;
        }
        break;
    }
    
    // Si le badge doit être attribué, l'ajouter à la liste
    if (awarded) {
      badgesToAward.push({
        badgeId: badge.id,
        userId
      });
    }
  }
  
  // Attribuer les badges si nécessaire
  if (badgesToAward.length > 0) {
    await prisma.userBadge.createMany({
      data: badgesToAward
    });
    
    // Retourner les badges nouvellement attribués pour notification
    return badgesToAward;
  }
  
  return [];
}