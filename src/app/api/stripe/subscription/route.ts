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
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ isPro: false, isCanceled: false });
  }

  const isPro = user.isPro;
  const subscription = user.subscription ?? null;
  const isCanceled = subscription?.stripeSubscriptionId
    ? new Date(subscription.stripeCurrentPeriodEnd ?? 0).getTime() < new Date().getTime()
    : false;

  return NextResponse.json({
    isPro,
    isCanceled,
    stripeCustomerId: subscription?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscription?.stripeSubscriptionId ?? null,
    stripeCurrentPeriodEnd: subscription?.stripeCurrentPeriodEnd ?? null,
  });
}
