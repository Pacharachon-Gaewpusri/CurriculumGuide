import React from 'react'
import { Outlet } from 'react-router-dom'
import swu_icon from './src/assets/Srinakharinwirot_Logo_TH_Color.jpg'

const imageElement = document.createElement('img');
imageElement.src = swu_icon;
imageElement.alt = 'SWU Icon';
document.getElementById('gallery').appendChild(imageElement);


const RootLayout = () => {
  return (
    <>
        <Outlet />
    </>
  )
}

export default RootLayout