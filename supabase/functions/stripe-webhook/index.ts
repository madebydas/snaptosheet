import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

serve(async (req) => {
  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by stripe_customer_id
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) break

        // Upsert subscription
        await adminClient
          .from('subscriptions')
          .upsert(
            {
              user_id: profile.id,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id ?? '',
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            },
            { onConflict: 'stripe_subscription_id' },
          )

        // Update profile plan
        const plan = subscription.status === 'active' || subscription.status === 'trialing'
          ? 'pro'
          : 'free'
        await adminClient
          .from('profiles')
          .update({ plan, updated_at: new Date().toISOString() })
          .eq('id', profile.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) break

        await adminClient
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id)

        await adminClient
          .from('profiles')
          .update({ plan: 'free', updated_at: new Date().toISOString() })
          .eq('id', profile.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          await adminClient
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Webhook error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
