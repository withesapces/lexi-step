// src/app/api/user/mood/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeMoodValue } from '../../../../config/moods';

export async function GET() {
  // Vérifier si l'utilisateur est authentifié
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // Récupérer l'ID de l'utilisateur à partir de son email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer l'historique des entrées d'écriture avec mood
    const entries = await prisma.writingEntry.findMany({
      where: {
        userId: user.id,
        OR: [
          { userMood: { not: null } },
          { journalEntry: { isNot: null } }
        ]
      },
      select: {
        id: true,
        wordCount: true,
        userMood: true,
        exerciseType: true,
        createdAt: true,
        journalEntry: {
          select: {
            mood: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limiter aux 20 dernières entrées
    });

    // Transformer les données pour l'affichage
    const moodHistory = entries.map(entry => {
      // Utiliser userMood s'il existe, sinon utiliser journalEntry.mood
      const moodValue = entry.userMood || (entry.journalEntry?.mood) || 'thoughtful';
      
      return {
        id: entry.id,
        date: entry.createdAt.toISOString(),
        moodValue: moodValue,
        wordCount: entry.wordCount,
        exerciseType: entry.exerciseType
      };
    });

    return NextResponse.json(moodHistory);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des moods:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}