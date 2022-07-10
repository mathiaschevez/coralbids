import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import { client, urlFor } from '../../db/client'
import { ProductType } from '../../utils/types'

type Bids = [
  {
    id: string,
    name: string,
    email: string,
    image: string,
    openingDate: Date
  }
]

const ProductDetail: React.FC<{product: ProductType, bids: Bids, openingDate: Date}> = ({ product, bids, openingDate }) => {
  const { data: session, status } = useSession()
  const { darkModeActive } = useStateContext()
  const src = urlFor(product?.image && product?.image[0]).url()
  const [currentBids, setCurrentBids] = useState(bids)


  // TIMER LOGIC
  // console.log(openingDate)
  const [countDate, setCountDate] = useState(new Date(openingDate).getTime())
  const [now, setNow] = useState(new Date().getTime())
  const seconds = 1000
  const minutes = seconds * 60
  const hours = minutes * 60
  const days = hours * 24
  
  const [secondsLeft, setSecondsLeft] = useState(0)
  // const [minutesLeft, setMinutesLeft] = useState(0)
  // const [hoursLeft, setHoursLeft] = useState(0)
  // const [daysLeft, setDaysLeft] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  setTimeout(() => setTimeLeft(countDate - now), 1000)
  // console.log(timeLeft)

  const handleTimer = () => {
    setSecondsLeft(Math.floor((timeLeft % minutes) / seconds))
    setNow(new Date().getTime())
  }

  useEffect(() => {
    handleTimer()
    if(secondsLeft % 10 === 0) {
      getCurrentBids()
    }
  }, [timeLeft])

  // useEffect(() => {
  //   setMinutesLeft(Math.floor(timeLeft % hours / minutes))
  // }, [secondsLeft])

  const minutesLeft = useMemo(() => Math.floor(timeLeft % hours / minutes), [secondsLeft])
  const hoursLeft = useMemo(() => Math.floor(timeLeft % days / hours), [minutesLeft])
  const daysLeft = useMemo(() => Math.floor(timeLeft % days / hours), [hoursLeft])

  // useEffect(() => {
  //   setHoursLeft(Math.floor(timeLeft % days / hours))
  // }, [minutesLeft])

  // useEffect(() => {
  //   setDaysLeft(Math.floor(timeLeft / days))
  // }, [hoursLeft])

  //move this inside the use effect and other dependencies aswell
  const getCurrentBids = async () => {
    console.log(currentBids)
  }


  const handleBid = () => {

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
      <div>
        <h1>{daysLeft}: {hoursLeft}: {minutesLeft}: {secondsLeft}</h1>
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
  const openingDate = product?.openingDate

  return {
    props: { product, bids, openingDate }
  }
}

export default ProductDetail