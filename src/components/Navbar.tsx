import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'

const Navbar = () => {
  const { data: session, status } = useSession()


  return (
    <div className='fixed w-screen flex justify-between py-2 px-16 bg-[#3DB3BB] text-white items-center z-50'>
      <div className='flex gap-20'>
        <Link href='/'>
          <button className='font-bold'>
            Logo
          </button>
        </Link>
        <div className='flex justify-between gap-9'>
          <h1>items</h1>
          <h1>items</h1>
          <h1>items</h1>
          <h1>items</h1>
        </div>
      </div>
      {session ? (
        <button onClick={() => signOut()}>
          {session.user?.image ? (
            <div className='rounded-full'>
              <img className='rounded-full w-12 h-12' src={session.user.image || ''} alt='user' />
            </div>
          ) : (
            <div className='flex justify-center items-center gap-3 rounded-full bg-white p-3'>
              <h1 className='text-black'>Profile</h1>
              <AiOutlineUser color='black' size={24}/> 
            </div>
          )}
        </button>
      ) : (
        <button className='py-2 px-6 bg-white text-black rounded' onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  )
}

export default Navbar
