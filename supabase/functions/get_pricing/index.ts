// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";
import headers from "../_shared/headers.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

// from a list of products, get the pricing for each product from stripe
const products = Deno.env.get("PRODUCTS")!.split(",");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    // allow all
    return new Response(null, {
      headers,
    });
  }
  // for each product, get the pricing for the yearly and monthly plans
  const prices = await Promise.all(
    products.map(async (product) => {
      const prices = await stripe.prices.list({ product });
      const productMetadata = await stripe.products.retrieve(product);
      return {
        ...productMetadata,
        prices: prices.data.map((price) => ({
          id: price.id,
          name: price.nickname,
          amount: price.unit_amount,
          currency: price.currency,
        })),
      };
    }),
  );

  return new Response(
    JSON.stringify(prices),
    { headers: { "Content-Type": "application/json", ...headers } },
  );
});
