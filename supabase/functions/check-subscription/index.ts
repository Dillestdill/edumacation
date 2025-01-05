import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the user's JWT token from the request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Authentication failed')
    }

    const email = user.email
    if (!email) {
      console.error('No email found for user:', user.id)
      throw new Error('No email found')
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not found')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    console.log('Checking subscription for email:', email)

    // Get customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    if (customers.data.length === 0) {
      console.log('No customer found for email:', email)
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          isInTrial: false,
          trialEndsAt: null
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Check for active subscription or trial
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1
    })

    const hasActiveSubscription = subscriptions.data.length > 0
    let isInTrial = false
    let trialEndsAt = null

    if (hasActiveSubscription) {
      const subscription = subscriptions.data[0]
      isInTrial = subscription.status === 'active' && 
                  subscription.trial_end !== null && 
                  subscription.trial_end > Math.floor(Date.now() / 1000)
      trialEndsAt = subscription.trial_end
    }

    console.log('Subscription status:', {
      hasActiveSubscription,
      isInTrial,
      trialEndsAt
    })

    return new Response(
      JSON.stringify({ 
        subscribed: hasActiveSubscription,
        isInTrial,
        trialEndsAt
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in check-subscription:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        subscribed: false,
        isInTrial: false,
        trialEndsAt: null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Changed to 200 to handle errors gracefully on client
      }
    )
  }
})