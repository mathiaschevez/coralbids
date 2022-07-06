import Image from 'next/image'
import React from 'react'
import { client, urlFor } from '../../db/client'
import { ProductType } from '../../utils/types'

const mockBidders = [
  {
    image: 'https://images.unsplash.com/photo-1598790981323-b9d9d9d9d9d9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    name: 'Bidder 1',
  },
]

const ProductDetail: React.FC<{product: ProductType}> = ({ product }) => {
  const src = urlFor(product.image && product?.image[0]).url()
  
  if (!product) return <h1>This product doesn't exist...</h1>

  return (
    <div className='flex gap-3'>
      <Image 
        loader={() => src}
        src={src} 
        alt={product.name} 
        height={400}
        width={400}
      />
      <div className='flex flex-1 flex-col z-10 gap-6'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-semibold'>{product?.name}</h1>
          <h1>{product.details}</h1>
        </div>
        <div className='border p-6 flex flex-col'>
          <div>
            <h1 className='text-xl'>The current bid is at: ${product.price}</h1>
          </div>
          <div>
            <h1>Bidders</h1>
            <div>
              {mockBidders.map((bidder) => (
                <div className='flex gap-3'>
                  <img src={bidder.image} alt={bidder.name} />
                  <h1>{bidder.name}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }` 

  const products = await client.fetch(query)
  const paths = products.map((product: ProductType) => ({
    params: {
      slug: product.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}


export const getStaticProps = async ({ params: { slug }}: {params: { slug: string }}) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`
  const product: ProductType = await client.fetch(query)

  return {
    props: { product }
  }
}

export default ProductDetail