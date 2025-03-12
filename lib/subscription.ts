// lib/subscription.ts

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export async function getUserSubscriptionPlan() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user) {
      return {
        isPro: false,
        isCanceled: false,
      };
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email ?? '' }, // 🔥 Vérifie que `email` n'est pas null
      select: {
        isPro: true,
        subscription: {
          select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
          },
        },
      },
    });
  
    if (!user) {
      return {
        isPro: false,
        isCanceled: false,
      };
    }
  
    const isPro = user.isPro;
    const subscription = user.subscription ?? null; // 🔥 Ajoute une valeur par défaut
  
    const isCanceled = subscription?.stripeSubscriptionId
      ? new Date(subscription.stripeCurrentPeriodEnd ?? 0).getTime() < new Date().getTime()
      : false;
  
    return {
      isPro,
      isCanceled,
      stripeCustomerId: subscription?.stripeCustomerId ?? null,
      stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
      stripeCurrentPeriodEnd: subscription?.stripeCurrentPeriodEnd ?? null,
    };
  }
  