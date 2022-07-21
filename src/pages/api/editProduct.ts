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
        patch: {
          id: bid.product._ref,
          set: {
            winningBid: {
              id: bid.id,
              name: bid.name,
              email: bid.email,
              image: bid.image,
              dateTime: bid.createdAt,
            },
            bidCompleted: true,
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

  res.status(200).json({ message: 'Completed bidding.'})
}
