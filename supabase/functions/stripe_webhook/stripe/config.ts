import { Stripe } from "https://esm.sh/stripe@17.2.0";

export const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY_LIVE") ?? Deno.env.get("STRIPE_SECRET_KEY") ??
    "",
);
