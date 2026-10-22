import React from 'react'
import { Outlet } from 'react-router-dom'
import swu_icon from '../assets/Srinakharinwirot_Logo_TH_Color.png'
import '../index.css'
import App from '../App.jsx'

// const imageElement = document.createElement('img');
// imageElement.src = swu_icon;
// imageElement.alt = 'SWU Icon';
// document.getElementById('gallery').appendChild(imageElement);

const RootLayout = () => {
  return (
    <>
        <Outlet />          
    </>
  )
}

export default RootLayout
