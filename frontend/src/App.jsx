import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CoursesPage from './pages/CoursesPage'
import EnrollmentsPage from './pages/EnrollmentsPage'
import SchedulesPage from './pages/SchedulesPage'
import TimetablePage from './pages/TimetablePage'
import RequireAuth from './components/RequireAuth'

export default function App(){
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('nex_token') : null)
  const [role, setRole] = useState(typeof window !== 'undefined' ? localStorage.getItem('nex_role') : null)

  function parseJwt(token){
    try{
      const p = token.split('.')[1]
      const json = atob(p.replace(/-/g,'+').replace(/_/g,'/'))
      return JSON.parse(decodeURIComponent(escape(json)))
    }catch(e){ return null }
  }

  const updateAuthState = ()=>{
    const t = localStorage.getItem('nex_token')
    const r = localStorage.getItem('nex_role')
    if(t !== token) setToken(t)
    if(r !== role) setRole(r)
    // if token exists but role missing, try decode
    if(t && !r){
      const p = parseJwt(t)
      if(p?.role) setRole(p.role)
    }
  }

  useEffect(()=>{
    // update on mount
    updateAuthState()
    // listen to custom auth change events
    const handler = ()=> updateAuthState()
    window.addEventListener('authChanged', handler)
    return ()=> window.removeEventListener('authChanged', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // also update auth state on location change (helps immediate UI update after navigate)
  useEffect(()=>{ updateAuthState() },[location.pathname])

  const logout = ()=>{
    localStorage.removeItem('nex_token')
    localStorage.removeItem('nex_role')
    setToken(null)
    setRole(null)
    navigate('/')
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Link to="/" className="font-bold">Nexanova</Link>
          {token ? (
            <>
              {/* If student only show courses and timetable */}
              {role === 'student' ? (
                <>
                  <Link to="/courses" className="hover:underline">Courses</Link>
                  <Link to="/timetable" className="hover:underline">Timetable</Link>
                  <button onClick={logout} className="ml-auto bg-rose-600 px-3 py-1 rounded">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="hover:underline">Home</Link>
                  <Link to="/courses" className="hover:underline">Courses</Link>
                  <Link to="/enrollments" className="hover:underline">Enrollments</Link>
                  <Link to="/schedules" className="hover:underline">Schedules</Link>
                  <Link to="/timetable" className="hover:underline">Timetable</Link>
                  <button onClick={logout} className="ml-auto bg-rose-600 px-3 py-1 rounded">Logout</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="hover:underline">Login</Link>
              <Link to="/auth?mode=register&role=student" className="hover:underline">Register Student</Link>
              <Link to="/auth?mode=register&role=admin" className="hover:underline">Register Admin</Link>
            </>
          )}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/dashboard" element={<RequireAuth allowedRoles={['admin','student']}><Dashboard/></RequireAuth>} />
          <Route path="/courses" element={<RequireAuth allowedRoles={['admin','student']}><CoursesPage/></RequireAuth>} />
          <Route path="/enrollments" element={<RequireAuth allowedRoles={['admin']}><EnrollmentsPage/></RequireAuth>} />
          <Route path="/schedules" element={<RequireAuth allowedRoles={['admin']}><SchedulesPage/></RequireAuth>} />
          <Route path="/timetable" element={<RequireAuth allowedRoles={['admin','student']}><TimetablePage/></RequireAuth>} />
        </Routes>
      </main>
    </div>
  )
}
