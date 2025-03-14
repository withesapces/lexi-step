// src/app/api/stripe/subscription/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? "" }, 
    select: {
      isPro: true,
      subscription: {
        select: {
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          isCanceled: true,  // Ajoutez cette ligne pour récupérer le champ isCanceled
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ isPro: false, isCanceled: false });
  }

  const isPro = user.isPro;
  const subscription = user.subscription ?? null;
  
  // Vérifiez d'abord si la période est expirée
  const isExpired = subscription?.stripeSubscriptionId
    ? new Date(subscription.stripeCurrentPeriodEnd ?? 0).getTime() < new Date().getTime()
    : false;
    
  // Utilisez soit la valeur explicite de isCanceled de la base de données, soit false si elle n'existe pas
  const isCanceled = subscription?.isCanceled || false;

  return NextResponse.json({
    isPro,
    isCanceled,  // Cette valeur reflète maintenant l'état réel dans la base de données
    isExpired,    // Vous pouvez ajouter ce champ si vous en avez besoin
    stripeCustomerId: subscription?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
    stripeCurrentPeriodEnd: subscription?.stripeCurrentPeriodEnd ?? null,
  });
}