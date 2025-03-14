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
    where: { email: session.user.email ?? '' },
    select: {
      isPro: true,
      subscription: {
        select: {
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
          stripeCustomerId: true,
          isCanceled: true,
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
  const subscription = user.subscription ?? null;

  // Combiner les deux conditions: date expirée OU marquée comme annulée
  const isExpired = subscription?.stripeCurrentPeriodEnd 
    ? new Date(subscription.stripeCurrentPeriodEnd).getTime() < new Date().getTime()
    : false;
    
  const isCanceled = subscription?.isCanceled || false;

  return {
    isPro,
    isCanceled,
    isExpired,
    stripeCustomerId: subscription?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
    stripeCurrentPeriodEnd: subscription?.stripeCurrentPeriodEnd ?? null,
  };
}