// /app/api/writing/freewrite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStreakData, updateUserStreak } from "@/lib/streakUtils";
import { checkAndAwardBadges } from "@/lib/badgeService";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupérer l'utilisateur à partir de l'email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    // Récupérer toutes les entrées d'écriture libre de l'utilisateur
    const entries = await prisma.freeWritingEntry.findMany({
      where: {
        writingEntry: {
          userId: user.id,
          exerciseType: "ECRITURE_LIBRE"
        }
      },
      include: {
        writingEntry: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limiter aux 10 dernières entrées
    });
    
    return NextResponse.json({ entries });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des entrées:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupérer les données du corps de la requête
    const data = await req.json();
    const { title, content, wordCount, exerciseType, userMood } = data;
    
    // Validation des données
    if (!content || !wordCount) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }
    
    // Récupérer l'utilisateur à partir de l'email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    // Créer une nouvelle entrée d'écriture avec transaction pour garantir l'intégrité
    const result = await prisma.$transaction(async (tx) => {
      // 1. Créer l'entrée d'écriture principale
      const writingEntry = await tx.writingEntry.create({
        data: {
          userId: user.id,
          title: title || "Écriture libre",
          content,
          wordCount,
          exerciseType: "ECRITURE_LIBRE",
          userMood,
        },
      });
      
      // 2. Créer l'entrée spécifique d'écriture libre
      const freeWritingEntry = await tx.freeWritingEntry.create({
        data: {
          entryId: writingEntry.id,
        },
      });
      
      // 3. Mettre à jour la streak de l'utilisateur
      await updateUserStreak(tx, user.id);
      
      // 4. Vérifier et attribuer de nouveaux badges
      const newBadges = await checkAndAwardBadges(tx, user.id, wordCount);
      
      return {
        id: freeWritingEntry.id,
        writingEntryId: writingEntry.id,
        newBadges // Ajouter les nouveaux badges à la réponse
      };
    });
    
    // Vérifier si de nouveaux badges ont été attribués
    const newBadgesEarned = result.newBadges && result.newBadges.length > 0;
    
    return NextResponse.json({ 
      success: true,
      id: result.id,
      message: "Entrée d'écriture libre créée avec succès",
      newBadges: newBadgesEarned ? result.newBadges : undefined,
      badgesEarned: newBadgesEarned // Indicateur si des badges ont été gagnés
    });
    
  } catch (error) {
    console.error("Erreur lors de la création de l'entrée:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
