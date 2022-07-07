import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineUser } from 'react-icons/ai'
import { useStateContext } from '../context/StateContext'

const ProfileModal = () => {

  return (
    <div className=''>
      <button className='hover:text-red-600 cursor-pointer' onClick={() => signOut()}>Sign Out</button>
    </div>
  )

}

const Navbar = () => {
  const { data: session, status } = useSession()
  const { darkModeActive } = useStateContext()
  const [profileModalActive, setProfileModalActive] = useState(false)

  useEffect(() => {
    if (!session) {
      setProfileModalActive(false)
    }
  }, [session])

  return (
    <div>
      <div className={`${darkModeActive ? 'bg-coralblack' : 'bg-white'} fixed w-screen flex justify-between px-16 text-white border-b border-b-white items-center z-50`}>
        <div className='flex gap-20 items-center'>
          <Link href='/'>
            <button className='font-bold'>
              <Image src='/LOGOS_SECONDARY_WHITE.png' width={60} height={60} objectFit='contain'/>
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
      {profileModalActive && 
        <div className='absolute right-0 top-20 border border-coralblue w-40 rounded-xl p-4 text-white z-30 mr-16'>
          <ProfileModal />
        </div>
      }
    </div>
  )
}

export default Navbar
