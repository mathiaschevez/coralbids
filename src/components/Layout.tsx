import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useStateContext } from '../context/StateContext'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }: {children: JSX.Element}) => {
  const { darkModeActive } = useStateContext()

  return (
    <div className={`${darkModeActive ? 'bg-coralblack' : 'bg-white'}`}>
      <Toaster />
      <Navbar />
      <div className='pt-28 px-16'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout