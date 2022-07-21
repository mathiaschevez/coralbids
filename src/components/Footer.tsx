import React from 'react'
import { useStateContext } from '../context/StateContext'

const Footer = () => {
  const { darkModeActive } = useStateContext()

  return (
    <div className={`${darkModeActive ? 'text-white border-white' : 'text-black border-coralblack'} px-16 mt-12 border-t py-3 w-full`}>
      <h1 className='text-center w-full'>Coral Bids &copy; 2022</h1>
    </div>
  )
}

export default Footer