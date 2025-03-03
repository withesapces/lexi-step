// /app/api/writing-entries/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const entryId = id;
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
    
    // Vérifier si l'entrée existe et appartient à l'utilisateur
    const entry = await prisma.writingEntry.findUnique({
      where: { id: entryId }
    });
    
    if (!entry) {
      return NextResponse.json(
        { error: "Entrée non trouvée" },
        { status: 404 }
      );
    }
    
    if (entry.userId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette entrée" },
        { status: 403 }
      );
    }
    
    // Utiliser une transaction pour supprimer l'entrée et ses références
    await prisma.$transaction(async (tx) => {
      // Supprimer les entrées spécifiques (journal intime, écriture libre, etc.)
      // selon le type d'exercice
      switch (entry.exerciseType) {
        case "JOURNAL_INTIME":
          await tx.journalEntry.deleteMany({
            where: { entryId: entryId }
          });
          break;
        case "ECRITURE_LIBRE":
          await tx.freeWritingEntry.deleteMany({
            where: { entryId: entryId }
          });
          break;
        case "PROMPT_WRITING":
          await tx.promptWritingEntry.deleteMany({
            where: { entryId: entryId }
          });
          break;
      }
      
      // Supprimer l'entrée principale
      await tx.writingEntry.delete({
        where: { id: entryId }
      });
    });
    
    return NextResponse.json({
      success: true,
      message: "Entrée supprimée avec succès"
    });
    
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entrée:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
