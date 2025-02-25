// lib/auth.ts

import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email ou Pseudo", type: "text", placeholder: "Votre email ou pseudo" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          throw new Error("Identifiant et mot de passe sont requis");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ],
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            username: true 
          }
        });
        
        if (!user) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // Ajoutez un callback jwt pour inclure username dans le token
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    
    // Modifiez le callback session pour inclure username
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.username = token.username as string; // Ajoutez le username à la session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};