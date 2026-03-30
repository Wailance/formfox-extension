"use server";

import Stripe from "stripe";

export async function createCheckoutSession() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { enabled: false, message: "Stripe is not configured yet." };
  }

  const stripe = new Stripe(secretKey);
  return {
    enabled: true,
    message: "Stripe client initialized. Checkout session wiring is pending.",
    apiVersion: stripe.getApiField("version")
  };
}
