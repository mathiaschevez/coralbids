import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import { client, urlFor } from '../../db/client'
import { ProductType } from '../../utils/types'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid';
import { Timer } from '../../components'


type Bids = [
  {
    id: string,
    name: string,
    email: string,
    image: string,
    dateTime: Date,
  }
]

const ProductDetail: React.FC<{product: ProductType, bids: Bids, openingDate: Date}> = ({ product, bids, openingDate }) => {
  const { data: session, status } = useSession()
  const { darkModeActive } = useStateContext()
  const src = urlFor(product?.image && product?.image[0]).url()
  const [currentBids, setCurrentBids] = useState(bids)

  console.log(product)
  console.log(session)

  const getCurrentBids = async () => {
    const query = `*[_type == "product" && slug.current == '${product.slug.current}'][0]`
    const currentProduct = await client.fetch(query)

    const newBids = currentProduct?.bids
    setCurrentBids(newBids)
    // console.log(currentProduct)
    // console.log(newBids)
    // console.log(product.slug.current) 
  }

  const handleBid = () => {
    if(session) {
      client.patch(product._id)
      .setIfMissing({bids: []})
      .insert('after', 'bids[-1]', [{
        id: uuid(),
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
        dateTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
      }])
      .commit({autoGenerateArrayKeys: true})
      .then(() => {
        console.log('Bid added')
      })
      .catch((err) => {
        console.log('Something went wrong', err.message)
      })
    }
  }


  if (!product) return <h1>This product does not exist...</h1>

  return (
    <div className='text-white pb-[500px]'>
      <div className={`${ darkModeActive ? 'text-white' : 'text-black'} flex flex-col lg:flex-row gap-6`}>
        <div className='m-auto'>
          <Image 
            loader={() => src}
            src={src} 
            alt={product?.name} 
            height={400}
            width={400}
            objectFit='contain'
            className='rounded-lg'
          />
        </div>
        <div className='flex flex-1 flex-col z-10 gap-6'>
          <div className='flex flex-col w-full lg:w-1/3'>
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
          <div className='border rounded pb-6 flex flex-col overflow-y-scroll px-6 no-scroll-bar'>
            <h1 className='mt-3 text-lg'>Previous bids</h1>
            <div className='flex flex-col gap-1 mt-3'>
              {bids?.map((bidder, i) => (
                <div key={i} className='flex gap-3 border w-full items-center p-1 rounded'>
                  <div className='flex items-center justify-center z-10'>
                    <Image loader={() => bidder?.image} src={bidder?.image} alt={bidder?.name} height={30} width={30} className='rounded-full'/>
                  </div>
                  <div className='flex justify-between w-full px-3'>
                    <h1>{bidder?.name}</h1>
                    <h1>{dayjs(bidder?.dateTime).format('h : mm : ss')}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Timer openingDate={openingDate} getCurrentBids={getCurrentBids}/>
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
  const bids = product?.bids?.reverse() || []
  const openingDate = product?.openingDate


  return {
    props: { product, bids, openingDate }
  }
}

export default ProductDetail