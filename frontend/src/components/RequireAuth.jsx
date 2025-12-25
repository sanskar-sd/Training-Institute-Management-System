import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function parseJwt(token){
  try{
    const p = token.split('.')[1]
    const json = atob(p.replace(/-/g,'+').replace(/_/g,'/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  }catch(e){ return null }
}

export default function RequireAuth({ children, allowedRoles }){
  const token = localStorage.getItem('nex_token')
  const location = useLocation()
  if(!token){
    // redirect to login, preserve where user wanted to go
    return <Navigate to={`/auth?mode=login&next=${encodeURIComponent(location.pathname)}`} replace />
  }

  if(allowedRoles && allowedRoles.length>0){
    const payload = parseJwt(token)
    const role = payload?.role
    if(!role || !allowedRoles.includes(role)){
      // not authorized for this route
      return <Navigate to="/" replace />
    }
  }

  return children
}
