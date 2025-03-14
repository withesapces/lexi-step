// src/app/api/stripe/resubscribe/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (!subscriptionPlan.stripeCustomerId || !subscriptionPlan.stripeSubscriptionId) {
      return new NextResponse("Aucun abonnement trouvé", { status: 404 });
    }

    // Si l'abonnement a expiré, créer une nouvelle session de paiement
    if (subscriptionPlan.isExpired) {
      const checkoutSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?checkout_success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?checkout_canceled=true`,
        customer: subscriptionPlan.stripeCustomerId,
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        mode: "subscription",
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Sinon, réactiver l'abonnement existant
    await stripe.subscriptions.update(subscriptionPlan.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Mettre à jour la base de données
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionPlan.stripeSubscriptionId },
      data: { isCanceled: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la reprise d'abonnement:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}