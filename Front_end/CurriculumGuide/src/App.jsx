import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layout/RootLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    ),
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App