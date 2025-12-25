import React, {useEffect, useState} from 'react'
import axios from 'axios'

const SCHED_BASE = 'http://localhost:8004/api/schedules'

export default function SchedulesPage(){
  const [schedules,setSchedules] = useState([])
  const [courseId,setCourseId] = useState('')
  const [topic,setTopic] = useState('')
  const [instructor,setInstructor] = useState('')
  const [startTime,setStartTime] = useState('')
  const [endTime,setEndTime] = useState('')
  const [meetingLink,setMeetingLink] = useState('')
  const [courseIdLookup,setCourseIdLookup] = useState('')
  const [role,setRole] = useState(null)

  useEffect(()=>{ fetchSchedules(); updateRole(); window.addEventListener('storage', updateRole); return ()=>window.removeEventListener('storage', updateRole) }, [])

  function updateRole(){
    const t = localStorage.getItem('nex_token');
    if(!t){ setRole(null); return }
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); setRole(payload.role) }catch(e){ setRole(null) }
  }

  function authHeader(){ const t = localStorage.getItem('nex_token'); return t?{ Authorization: 'Bearer '+t }:{} }

  async function fetchSchedules(){
    try{ const r = await axios.get(SCHED_BASE,{ headers: authHeader() }); setSchedules(r.data||[]) }catch(err){ console.error(err); setSchedules([]) }
  }

  async function createSchedule(){
    if(!courseId || !topic || !instructor || !startTime || !endTime || !meetingLink) return alert('All fields are required')
    try{
      const payload = { courseId, topic, instructor, startTime, endTime, meetingLink }
      const r = await axios.post(SCHED_BASE, payload, { headers: { 'Content-Type':'application/json', ...authHeader() } });
      setCourseId(''); setTopic(''); setInstructor(''); setStartTime(''); setEndTime(''); setMeetingLink(''); fetchSchedules(); alert(r.data?.message || 'Schedule created')
    }catch(err){ alert('Create failed: ' + (err.response?.data?.message||err.message)) }
  }

  async function fetchByCourse(){
    if(!courseIdLookup) return alert('Provide courseId')
    try{ const r = await axios.get(`${SCHED_BASE}/course/${courseIdLookup}`, { headers: authHeader() }); setSchedules(r.data||[]); }catch(err){ alert('Fetch by course failed: ' + (err.response?.data?.message||err.message)) }
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input className="border p-2" placeholder="Course ID" value={courseId} onChange={e=>setCourseId(e.target.value)} />
          <input className="border p-2" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
          <input className="border p-2" placeholder="Instructor" value={instructor} onChange={e=>setInstructor(e.target.value)} />
          <input className="border p-2" placeholder="Start Time (ISO or text)" value={startTime} onChange={e=>setStartTime(e.target.value)} />
          <input className="border p-2" placeholder="End Time (ISO or text)" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          <input className="border p-2" placeholder="Meeting Link" value={meetingLink} onChange={e=>setMeetingLink(e.target.value)} />
        </div>
        <div className="mb-2">
          <button className="bg-slate-800 text-white px-3 py-2 rounded" onClick={createSchedule} disabled={role!=='admin'}>Create</button>
        </div>
        <div className="flex gap-2 items-center">
          <input className="border p-2" placeholder="Course ID to lookup" value={courseIdLookup} onChange={e=>setCourseIdLookup(e.target.value)} />
          <button className="border px-3 py-2" onClick={fetchByCourse}>Get By Course</button>
        </div>
        <div className="text-sm mt-2">Role: {role||'not logged in'}</div>
      </div>

      <div>
        {schedules.length===0 ? <div className="card">No schedules</div> : schedules.map(s=> (
          <div className="card mb-2" key={s._id||s.id}>
            <div className="text-sm text-slate-500">ID: {s._id || s.id} • Course: {s.courseId}</div>
            <h3 className="font-bold">{s.topic}</h3>
            <div><strong>Instructor:</strong> {s.instructor}</div>
            <div><strong>Start:</strong> {s.startTime} <strong>End:</strong> {s.endTime}</div>
            <div><a className="text-blue-600" href={s.meetingLink} target="_blank" rel="noreferrer">Meeting Link</a></div>
          </div>
        ))}
      </div>
    </div>
  )
}
