// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";
import { createClient } from "jsr:@supabase/supabase-js@2";

import headers from "../_shared/headers.ts";
import type { Database } from "../_shared/database.types.ts";
type CheckoutRequest = {
  price?: string;
};

const SUCCESS_REDIRECT_URL = Deno.env.get("SUCCESS_REDIRECT_URL")!;
const CANCEL_REDIRECT_URL = Deno.env.get("CANCEL_REDIRECT_URL")!;

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers,
    });
  }
  const authHeader = req.headers.get("Authorization")!;
  // create a new supabase instance
  const supabase = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );

  const serviceSupabase = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { price } = await req.json() as CheckoutRequest;

  if (!price) {
    return new Response(
      JSON.stringify({ error: "Price is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  // see if there's a corresponding customer in the database
  // if there is, use the customer's email to create the session
  // if not, create a new customer
  const { data, error } = await serviceSupabase.from("customers").select(
    "*",
  ).eq("id", user.id);

  // if there's an error, return it
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  let customerData = data?.[0];

  // create a new customer on stripe if one doesn't exist
  if (!customerData) {
    // first see if the user has a stripe customer id from the stripe api
    const existingCustomers = await stripe.customers.list({
      email: user.email,
    });

    // find the first customer id that matches the user's email
    const existingCustomer = existingCustomers.data.find(
      (customer) => customer.email === user.email,
    );

    // if the customer exists, insert the customer into the database
    if (existingCustomer) {
      const { error } = await serviceSupabase.from("customers").insert({
        id: user.id,
        stripe_customer_id: existingCustomer.id,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...headers },
          },
        );
      }

      customerData = {
        id: user.id,
        stripe_customer_id: existingCustomer.id,
      };
    } else {
      // create a new customer on stripe since one doesn't exist
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
      });

      console.log({ stripeCustomer });

      // insert the customer into the database
      const { error } = await serviceSupabase.from("customers").insert({
        id: user.id,
        stripe_customer_id: stripeCustomer.id,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...headers },
          },
        );
      }

      customerData = {
        id: user.id,
        stripe_customer_id: stripeCustomer.id,
      };
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price,
      quantity: 1,
    }],
    mode: "subscription",
    success_url: SUCCESS_REDIRECT_URL,
    cancel_url: CANCEL_REDIRECT_URL,
    automatic_tax: { enabled: false },
    customer: customerData?.stripe_customer_id as string | undefined,
  });

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { "Content-Type": "application/json", ...headers } },
  );
});
