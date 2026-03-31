import type { Context } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export default async (req: Request, _context: Context) => {
  const jsonHeaders = { "Content-Type": "application/json" }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const stripe = new Stripe(stripeSecretKey)
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        { status: 400, headers: jsonHeaders },
      )
    }

    switch (event.type) {
      // Lifetime one-time payment completed
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === "payment" && session.metadata?.plan_type === "lifetime") {
          const userId = session.metadata.user_id
          if (userId) {
            await adminClient
              .from("profiles")
              .update({ plan: "lifetime", updated_at: new Date().toISOString() })
              .eq("id", userId)
          }
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await adminClient
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) break

        // Determine plan type from metadata or price interval
        const interval = subscription.items.data[0]?.price?.recurring?.interval
        const planType = interval === "year" ? "yearly" : "monthly"

        // Upsert subscription record
        await adminClient
          .from("subscriptions")
          .upsert(
            {
              user_id: profile.id,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id ?? "",
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            { onConflict: "stripe_subscription_id" },
          )

        // Update profile plan
        const plan = subscription.status === "active" || subscription.status === "trialing"
          ? planType
          : "free"
        await adminClient
          .from("profiles")
          .update({ plan, updated_at: new Date().toISOString() })
          .eq("id", profile.id)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await adminClient
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) break

        await adminClient
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subscription.id)

        // Only downgrade if not a lifetime user
        const { data: currentProfile } = await adminClient
          .from("profiles")
          .select("plan")
          .eq("id", profile.id)
          .single()

        if (currentProfile?.plan !== "lifetime") {
          await adminClient
            .from("profiles")
            .update({ plan: "free", updated_at: new Date().toISOString() })
            .eq("id", profile.id)
        }

        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          await adminClient
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId)
        }
        break
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: jsonHeaders },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Webhook error" }),
      { status: 400, headers: jsonHeaders },
    )
  }
}
