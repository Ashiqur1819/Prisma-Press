import config from "../../config";
import { prisma } from "../../lib/prisma";
import stripe from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    let stripeCustomerID = user.subscription?.stripeCustomerID;

    if (!stripeCustomerID) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerID = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerID,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?sucess=true`,
      cancel_url: `${config.app_url}/payment?sucess=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return transactionResult;
};

export const subscriptionService = {
  createCheckoutSession,
};
