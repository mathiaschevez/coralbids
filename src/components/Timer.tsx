import React, { useEffect, useMemo, useState } from 'react'
import { useTimer } from 'use-timer';
import { BidType } from '../utils/types';

const seconds = 1000
const minutes = seconds * 60
const hours = minutes * 60
const days = hours * 24

const Timer = ({ winningBid, openingDate, refreshBids, newBid, setNewBid, timeUp, setTimeUp, bidCompleted }: 
  {openingDate: Date, refreshBids: () => {}, newBid: boolean, setNewBid: (value: boolean) => void, timeUp: boolean, setTimeUp: (value: boolean) => void, bidCompleted: boolean, winningBid: BidType}) => {
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
    initialTime: 5,
    endTime: -1,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      console.log('Time is over');
      if(newBid) {
        start()
        setNewBid(false)
      } else {
        reset()
        stop()
        if(!bidCompleted) {
          console.log('here')
          handleCompleteBidding()
        }
      }
    },
    onTimeUpdate: () => {
      // console.log(time)
      if(time >= 0) {
        refreshBids()
      }
    },
  })

  const handleCompleteBidding = async () => {
    const result = await fetch(`/api/editBid`, {
      body: JSON.stringify(winningBid),
      method: 'POST',
    })

    console.log(result)

    const json = await result.json()
    console.log(json)
  }

  if(bidCompleted) return <h1>Bid is completed</h1>
  
  return (
    <div className='mt-6'>
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