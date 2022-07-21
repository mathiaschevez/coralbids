import { useSession } from 'next-auth/react'
import React, { useEffect, useMemo, useState } from 'react'
import { Product } from '../components'
import { client } from '../db/client'
import { ProductType } from '../utils/types'

const MyItems = ({ products }: { products: ProductType[] }) => {
  const [userProducts, setUserProducts] = useState([] as ProductType[])
  const { data: session, status } = useSession()

  useEffect(() => {
    const userProducts = products.filter((product) => {
      return product?.winningBid?.email === session?.user?.email
    })

    setUserProducts(userProducts)
  }, [products, session])

  console.log(products)
  console.log(userProducts)
  
  return (
    <div className='text-white'>
      <h1 className='text-2xl font-semibold mb-12'>MY ITEMS</h1>
      <div className='grid grid-cols-4 items-center'>
        {userProducts.map((product) => (
          <div key={product._id}>
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]'
  const products = await client.fetch(query)

  return {
    props: { products }
  }
}

export default MyItems