// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { groq } from 'next-sanity'
import { client } from '../../db/client'
import { BidType } from '../../utils/types'

const bidQuery = groq`
  *[_type == "bid" && references(*[_type== 'product' && _id == $productId]._id)] {
    _id,
    ...
  } | order(_createdAt desc)
`

type Data = BidType[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId } = req.query

  const bids: BidType[] = await client.fetch(bidQuery, { 
    productId,
  })

  res.status(200).json(bids)
}
