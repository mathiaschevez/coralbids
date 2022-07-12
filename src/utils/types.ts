export type ProductType = {
  _id: string,
  image: string,
  name: string,
  price: number,
  key: string,
  details: string,
  slug: {
    current: string
  },
  openingDate: Date,
}

export type BidType = {
  name: string,
  email: string,
  image: string,
  createdAt: Date,
  product: {
    _ref: string,
    _type: 'reference',
  }
}