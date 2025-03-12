// src/app/api/stripe/create-checkout/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { absoluteUrl } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Non authentifié', { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }

    // Rediriger vers la gestion d'abonnement si déjà abonné
    if (user.isPro && user.subscription?.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.subscription.stripeCustomerId,
        return_url: absoluteUrl('/account'),
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // Sinon, créer une session de paiement
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: absoluteUrl('/settings?success=true'),
      cancel_url: absoluteUrl('/settings?canceled=true'),
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return new NextResponse('Erreur interne', { status: 500 });
  }
}