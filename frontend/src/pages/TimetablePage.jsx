import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TTB_BASE = 'http://localhost:8005/api/timetable'

export default function TimetablePage(){
  const [ttb,setTtb] = useState([])
  const [role,setRole] = useState(null)
  const [studentId,setStudentId] = useState('')

  useEffect(()=>{ fetchTtb(); updateRole(); window.addEventListener('storage', updateRole); return ()=>window.removeEventListener('storage', updateRole) }, [])

  function updateRole(){
    const t = localStorage.getItem('nex_token');
    if(!t){ setRole(null); return }
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); setRole(payload.role) }catch(e){ setRole(null) }
  }

  function authHeader(){ const t = localStorage.getItem('nex_token'); return t?{ Authorization: 'Bearer '+t }:{} }

  async function fetchTtb(){
    // try to fetch timetable for logged-in user (token must contain userId)
    const t = localStorage.getItem('nex_token')
    if(!t) { setTtb([]); return }
    try{
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))
      const userId = payload.userId || payload.id || null
      if(!userId){ setTtb([]); return }
      const r = await axios.get(`${TTB_BASE}/student/${userId}`,{ headers: authHeader() })
      // backend returns { studentId, timetable: [...] }
      setTtb(r.data?.timetable || [])
    }catch(err){ console.error('fetchTtb error', err); setTtb([]) }
  }

  async function fetchForStudent(){
    if(!studentId) return alert('Provide student id')
    try{
      const r = await axios.get(`${TTB_BASE}/student/${studentId}`, { headers: authHeader() })
      // backend returns { studentId, timetable: [...] }
      setTtb(r.data?.timetable || [])
    }catch(err){ alert('Fetch timetable failed: ' + (err.response?.data?.message||err.message)) }
  }

  return (
    <div>

      <div className="card mb-4">
        <div className="flex gap-2 items-center">
          <div className="text-sm">Role: {role||'not logged in'}</div>
          <input className="border p-2 ml-4" placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} />
          <button className="border px-3 py-2" onClick={fetchForStudent}>Get Student Timetable</button>
        </div>
      </div>

      <div>
        {ttb.length===0 ? <div className="card">No timetable entries</div> : ttb.map(s=> (
          <div className="card mb-2" key={s._id||s.id}>
            <div className="text-sm text-slate-500">ID: {s._id || s.id} • Course: {s.courseId}</div>
            <h3 className="font-bold">{s.topic}</h3>
            <div><strong>Instructor:</strong> {s.instructor}</div>
            <div><strong>Start:</strong> {s.startTime} <strong>End:</strong> {s.endTime}</div>
            {s.meetingLink && <div><a className="text-blue-600" href={s.meetingLink} target="_blank" rel="noreferrer">Meeting Link</a></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
