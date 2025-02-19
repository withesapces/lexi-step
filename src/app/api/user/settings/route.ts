import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Récupérer les réglages ou créer des réglages par défaut si inexistants
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    });
    
    if (!settings) {
      // Créer des réglages par défaut
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          dailyWordGoal: 200
        }
      });
      
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réglages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    const { dailyWordGoal } = await request.json();
    
    if (typeof dailyWordGoal !== 'number' || dailyWordGoal < 100 || dailyWordGoal > 5000) {
      return NextResponse.json(
        { error: "Objectif quotidien invalide. Doit être entre 100 et 5000." },
        { status: 400 }
      );
    }
    
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Mettre à jour ou créer les réglages
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { dailyWordGoal },
      create: {
        userId: user.id,
        dailyWordGoal
      }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des réglages:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
