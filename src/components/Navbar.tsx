import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'
import { useStateContext } from '../context/StateContext'

const ProfileModal = () => {
  const { darkModeActive, setDarkModeActive, profileModalActive, setProfileModalActive } = useStateContext()

  return (
    <div onMouseLeave={() => setProfileModalActive(false)} className='flex flex-col items-end mt-3'>
      <div onMouseLeave={() => setProfileModalActive(false)} className={`${darkModeActive ? 'bg-coralblack' : 'bg-white text-black'} flex flex-col py-3 px-3 rounded border border-coralblue items-start`}>
        <button className='hover:text-coralblue' onClick={() => setDarkModeActive(!darkModeActive)}>Toggle Theme</button>
        <button className='hover:text-red-600' onClick={() => signOut()}>Sign Out</button>
      </div>
    </div>
  )
}

const Navbar = () => {
  const { data: session, status } = useSession()
  const { darkModeActive, profileModalActive, setProfileModalActive  } = useStateContext()

  useEffect(() => {
    if (!session) {
      setProfileModalActive(false)
    }
  }, [session])

  return (
    <div className='fixed px-16 w-full z-50'>
      <div className='w-full'>
        <div className={`pt-3 pb-1 ${darkModeActive ? 'bg-coralblack' : 'bg-white'}`}>
          <div className={`rounded bg-coralblue w-full flex justify-between px-6 text-white items-center z-50`}>
            <div className='flex gap-20 items-center'>
              <Link href='/'>
                <button className='font-bold'>
                  <Image src='/LOGOS_SECONDARY_WHITE.png' width={60} height={60} objectFit='contain'/>
                </button>
              </Link>
              <div className='flex justify-between gap-9'>
                <Link href='/'>
                  <button className='hover:text-black'>Auctions</button>
                </Link>
                <Link href='/my-items'> 
                  <button className='hover:text-black'>My Items</button>
                </Link>
              </div>
            </div>
            {session ? (
              <div>
                <button onClick={() => setProfileModalActive(!profileModalActive)}>
                  {session.user?.image ? (
                    <div className='rounded-full'>
                      <img className='rounded-full w-10 h-10' src={session.user.image || ''} alt='user' />
                    </div>
                  ) : (
                    <div className='flex justify-center items-center gap-3 rounded-full bg-white p-3'>
                      <h1 className='text-black'>Profile</h1>
                      <AiOutlineUser color='black' size={24}/> 
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <button className='py-2 px-6 bg-white text-black rounded' onClick={() => signIn()}>Sign In</button>
            )}
          </div>
        </div>
        {profileModalActive && 
          <div className='w-full text-white z-50'>
            <ProfileModal />
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
