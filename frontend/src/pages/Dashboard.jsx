import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function decodeToken(){
  const t = localStorage.getItem('nex_token')
  if(!t) return null
  try{ return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))) }catch(e){ return null }
}

export default function Dashboard(){
  const nav = useNavigate()
  const [payload,setPayload] = useState(null)

  useEffect(()=>{ setPayload(decodeToken()) },[])

  const role = payload?.role || 'guest'

  const features = [
    { id: 'courses', label: 'Courses', route: '/courses', roles: ['admin','student'], desc: 'Browse and manage courses' },
    { id: 'enrollments', label: 'Enrollments', route: '/enrollments', roles: ['admin'], desc: 'View enrollments' },
    { id: 'schedules', label: 'Schedules', route: '/schedules', roles: ['admin'], desc: 'Create and view schedules' },
    { id: 'timetable', label: 'Timetable', route: '/timetable', roles: ['admin','student'], desc: 'View student timetable' }
  ]

  function handleLogout(){ localStorage.removeItem('nex_token'); nav('/') }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="text-sm text-slate-600">Logged in as: <strong>{payload?.role||'guest'}</strong></div>
        </div>
        <div className="flex gap-2">
          <button className="border px-3 py-2 rounded" onClick={()=>nav('/')}>Home</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.filter(f=>f.roles.includes(role)).map(f=> (
          <div key={f.id} className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer" onClick={()=>nav(f.route)}>
            <h3 className="font-bold text-lg mb-1">{f.label}</h3>
            <div className="text-sm text-slate-600">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
