// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import Stripe from "npm:stripe";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

import headers from "../_shared/headers.ts";
import type { Database } from "../_shared/database.types.ts";

const RETURN_URL = Deno.env.get("RETURN_REDIRECT_URL")!;

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers,
    });
  }

  // create a new supabase instance
  const supabase = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Get the session or user object
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabase.auth.getUser(token);
  const user = data.user;

  // if the user is not found, return an error
  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  // select their customer id from the customers table
  const { data: customerData, error } = await supabase
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  const { stripe_customer_id } = customerData;

  if (!stripe_customer_id) {
    return new Response(
      JSON.stringify({ error: "No customer found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    return_url: RETURN_URL,
  });

  // like we do in the other functions, return the session URL as a JSON response
  return new Response(
    JSON.stringify({ url: session.url }),
    {
      headers: { "Content-Type": "application/json", ...headers },
    },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/billing' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
