const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables.' })
    };
  }

  try {
    const { userId, email, plan = 'pro' } = JSON.parse(event.body);

    if (!userId || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId and email are required' })
      };
    }

    // Get the correct price ID based on plan
    const priceId = plan === 'basic'
      ? process.env.STRIPE_BASIC_PRICE_ID
      : process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Price ID not configured for ${plan} plan` })
      };
    }

    // Verify user exists in Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    // Check for existing subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          supabase_user_id: userId
        }
      });
      customerId = customer.id;

      // Update subscription record with Stripe customer ID
      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Get the site URL for redirects
    const siteUrl = process.env.URL || 'http://localhost:5173';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${siteUrl}/studio?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=canceled`,
      metadata: {
        userId: userId,
        plan: plan
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan
        }
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Checkout session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to create checkout session' })
    };
  }
};
