import type { Context } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export default async (req: Request, _context: Context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    const siteUrl = process.env.URL || "https://imgtosheet.com"

    if (!stripeSecretKey || !supabaseUrl || !serviceRoleKey || !anonKey) {
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: jsonHeaders },
      )
    }

    // Verify user JWT
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: jsonHeaders },
      )
    }

    const token = authHeader.replace("Bearer ", "")
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: jsonHeaders },
      )
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const stripe = new Stripe(stripeSecretKey)

    const { priceId, planType } = await req.json()

    if (!priceId || !planType) {
      return new Response(
        JSON.stringify({ error: "Missing priceId or planType" }),
        { status: 400, headers: jsonHeaders },
      )
    }

    // Get or create Stripe customer
    const { data: profile } = await adminClient
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email || "",
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await adminClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    // Create checkout session — subscription for monthly/yearly, payment for lifetime
    const isLifetime = planType === "lifetime"

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isLifetime ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/callback?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/callback?checkout=cancel`,
      metadata: { user_id: user.id, plan_type: planType },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: jsonHeaders },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Checkout failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
}
