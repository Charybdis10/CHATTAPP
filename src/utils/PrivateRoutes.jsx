import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
    const {user} = useAuth()
  return (
    <>
      {user ? <Outlet/> : <Navigate to="/login"/>}
    </>
  )
}

export default PrivateRoutes
//outlet is parent component to private route in apps.jsx and connects them to child routes
//navigate passes these route if user is not authentic to login page