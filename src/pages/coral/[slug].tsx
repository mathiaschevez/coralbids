import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/StateContext'
import { client, urlFor } from '../../db/client'
import { ProductType, BidType } from '../../utils/types'
import dayjs from 'dayjs'
import { Timer } from '../../components'
import { fetchBids } from '../../utils/fetchBids'
import { v4 as uuid } from 'uuid';

const ProductDetail: React.FC<{product: ProductType, openingDate: Date}> = ({ product, openingDate }) => {
  const { data: session, status } = useSession()
  const { darkModeActive } = useStateContext()
  const [currentBids, setCurrentBids] = useState<BidType[]>([])
  const [winningBid, setWinningBid] = useState({} as BidType)
  const [totalCost, setTotalCost] = useState(product.price)
  const [timeUp, setTimeUp] = useState(false)
  const [newBid, setNewBid] = useState(false)
  const [bidCompleted, setBidCompleted] = useState(product.bidCompleted)

  const src = urlFor(product?.image && product?.image[0]).url()

  const refreshBids = async () => {
    const bids: BidType[] = await fetchBids(product._id)
    setCurrentBids(bids)
    setWinningBid(bids[0])
    if(currentBids.length > 0) {
      setTotalCost(currentBids.length * .10 + product.price)
    }
  }

  useEffect(() => {
    refreshBids()
  }, [])

  const handleBid = async () => {
    if(session) {
      const bid: BidType = {
        id: uuid(),
        name: session.user?.name || '',
        email: session.user?.email || '',
        image: session.user?.image || '',
        createdAt: new Date(),
        product: {
          _ref: product._id,
          _type: 'reference'
        }
      }

      const result = await fetch(`/api/addBid`, {
        body: JSON.stringify(bid),
        method: 'POST',
      })

      const json = await result.json()
      
      refreshBids()

      setNewBid(true)
      return json
    }
  }

  if (!product) return <h1>This product does not exist...</h1>

  return (
    <div className='text-white'>
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
              <h1 className='px-6 py-3 border text-xl rounded text-coralblue'>${`${currentBids[0] ? totalCost : 1}`}</h1>
            </div>
            { session && status === 'authenticated' && winningBid?.email !== session.user?.email && timeUp && !bidCompleted && (
              <button onClick={() => handleBid()} className='bg-coralblue py-3 px-16 rounded text-xl hover:bg-coralgreen w-full lg:w-1/2 text-white'>Make a Bid</button>
            )}
            {bidCompleted && session?.user?.email === winningBid?.email && (
              <button className='bg-coralblue py-3 px-16 rounded text-xl hover:bg-coralgreen w-full lg:w-1/2 text-white'>Purchase</button>
            )}
          </div>
          <div className='border rounded pb-6 flex flex-col overflow-y-scroll px-6 no-scroll-bar max-h-[270px]'>
            <h1 className='mt-3 text-lg'>Previous bids</h1>
            <div className='flex flex-col gap-1 mt-3'>
              {currentBids?.map((bid, i) => (
                <div key={i} className='flex gap-3 border w-full items-center p-1 rounded'>
                  <div className='flex items-center justify-center z-10'>
                    <Image loader={() => bid?.image} src={bid?.image} alt={bid?.name} height={30} width={30} className='rounded-full'/>
                  </div>
                  <div className='flex justify-between w-full px-3'>
                    <h1>{bid?.name}</h1>
                    <h1>{dayjs(bid?.createdAt).format('MMM DD - hh : mm : ss')}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Timer winningBid={winningBid} openingDate={openingDate} refreshBids={refreshBids} newBid={newBid} setNewBid={setNewBid} timeUp={timeUp} setTimeUp={setTimeUp} bidCompleted={bidCompleted} setBidCompleted={setBidCompleted} product={product}/>
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
  const openingDate = product?.openingDate


  return {
    props: { product, openingDate },
  }
}

export default ProductDetail