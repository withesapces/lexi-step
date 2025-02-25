// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Vérification du Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Content-Type incorrect" }, { status: 400 });
    }

    // Lecture et parsing du corps de la requête
    const bodyText = await req.text();
    if (!bodyText || bodyText.trim() === "") {
      return NextResponse.json({ message: "Requête invalide (corps vide)" }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (jsonError) {
      return NextResponse.json({ message: "Format JSON invalide" }, { status: 400 });
    }

    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ message: "Identifiant et mot de passe sont requis" }, { status: 400 });
    }

    // Recherche de l'utilisateur par email ou username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ],
      },
    });
    
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 });
    }

    // Pour l'instant, on retourne simplement l'utilisateur et un message de succès.
    // En production, vous devriez créer une session ou retourner un token JWT.
    return NextResponse.json({ message: "Connexion réussie", user }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Erreur dans l'API login :", error?.message || String(error));
    return NextResponse.json({ message: "Erreur serveur", error: error?.message || String(error) }, { status: 500 });
  }
}