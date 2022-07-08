export type ProductType = {
  image: string,
  name: string,
  price: number,
  key: string,
  details: string,
  slug: {
    current: string
  }
  bids: [
    {
      id: string,
      name: string,
      email: string,
      image: string,
    }
  ]
}