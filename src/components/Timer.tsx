import React, { useEffect, useMemo, useState } from 'react'
import { useTimer } from 'use-timer';

const seconds = 1000
const minutes = seconds * 60
const hours = minutes * 60
const days = hours * 24

const Timer = ({ openingDate, getCurrentBids }: {openingDate: Date, getCurrentBids: () => {}}) => {
  const [now, setNow] = useState(new Date().getTime())
  const [timeUp, setTimeUp] = useState(false)
  
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1)

  const minutesLeft = useMemo(() => Math.floor(timeLeft % hours / minutes), [secondsLeft])
  const hoursLeft = useMemo(() => Math.floor(timeLeft % days / hours), [minutesLeft])
  const daysLeft = useMemo(() => Math.floor(timeLeft / days), [hoursLeft])

  setTimeout(() => setTimeLeft(new Date(openingDate).getTime() - now), 1000)

  useEffect(() => {
    const handleTimer = () => {
      
      if(!timeUp) {
        console.log('here')
        if(secondsLeft % 10 === 0) {
          getCurrentBids()
        }
        setSecondsLeft(Math.floor((timeLeft % minutes) / seconds))
        setNow(new Date().getTime())
      }
    }
    
    if(timeLeft <= 0) {
      setTimeUp(true)
      start()
    }

    handleTimer()
  }, [timeLeft])

  const { time, start, pause, reset, status } = useTimer({
    initialTime: 30,
    endTime: -1,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      console.log('Time is over');
      start()
    },
    onTimeUpdate: (time) => {
      if(time % 10 === 0) {
        getCurrentBids()
      }
      console.log('Time is updated', time);
    },
  })

  return (
    <div className='mt-6'>
      <div className='flex gap-3'>
        <button className='border p-2 px-6' onClick={start}>Start</button>
        <button className='border p-2 px-6' onClick={pause}>Pause</button>
        <button className='border p-2 px-6' onClick={reset}>Reset</button>
      </div>
      <p>Elapsed time: {time}</p>
      {status === 'RUNNING' && <p>Running...</p>}
      <div>-----------------------------------------</div>
      <div>
        {!timeUp && (
          <h1>{daysLeft} : {hoursLeft} : {minutesLeft} : {secondsLeft}</h1>
        )}
      </div>
    </div>
  )
}

export default Timer