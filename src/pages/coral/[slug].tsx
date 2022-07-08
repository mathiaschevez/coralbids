import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import { client, urlFor } from '../../db/client'
import { ProductType } from '../../utils/types'

type Bids = [
  {
    id: string,
    name: string,
    email: string,
    image: string,
  }
]

const ProductDetail: React.FC<{product: ProductType, bids: Bids}> = ({ product, bids }) => {
  const { data: session, status } = useSession()
  const { darkModeActive } = useStateContext()
  const [currentBids, setCurrentBids] = useState(bids)
  const src = urlFor(product?.image && product?.image[0]).url()
  console.log(session)

  useEffect(() => {
    
  },[])

  const handleBid = () => {
    
  }

  if (!product) return <h1>This product does not exist...</h1>

  return (
    <div className='text-white pb-[500px]'>
      <div className={`${ darkModeActive ? 'text-white' : 'text-black'} flex gap-6 max-h-[400px]`}>
        <Image 
          loader={() => src}
          src={src} 
          alt={product?.name} 
          height={400}
          width={400}
          className='rounded-lg'
        />
        <div className='flex flex-1 flex-col z-10 gap-6'>
          <div className='flex flex-col w-1/3'>
            <h1 className='text-3xl font-semibold'>{product?.name}</h1>
            <h1>{product?.details}</h1>
          </div>
          <div className='flex flex-col justify-between items-center lg:flex-row gap-3 lg:items-start w-full'>
            <div className='flex gap-6 justify-between w-full items-center'>
              <h1 className='text-xl z-30 py-3'>The current bid is at: </h1>
              <h1 className='px-6 py-3 border text-xl rounded text-coralblue'>${product?.price}.00</h1>
            </div>
            { session && status === 'authenticated' && (
              <button onClick={() => handleBid()} className='bg-coralblue py-3 px-16 rounded text-xl hover:bg-coralgreen w-full lg:w-1/2 text-white'>Make a Bid</button>
            )}
          </div>
          <div className='border rounded pb-6 flex flex-col overflow-scroll px-6'>
            <h1 className='mt-3 text-lg'>Previous bids</h1>
            <div className='flex flex-col gap-1 mt-3'>
              {bids?.map((bidder, i) => (
                <div key={i} className='flex gap-3 border w-full items-center p-1 rounded'>
                  <div className='flex items-center justify-center z-10'>
                    <Image loader={() => bidder?.image} src={bidder?.image} alt={bidder?.name} height={30} width={30}/>
                  </div>
                  <h1>{bidder?.name}</h1>
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
  const bids = product?.bids

  return {
    props: { product, bids }
  }
}

export default ProductDetail