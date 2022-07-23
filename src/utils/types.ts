export type ProductType = {
  _id: string,
  image: ProductImageArray,
  name: string,
  price: number,
  key: string,
  details: string,
  slug: {
    current: string
  },
  openingDate: Date,
  winningBid: {
    id: string,
    name: string,
    email: string,
    image: string,
    dateTime: Date,
  }
  bidCompleted: boolean,
}

type ProductImageArray = [
  {
    asset: {
      _ref: string,
    }
  }
]

export type BidType = {
  id: string,
  name: string,
  email: string,
  image: string,
  createdAt: Date,
  product: {
    _ref: string,
    _type: 'reference',
  }
}