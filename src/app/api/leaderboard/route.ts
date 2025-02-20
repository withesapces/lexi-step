import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    // Récupérer les données du leaderboard (même sans être connecté)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        writingStreak: {
          select: {
            currentStreak: true,
            longestStreak: true,
          },
        },
        writingEntries: {
          select: {
            wordCount: true,
          },
        },
        userBadges: {
          select: {
            badgeId: true,
          },
        },
      },
      // Limiter pour des performances optimales
      take: 50,
    });

    // Transformer les données pour le leaderboard
    const leaderboardData = users.map(user => {
      // Calculer le nombre total de mots écrits
      const totalWords = user.writingEntries.reduce(
        (sum, entry) => sum + entry.wordCount, 
        0
      );
      
      // Générer un avatar par défaut basé sur l'id si nécessaire
      // Vous pourriez stocker les avatars dans la DB plus tard
      const avatarOptions = ["🧠", "💃", "🦾", "🤖", "👩‍🚀", "🧙‍♂️", "🦹‍♀️", "🕵️‍♂️", "🧚‍♀️", "🦸‍♂️"];
      const avatarIndex = parseInt(user.id.slice(-1), 16) % avatarOptions.length;
      
      return {
        id: user.id,
        name: user.name,
        streak: user.writingStreak?.currentStreak || 0,
        longestStreak: user.writingStreak?.longestStreak || 0,
        totalWords: totalWords,
        badges: user.userBadges.length,
        avatar: avatarOptions[avatarIndex],
      };
    });

    // Ajouter des statistiques globales si l'utilisateur est connecté
    let userStats = null;
    if (session?.user?.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          writingStreak: {
            select: { currentStreak: true, longestStreak: true }
          },
          writingEntries: {
            select: { wordCount: true }
          },
          userBadges: {
            select: { badgeId: true }
          }
        }
      });

      if (currentUser) {
        // Calculer le rang de l'utilisateur
        const userRank = leaderboardData.findIndex(u => u.id === currentUser.id) + 1;
        const totalUserWords = currentUser.writingEntries.reduce(
          (sum, entry) => sum + entry.wordCount, 
          0
        );

        userStats = {
          rank: userRank,
          streak: currentUser.writingStreak?.currentStreak || 0,
          longestStreak: currentUser.writingStreak?.longestStreak || 0,
          totalWords: totalUserWords,
          badges: currentUser.userBadges.length,
        };
      }
    }

    return NextResponse.json({
      leaderboard: leaderboardData,
      userStats: userStats,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du leaderboard:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du leaderboard" },
      { status: 500 }
    );
  }
}