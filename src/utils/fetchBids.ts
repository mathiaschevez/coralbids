import { BidType } from "./types"

export const fetchBids = async (productId: string) => {
  const res = await fetch(`/api/getBids?productId=${productId}`)

  const bids: BidType[] = await res.json()

  return bids
}