import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layout/RootLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
// import { GotoDashboard } from './utils/Navigation.jsx'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const GotoDashboard = () => {
    window.location.assign('/dashboard')
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route index element={<button onClick={GotoDashboard}>Home</button>} />
      </Route>
    ),
  )

  return (
    // <QueryClientProvider client={queryClient}>
       <RouterProvider router={router} />
    // </QueryClientProvider>

  )
}

export default App