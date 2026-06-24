import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RootLayout from './app/layout'
import { AuthProvider } from './hooks/useAuth'
// @ts-ignore
import './app/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RootLayout />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
