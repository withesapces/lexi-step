// src/app/api/auth/check-username/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Récupérer le paramètre username de l'URL
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ 
        available: false, 
        message: "Le paramètre username est requis" 
      }, { status: 400 });
    }

    // Vérifier si le username est trop court
    if (username.length < 3) {
      return NextResponse.json({ 
        available: false, 
        message: "Le pseudo doit contenir au moins 3 caractères" 
      }, { status: 400 });
    }

    // Vérifier si le username contient uniquement des caractères valides (alphanumériques et quelques caractères spéciaux)
    const validUsernameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!validUsernameRegex.test(username)) {
      return NextResponse.json({ 
        available: false, 
        message: "Le pseudo ne peut contenir que des lettres, chiffres, tirets, points et underscores" 
      }, { status: 400 });
    }

    // Vérifier si le username existe déjà dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    return NextResponse.json({ 
      available: !existingUser,
      message: existingUser ? "Ce pseudo est déjà utilisé" : "Ce pseudo est disponible" 
    });
  } catch (error: any) {
    console.error("Erreur lors de la vérification du pseudo:", error?.message || String(error));
    return NextResponse.json({ 
      available: false, 
      message: "Erreur serveur lors de la vérification du pseudo", 
      error: error?.message || String(error) 
    }, { status: 500 });
  }
}