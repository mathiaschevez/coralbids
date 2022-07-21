import { BidType } from "./types"

export const fetchBids = async (productId: string) => {
  try { 
    const res = await fetch(`/api/getBids?productId=${productId}`)
    const bids: BidType[] = await res.json()
    return bids
  } catch (error) {
    console.log(error)
    const bids: BidType[] = []
    return bids
  } 
}