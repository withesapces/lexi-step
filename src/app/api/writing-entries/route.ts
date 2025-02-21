// /app/api/writing-entries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    
    // Récupérer toutes les entrées d'écriture de l'utilisateur
    const entries = await prisma.writingEntry.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transformer les données pour correspondre à l'interface WritingEntry du frontend
    const writings = entries.map(entry => ({
      id: entry.id,
      title: entry.title || "Sans titre",
      content: entry.content,
      wordCount: entry.wordCount,
      exerciseType: entry.exerciseType,
      createdAt: entry.createdAt.toISOString(),
      userMood: entry.userMood || undefined
    }));
    
    return NextResponse.json({ writings });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des entrées:", error);
    
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}