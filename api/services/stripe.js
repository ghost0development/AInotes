import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession(req: Request, res: Response) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pln",
          product_data: { name: "AI Notatnik - subskrypcja" },
          unit_amount: 4900,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: "https://yourapp.com/success",
    cancel_url: "https://yourapp.com/cancel",
  });
  res.json({ url: session.url });
}

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("Płatność opłacona!");
  }
  res.json({ received: true });
}