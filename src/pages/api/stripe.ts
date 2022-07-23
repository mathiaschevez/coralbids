import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProductType } from '../../utils/types';

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
          { shipping_rate: 'shr_1KsH2eLcdIwUBbBsXJiilDw5' },
          { shipping_rate: 'shr_1KsH2sLcdIwUBbBsUtBhpAw7' },
        ],
        line_items: req.body.map((product: ProductType) => {
          const img = product.image[0].asset._ref;
          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/xw2cyrcc/production/').replace('-jpg', '.jpg');

          return {
            price_data: { 
              currency: 'usd',
              product_data: { 
                name: product.name,
                images: [newImage],
              },
              unit_amount: product.price * 100,
            },
            adjustable_quantity: {
              enabled: false,
              minimum: 1,
            },
            quantity: 1,
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`,
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