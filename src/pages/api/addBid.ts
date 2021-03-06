// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BidType } from '../../utils/types'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const bid: BidType = JSON.parse(req.body)

  const mutations = {
    mutations: [
      {
        create: {
          _type: 'bid',
          id: bid.id,
          name: bid.name,
          email: bid.email,
          image: bid.image,
          createdAt: bid.createdAt,
          product: {
            _type: 'reference',
            _ref: bid.product._ref,
          }
        }
      }
    ]
  }

  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-10/data/mutate/production`
  const result = await fetch(apiEndpoint, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
    },
    body: JSON.stringify(mutations),
    method: 'POST'
  })

  const json = await result.json()

  res.status(200).json({ message: 'Added bid'})
}
