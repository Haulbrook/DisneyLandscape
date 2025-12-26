const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to determine plan from price ID
const getPlanFromPriceId = (priceId) => {
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return 'basic';
  if (priceId === process.env.STRIPE_PRICE_ID) return 'pro';
  return 'pro'; // Default to pro
};

// Helper to get next month reset date
const getNextMonthReset = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
};

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  console.log('Received Stripe event:', stripeEvent.type);

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const planFromMetadata = session.metadata?.plan;

        console.log('checkout.session.completed - userId:', userId, 'customerId:', customerId, 'subscriptionId:', subscriptionId, 'plan:', planFromMetadata);

        if (userId && subscriptionId) {
          // Fetch the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.log('Retrieved subscription:', JSON.stringify(subscription, null, 2));

          // Determine plan from metadata or price ID
          const priceId = subscription.items?.data?.[0]?.price?.id;
          const plan = planFromMetadata || getPlanFromPriceId(priceId);

          const updateData = {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            plan: plan,
            cancel_at_period_end: false
          };

          // Only add date fields if they exist
          if (subscription.current_period_start) {
            updateData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString();
          }
          if (subscription.current_period_end) {
            updateData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString();
          }

          // Initialize Basic tier monthly tracking fields
          if (plan === 'basic') {
            updateData.projects_this_month = 0;
            updateData.vision_renders_this_month = 0;
            updateData.month_reset_date = getNextMonthReset();
          }

          await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', userId);

          console.log(`Subscription activated for user ${userId} with plan: ${plan}`);
        } else if (customerId && subscriptionId) {
          // Fallback: If no userId in metadata, try to update by customer_id
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items?.data?.[0]?.price?.id;
          const plan = planFromMetadata || getPlanFromPriceId(priceId);

          const updateData = {
            stripe_subscription_id: subscriptionId,
            status: 'active',
            plan: plan,
            cancel_at_period_end: false
          };

          if (subscription.current_period_start) {
            updateData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString();
          }
          if (subscription.current_period_end) {
            updateData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString();
          }

          // Initialize Basic tier monthly tracking fields
          if (plan === 'basic') {
            updateData.projects_this_month = 0;
            updateData.vision_renders_this_month = 0;
            updateData.month_reset_date = getNextMonthReset();
          }

          await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('stripe_customer_id', customerId);

          console.log(`Subscription activated for customer ${customerId} (no userId in metadata) with plan: ${plan}`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const planFromMetadata = subscription.metadata?.plan;

        console.log(`${stripeEvent.type} - customerId:`, customerId, 'subscription.status:', subscription.status, 'priceId:', priceId);

        // Map Stripe status to our status
        let status = 'inactive';
        if (subscription.status === 'active') status = 'active';
        else if (subscription.status === 'trialing') status = 'trialing';
        else if (subscription.status === 'past_due') status = 'past_due';
        else if (subscription.status === 'canceled') status = 'canceled';

        // Determine plan from metadata or price ID
        let plan = 'free';
        if (status === 'active' || status === 'trialing') {
          plan = planFromMetadata || getPlanFromPriceId(priceId);
        }

        const updateData = {
          stripe_subscription_id: subscription.id,
          status: status,
          plan: plan,
          cancel_at_period_end: subscription.cancel_at_period_end || false
        };

        // Only add date fields if they exist
        if (subscription.current_period_start) {
          updateData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString();
        }
        if (subscription.current_period_end) {
          updateData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString();
        }

        // Initialize Basic tier monthly tracking fields if new Basic subscription
        if (plan === 'basic' && stripeEvent.type === 'customer.subscription.created') {
          updateData.projects_this_month = 0;
          updateData.vision_renders_this_month = 0;
          updateData.month_reset_date = getNextMonthReset();
        }

        const updateResult = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('stripe_customer_id', customerId);

        console.log(`Subscription ${stripeEvent.type} for customer ${customerId}: ${status}, plan: ${plan}`, updateResult);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
            cancel_at_period_end: false
          })
          .eq('stripe_customer_id', customerId);

        console.log(`Subscription deleted for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object;
        const customerId = invoice.customer;

        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due'
          })
          .eq('stripe_customer_id', customerId);

        console.log(`Payment failed for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object;
        const customerId = invoice.customer;

        // Reactivate if was past due
        await supabase
          .from('subscriptions')
          .update({
            status: 'active'
          })
          .eq('stripe_customer_id', customerId)
          .eq('status', 'past_due');

        console.log(`Payment succeeded for customer ${customerId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
