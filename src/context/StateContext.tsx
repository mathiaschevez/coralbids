import React, { createContext, useContext, useState } from 'react'

const Context = createContext({} as any)

export const StateContext = ({ children }: {children: JSX.Element}) => {
  const [darkModeActive, setDarkModeActive] = useState(true)
  const [profileModalActive, setProfileModalActive] = useState(false)

  return (
    <Context.Provider
      value={{
        darkModeActive,
        setDarkModeActive,
        profileModalActive,
        setProfileModalActive,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)