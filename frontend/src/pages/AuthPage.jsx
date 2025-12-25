import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const AUTH_BASE = 'http://localhost:8001/api/auth'

export default function AuthPage(){
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const modeParam = params.get('mode') // 'register' | 'login'
  const roleParam = params.get('role') // e.g. 'admin'

  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [role,setRole] = useState(roleParam || 'student')
  const [loginEmail,setLoginEmail] = useState('')
  const [loginPassword,setLoginPassword] = useState('')

  useEffect(()=>{
    // if role is provided via query string and mode is register, lock role
    if(roleParam && modeParam === 'register') setRole(roleParam)
  },[roleParam, modeParam])

  const navigate = useNavigate()
  const nextPath = params.get('next')

  function parseJwt(token){
    try{
      const p = token.split('.')[1]
      const json = atob(p.replace(/-/g,'+').replace(/_/g,'/'))
      return JSON.parse(decodeURIComponent(escape(json)))
    }catch(e){ return null }
  }

  const register = async ()=>{
    try{
      const r = await axios.post(`${AUTH_BASE}/register`,{name,email,password,role})
      alert(r.data?.message||'Registered')
      // after registering, go to login
      navigate('/auth?mode=login')
    }catch(err){
      alert('Register failed: '+(err.response?.data?.message||err.message))
    }
  }

  const login = async ()=>{
    try{
      const r = await axios.post(`${AUTH_BASE}/login`,{email:loginEmail,password:loginPassword})
      const token = r.data?.token
      if(token){
        localStorage.setItem('nex_token', token);
        const payload = parseJwt(token)
        if(payload?.role) localStorage.setItem('nex_role', payload.role)
        // notify app to refresh auth state immediately
        try{ window.dispatchEvent(new Event('authChanged')) }catch(e){}
        alert('Logged in');
        navigate(nextPath || '/dashboard');
      }
      else alert('No token returned')
    }catch(err){ alert('Login failed: '+(err.response?.data?.message||err.message)) }
  }

  const logout = ()=>{ localStorage.removeItem('nex_token'); alert('Logged out') }

  // Default to showing login when no explicit mode is provided.
  const showRegister = modeParam === 'register'
  const showLogin = modeParam === 'login' || !modeParam

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {showRegister && (
        <div className="card">
          <h2 className="font-bold mb-2">Register</h2>
          <input className="border p-2 w-full mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
          <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input className="border p-2 w-full mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
          {/* hide role selector when landing from admin register link */}
          {!(roleParam && modeParam === 'register') && (
            <select className="border p-2 w-full mb-2" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button className="bg-slate-800 text-white px-3 py-2 rounded" onClick={register}>Register</button>
        </div>
      )}

      {showLogin && (
        <div className="card">
          <h2 className="font-bold mb-2">Login</h2>
          <input className="border p-2 w-full mb-2" placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}/>
          <input className="border p-2 w-full mb-2" placeholder="Password" type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}/>
          <div className="flex gap-2">
            <button className="bg-slate-800 text-white px-3 py-2 rounded" onClick={login}>Login</button>
            <button className="border px-3 py-2 rounded" onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}
