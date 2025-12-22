const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

        if (userId && subscriptionId) {
          // Fetch the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await supabase
            .from('subscriptions')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: 'active',
              plan: 'pro',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: false
            })
            .eq('user_id', userId);

          console.log(`Subscription activated for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object;
        const customerId = subscription.customer;

        // Map Stripe status to our status
        let status = 'inactive';
        if (subscription.status === 'active') status = 'active';
        else if (subscription.status === 'trialing') status = 'trialing';
        else if (subscription.status === 'past_due') status = 'past_due';
        else if (subscription.status === 'canceled') status = 'canceled';

        await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            status: status,
            plan: status === 'active' || status === 'trialing' ? 'pro' : 'free',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false
          })
          .eq('stripe_customer_id', customerId);

        console.log(`Subscription updated for customer ${customerId}: ${status}`);
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
