import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { client, urlFor } from '../../db/client'
import { ProductType } from '../../utils/types'

const mockBidders = [
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 1',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 2',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 3',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 4',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 5',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 5',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 5',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 5',
  },
  {
    image: 'https://picsum.photos/200',
    name: 'Bidder 5',
  },
]

const ProductDetail: React.FC<{product: ProductType}> = ({ product }) => {
  const src = urlFor(product?.image && product?.image[0]).url()
  
  if (!product) return <h1>This product does not exist...</h1>

  return (
    <div className='flex gap-3 max-h-[400px]'>
      <Image 
        loader={() => src}
        src={src} 
        alt={product?.name} 
        height={400}
        width={400}
      />
      <div className='flex flex-1 flex-col z-10 gap-6'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-semibold'>{product?.name}</h1>
          <h1>{product?.details}</h1>
        </div>
        <div className='border px-6 pb-6 flex flex-col overflow-scroll'>
          <div>
            <h1 className='fixed text-xl bg-white z-30 py-3 w-full'>The current bid is at: ${product?.price}</h1>
          </div>
          <div>
            <h1 className='mt-6'>Bidders</h1>
            <div className='flex flex-col gap-1 mt-3'>
              {mockBidders?.map((bidder) => (
                <Link key={bidder?.name} href='/'>
                  <button className='flex gap-3 border w-full items-center p-1 rounded'>
                    <div className='flex items-center justify-center z-10'>
                      <Image loader={() => bidder?.image} src={bidder?.image} alt={bidder?.name} height={30} width={30}/>
                    </div>
                    <h1>{bidder?.name}</h1>
                  </button>
                </Link>
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
  const paths = products?.map((product: ProductType) => ({
    params: {
      slug: product?.slug.current
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