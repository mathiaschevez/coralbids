import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }: {children: JSX.Element}) => {
  return (
    <div>
      <Navbar />
      <div className='pt-20 px-16'>
        {children}
      </div>
    </div>
  )
}

export default Layout