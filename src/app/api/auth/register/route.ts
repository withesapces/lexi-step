// src/app/api/auth/register/route.ts

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

    // Récupération des données du formulaire
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

    const { name, username, email, password, confirmPassword } = body;

    // Vérifications de base
    if (!name || !username || !email || !password) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Les mots de passe ne correspondent pas" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
    }

    // Vérification que le username est conforme aux règles
    const validUsernameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!validUsernameRegex.test(username)) {
      return NextResponse.json({ 
        message: "Le pseudo ne peut contenir que des lettres, chiffres, tirets, points et underscores" 
      }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ message: "Le pseudo doit contenir au moins 3 caractères" }, { status: 400 });
    }

    // Vérification que l'email n'existe pas déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    // Vérification que le username n'existe pas déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json({ message: "Ce pseudo est déjà utilisé" }, { status: 400 });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    // On ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Erreur dans l'API register :", error?.message || String(error));
    return NextResponse.json({ message: "Erreur serveur", error: error?.message || String(error) }, { status: 500 });
  }
}