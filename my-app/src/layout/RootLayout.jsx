import React from 'react'
import { Outlet } from 'react-router-dom'
import App from '../App.jsx'

const RootLayout = () => {
  return (
    <>
        <Outlet />
    </>
  )
}

export default RootLayout