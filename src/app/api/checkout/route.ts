import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_MAP: Record<string, string> = {
  integrator: process.env.STRIPE_INTEGRATOR_PRICE_ID!,
  agent: process.env.STRIPE_AGENT_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    const { type, listingName, email } = await req.json();

    if (!type || !listingName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: type, listingName, email" },
        { status: 400 }
      );
    }

    const priceId = PRICE_MAP[type];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid listing type. Must be 'integrator' or 'agent'." },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "https://onboardsuccess.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { listingName, type },
      success_url: `${origin}/featured/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/featured/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
