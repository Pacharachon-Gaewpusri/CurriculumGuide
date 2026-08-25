import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import './index.css'
import { Link, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layout/RootLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CirriculumAnalytics from './pages/CirriculumAnalytics.jsx'
import swu_icon from '../assets/Srinakharinwirot_Logo_TH_Color.jpg'

// import { GotoDashboard } from './utils/Navigation.jsx'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const imageElement = document.createElement('img');
imageElement.src = swu_icon;
imageElement.alt = 'SWU Icon';
document.getElementById('gallery').appendChild(imageElement);

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/curriculum-analytics' element={<CirriculumAnalytics />} />
        
        {/* Native React Router navigation */}
        <Route 
          index 
          element={
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src={swu_icon} alt="SWU Icon" />
              <Link to="/dashboard">
                <button>Dashboard</button>
              </Link>
              <Link to="/curriculum-analytics">
                <button>Curriculum Analytics</button>
              </Link>
            </div>
          } 
        />
      </Route>
    ),
  )

  return <RouterProvider router={router} />
}
export default App