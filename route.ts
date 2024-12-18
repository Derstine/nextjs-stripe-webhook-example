import { NextRequest, NextResponse } from 'next/server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
const webhookSecret: string = process.env.STRIPE_WEBHOOK_KEY || "";

// this makes it the request is not automatically parsed
export const config = {
  	api: {
    	bodyParser: false,
  	}
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

	let event;

	try {
		event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
	} catch {
        // failed to construct webhook
		return NextResponse.json({status: 400});
	}

	if(event.type === "payment_intent.succeeded") {
		const paymentIntent = event.data.object;
		// logic
	}

    // success
	return NextResponse.json({status: 200});
};