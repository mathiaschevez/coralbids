import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Navbar = () => {
  const { data: session } = useSession()

  return (
    <div className='fixed w-screen flex justify-between py-2 px-16 bg-[#3DB3BB] text-white items-center'>
      <div className='flex gap-20'>
        <div className='font-bold'>LOGO</div>
        <div className='flex justify-between gap-9'>
          <h1>items</h1>
          <h1>items</h1>
          <h1>items</h1>
          <h1>items</h1>
        </div>
      </div>
      {session ? (
        <button className='py-2 px-6 bg-white text-black rounded' onClick={() => signOut()}>sign out</button>
      ) : (
        <button className='py-2 px-6 bg-white text-black rounded' onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  )
}

export default Navbar
