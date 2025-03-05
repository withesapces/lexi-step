import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getUserWritingStats } from "@/lib/userStatsService";
import { AVAILABLE_AVATARS } from "@/src/config/avatars";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Trouver l'utilisateur par email et récupérer aussi l'avatar
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, avatar: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Récupérer les statistiques d'écriture
    const stats = await getUserWritingStats(prisma, user.id);

    // Utiliser le premier avatar par défaut de la configuration si aucun avatar n'est défini
    const defaultAvatar = AVAILABLE_AVATARS[0].id;

    // Inclure l'avatar dans la réponse
    return NextResponse.json({
      ...stats,
      avatar: user.avatar || defaultAvatar
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}