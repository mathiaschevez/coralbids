import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { urlFor } from '../../db/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {} as any)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1LOZLEEGFCR7FcBWry7xucjQ' },
        ],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: req.body.name,
                images: [urlFor(req.body.image[0]).toString()],
              },
              unit_amount: req.body.price,
            },
            quantity: 1, 
          }
        ],
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/coral/${req.body.slug.current}`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params as any);

      res.status(200).json(session);
    } catch (error: any) {
      res.status(error.statusCode || 500).json(error.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}