const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  // Create Featured Integrator Listing product
  const integratorProduct = await stripe.products.create({
    name: "Featured Integrator Listing",
    description:
      "Priority placement, gold badge, and increased visibility for your integrator listing on OnboardSuccess.",
  });

  const integratorPrice = await stripe.prices.create({
    product: integratorProduct.id,
    unit_amount: 4900, // $49.00
    currency: "usd",
    recurring: { interval: "month" },
  });

  console.log("Featured Integrator Listing:");
  console.log(`  Product ID: ${integratorProduct.id}`);
  console.log(`  Price ID:   ${integratorPrice.id}`);
  console.log();

  // Create Featured Agent Listing product
  const agentProduct = await stripe.products.create({
    name: "Featured Agent Listing",
    description:
      "Priority placement, gold badge, and increased visibility for your agent listing on OnboardSuccess.",
  });

  const agentPrice = await stripe.prices.create({
    product: agentProduct.id,
    unit_amount: 4900, // $49.00
    currency: "usd",
    recurring: { interval: "month" },
  });

  console.log("Featured Agent Listing:");
  console.log(`  Product ID: ${agentProduct.id}`);
  console.log(`  Price ID:   ${agentPrice.id}`);
  console.log();

  console.log("Add these to your .env.local:");
  console.log(`STRIPE_INTEGRATOR_PRICE_ID=${integratorPrice.id}`);
  console.log(`STRIPE_AGENT_PRICE_ID=${agentPrice.id}`);
}

main().catch(console.error);
