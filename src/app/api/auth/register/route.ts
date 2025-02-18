import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
console.log("PrismaClient initialisé");
console.log("DATABASE_URL :", process.env.DATABASE_URL);

export async function POST(req: Request) {
  try {
    console.log("✅ Requête reçue à /api/auth/register");

    const contentType = req.headers.get("content-type");
    console.log("📝 Content-Type reçu :", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Content-Type incorrect" }, { status: 400 });
    }

    const bodyText = await req.text();
    console.log("📦 Données reçues brutes :", bodyText);

    if (!bodyText || bodyText.trim() === "") {
      console.error("❌ Le corps de la requête est vide.");
      return NextResponse.json({ message: "Requête invalide (corps vide)" }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (jsonError) {
      console.error("❌ Erreur lors du parsing JSON :", jsonError);
      return NextResponse.json({ message: "Format JSON invalide" }, { status: 400 });
    }

    const { name, email, password, confirmPassword } = body;
    console.log("🧑 Nom :", name);
    console.log("📧 Email :", email);

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Les mots de passe ne correspondent pas" }, { status: 400 });
    }

    console.log("🔍 Vérification de l'utilisateur existant...");
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.warn("⚠️ Cet email est déjà utilisé :", email);
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    console.log("🔒 Hashage du mot de passe...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Mot de passe hashé :", hashedPassword);

    console.log("📝 Création de l'utilisateur...");
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log("✅ Utilisateur créé :", newUser);

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    // Utilisation d'une variable intermédiaire pour s'assurer d'avoir une chaîne
    const errorMessage = error?.message || "Erreur inconnue";
    // On évite de logger directement l'objet d'erreur s'il est null
    console.error("❌ Erreur dans l'API register :", errorMessage);
    return NextResponse.json(
      { message: "Erreur serveur", error: errorMessage },
      { status: 500 }
    );
  }
}
