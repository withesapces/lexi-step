// src/app/api/stripe/webhook

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !endpointSecret) {
    return new NextResponse("Webhook signature missing", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    return new NextResponse("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event);
      break;

    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionUpdate(event);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Success", { status: 200 });
}

async function handleCheckoutSessionCompleted(event: any) {
  const session = event.data.object;

  if (!session.customer_email || !session.subscription) {
    console.error("⚠️ Missing email or subscription ID in session.");
    return;
  }

  await prisma.user.update({
    where: { email: session.customer_email },
    data: {
      isPro: true,
      subscription: {
        upsert: {
          create: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            stripePriceId: session.items?.data?.[0]?.price?.id ?? null,
            stripeCurrentPeriodEnd: new Date(session.expires_at * 1000),
          },
          update: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            stripePriceId: session.items?.data?.[0]?.price?.id ?? null,
            stripeCurrentPeriodEnd: new Date(session.expires_at * 1000),
          },
        },
      },
    },
  });

  console.log(`✅ Abonnement activé pour ${session.customer_email}`);
}

async function handleSubscriptionUpdate(event: any) {
  const subscription = event.data.object;

  if (!subscription.customer) {
    console.error("⚠️ Subscription update event missing customer ID.");
    return;
  }

  const user = await prisma.user.findFirst({
    where: { subscription: { stripeCustomerId: subscription.customer } },
    select: { email: true },
  });

  if (!user) {
    console.error("⚠️ User not found for subscription update.");
    return;
  }

  // Vérifier si l'abonnement est annulé
  const isCanceled = subscription.cancel_at_period_end === true || 
                    subscription.status === "canceled";

  await prisma.user.update({
    where: { email: user.email },
    data: {
      isPro: subscription.status === "active",
      subscription: {
        update: {
          stripeSubscriptionId: subscription.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          isCanceled: isCanceled,
        },
      },
    },
  });

  console.log(`🔄 Abonnement mis à jour pour ${user.email} (${subscription.status}), annulé: ${isCanceled}`);
}