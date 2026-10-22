import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('App')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
