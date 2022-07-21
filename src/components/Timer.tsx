import React, { useEffect, useMemo, useState } from 'react'
import { useTimer } from 'use-timer';
import { useStateContext } from '../context/StateContext';
import { client } from '../db/client';
import { BidType, ProductType } from '../utils/types';

const seconds = 1000
const minutes = seconds * 60
const hours = minutes * 60
const days = hours * 24

const Timer = ({ product, winningBid, openingDate, refreshBids, newBid, setNewBid, timeUp, setTimeUp, bidCompleted, setBidCompleted }: 
  {product: ProductType, openingDate: Date, refreshBids: () => {}, newBid: boolean, setNewBid: (value: boolean) => void, timeUp: boolean, setTimeUp: (value: boolean) => void, bidCompleted: boolean, winningBid: BidType, setBidCompleted: (value: boolean) => void}) => {
  const { darkModeActive } = useStateContext()
  const [now, setNow] = useState(new Date().getTime())
  const [newOpeningDate, setOpeningDate] = useState(new Date(openingDate).getTime())
  
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1)

  const minutesLeft = useMemo(() => Math.floor(timeLeft % hours / minutes), [secondsLeft])
  const hoursLeft = useMemo(() => Math.floor(timeLeft % days / hours), [minutesLeft])
  const daysLeft = useMemo(() => Math.floor(timeLeft / days), [hoursLeft])

  setTimeout(() => setTimeLeft(newOpeningDate - now), 1000)

  useEffect(() => {
    const handleTimer = () => {
      if(!timeUp) {
        refreshBids()
        setSecondsLeft(Math.floor((timeLeft % minutes) / seconds))
        setNow(new Date().getTime())
      }
    }
    
    if(timeLeft <= 0) {
      setTimeUp(true)
      if(!bidCompleted) {
        start()
      }
    }

    handleTimer()
  }, [timeLeft])

  const { time, start, pause, reset, status } = useTimer({
    initialTime: 30,
    endTime: 0,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      console.log('Time is over');
      if(newBid) {
        start()
        setNewBid(false)
      } else {
        stop()
        if(!bidCompleted) {
          handleCompleteBidding()
          if(!winningBid) {
            client.patch(product._id)
            .set({ bidCompleted: true })
            .commit()
            .then(() => console.log('Bid completed'))
            .catch(err => console.log(err))
          }
        }
      }
    },
    onTimeUpdate: () => {
      if(time >= 0) {
        refreshBids()
      }
    },
  })

  const handleCompleteBidding = async () => {
    const result = await fetch(`/api/editProduct`, {
      body: JSON.stringify(winningBid),
      method: 'POST',
    })

    const json = await result.json()
  }

  if(bidCompleted && winningBid) {
    return <h1 className={`${darkModeActive ? 'text-white' : 'text-black'}`}>Bidding is completed</h1>
  } else if (bidCompleted && !winningBid) {
    return <h1 className={`${darkModeActive ? 'text-white' : 'text-black'}`}>Time to submit a bid has ran out</h1>
  }
  
  return (
    <div className={`${darkModeActive ? 'text-white' : 'text-black'} mt-6`}>
      {!timeUp ? (
        <div className='flex flex-col'>
          <div className='flex gap-3'>
            <h1><span className='text-xl text-coralblue'>{daysLeft}</span> days </h1>
            <h1><span className='text-xl text-coralblue'>{hoursLeft}</span> hours </h1>
            <h1><span className='text-xl text-coralblue'>{minutesLeft}</span> minutes </h1>
            <h1><span className='text-xl text-coralblue'>{secondsLeft}</span> seconds </h1>
          </div>
          <h1 className='text-xl'>until bidding for this item opens</h1>
        </div>
      ) : (
        <div>
          <div className='flex gap-3'>
            <button className='border p-2 px-6' onClick={start}>Start</button>
            <button className='border p-2 px-6' onClick={pause}>Pause</button>
            <button className='border p-2 px-6' onClick={reset}>Reset</button>
          </div>
          <p>Time remaining to make a bid: {time}</p>
          {status === 'RUNNING' && <p>Running...</p>}
        </div>
      )}
    </div>
  )
}

export default Timer