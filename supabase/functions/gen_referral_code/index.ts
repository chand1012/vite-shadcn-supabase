import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";
import { createClient } from "jsr:@supabase/supabase-js@2";

import headers from "../_shared/headers.ts";
import type { Database } from "../_shared/database.types.ts";
import { randomBytes } from "node:crypto";

function genCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const minLength = 8;
  const maxLength = 16;

  // Generate a secure random byte for length
  const lengthByte = randomBytes(1)[0];
  const length = (lengthByte % (maxLength - minLength + 1)) + minLength;

  // Generate secure random bytes for characters
  const randomBytesForChars = randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomBytesForChars[i] % characters.length);
  }

  return result;
}

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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  // first check if the user has a referral code. If they do, return it
  const { data: referralCodes } = await serviceSupabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id);

  if (referralCodes && referralCodes?.length > 0) {
    return new Response(
      JSON.stringify(referralCodes[0]),
      { headers: { "Content-Type": "application/json", ...headers } },
    );
  }

  // get the stripe coupon called "Referral"

  const { data: coupons } = await stripe.coupons.list();
  const coupon = coupons.find((coupon) => coupon.name === "Referral");

  if (!coupon) {
    return new Response(
      JSON.stringify({ error: "Referral Coupon not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  // create a new promotion code
  const code = genCode();

  await stripe.promotionCodes.create({
    coupon: coupon.id,
    code,
    max_redemptions: 10,
    restrictions: {
      first_time_transaction: true,
    },
  });

  // create a new referral code in the database
  const { data, error } = await serviceSupabase
    .from("referral_codes")
    .insert({
      code,
      user_id: user.id,
    }).select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...headers },
      },
    );
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json", ...headers } },
  );
});
