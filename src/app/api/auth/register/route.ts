import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Content-Type incorrect" }, { status: 400 });
    }

    const bodyText = await req.text();

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

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Les mots de passe ne correspondent pas" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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
