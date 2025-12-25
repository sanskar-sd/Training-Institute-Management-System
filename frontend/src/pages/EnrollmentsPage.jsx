import React, {useEffect, useState} from 'react'
import axios from 'axios'

const ENROLL_BASE = 'http://localhost:8003/api/enrollments'

export default function EnrollmentsPage(){
  const [enrolls,setEnrolls] = useState([])
  const [courseId,setCourseId] = useState('')
  const [studentIdLookup,setStudentIdLookup] = useState('')
  const [bulkText,setBulkText] = useState('')
  const [studentId,setStudentId] = useState('')
  const [role,setRole] = useState(null)

  useEffect(()=>{
    updateRole();
    // only auto-fetch enrollments for admins; students must provide rollno to lookup
    const roleFromToken = getRoleFromToken()
    if(roleFromToken === 'admin') fetchAllEnrolls()
    // listen for auth changes from login/logout
    window.addEventListener('storage', updateRole);
    window.addEventListener('authChanged', updateRole);
    return ()=>{
      window.removeEventListener('storage', updateRole)
      window.removeEventListener('authChanged', updateRole)
    }
  }, [])

  // when role changes, fetch enrolls for admin immediately
  useEffect(()=>{
    if(role === 'admin') fetchAllEnrolls()
  },[role])

  async function fetchAllEnrolls(){
    try{
      const r = await axios.get(`${ENROLL_BASE}/`, { headers: authHeader() });
      // ensure array
      const data = Array.isArray(r.data) ? r.data : (r.data?.enrollments || [])
      setEnrolls(data)
    }catch(err){ console.error('fetchAllEnrolls error', err); setEnrolls([]) }
  }

  function updateRole(){
    const t = localStorage.getItem('nex_token');
    if(!t){ setRole(null); return }
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); setRole(payload.role) }catch(e){ setRole(null) }
  }

  function authHeader(){ const t = localStorage.getItem('nex_token'); return t?{ Authorization: 'Bearer '+t }:{} }

  function getUserIdFromToken(){
    const t = localStorage.getItem('nex_token')
    if(!t) return null
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); return payload.userId || payload.id || null }catch(e){ return null }
  }

  function getRoleFromToken(){
    const t = localStorage.getItem('nex_token')
    if(!t) return null
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); return payload.role || null }catch(e){ return null }
  }

  async function fetchEnrolls(studentIdParam){
    // fetch enrollments for a particular student
    let sid = studentIdParam
    if(!sid) sid = getUserIdFromToken()
    // if no sid and user is admin -> fetch all enrollments
    if(!sid){ 
      if(role==='admin'){
        try{ const r = await axios.get(`${ENROLL_BASE}/`, { headers: authHeader() }); setEnrolls(r.data||[]) }catch(err){ console.error(err); setEnrolls([]) }
        return
      }
      setEnrolls([]); return
    }

    try{ const r = await axios.get(`${ENROLL_BASE}/student/${sid}`, { headers: authHeader() }); setEnrolls(r.data||[]) }catch(err){ console.error(err); setEnrolls([]) }
  }

  async function createEnroll(){
    if(role !== 'admin') return alert('Only admin can enroll students')
    if(!courseId) return alert('courseId required')
    if(!studentId) return alert('studentId required')
    try{
      const payload = { studentId, courseId }
      const r = await axios.post(ENROLL_BASE, payload, { headers: { 'Content-Type':'application/json', ...authHeader() } });
      setCourseId(''); setStudentId('');
      // append newly created enrollment to state if returned
      if(r.data?.enrollment){
        setEnrolls(prev=>[r.data.enrollment, ...prev])
      }else{
        // fallback: refresh list
        fetchEnrolls()
      }
      alert(r.data?.message || 'Enrolled')
    }catch(err){ alert('Enroll failed: ' + (err.response?.data?.message||err.message)) }
  }

  async function bulkEnroll(){
    // backend expects { studentIds: [...], courseId }
    if(!courseId) return alert('Course ID is required for bulk enroll')
    if(!bulkText) return alert('Provide bulk payload (JSON array of ids or newline-separated ids)')
    let studentIds
    try{
      const parsed = JSON.parse(bulkText)
      if(Array.isArray(parsed)) studentIds = parsed
      else return alert('JSON payload must be an array of student ids')
    }catch(e){
      // fallback to newline separated ids
      studentIds = bulkText.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)
    }

    if(!Array.isArray(studentIds) || studentIds.length===0) return alert('No student ids found')

    try{
      const payload = { studentIds, courseId }
      const r = await axios.post(ENROLL_BASE+'/bulk', payload, { headers: { 'Content-Type':'application/json', ...authHeader() } });
      setBulkText('');
      // refresh enrollments for current student (if one provided) or logged-in user
      if(studentIds.length===1) fetchEnrolls(studentIds[0])
      else fetchEnrolls()
      alert(r.data?.message || 'Bulk enroll completed')
    }catch(err){ alert('Bulk enroll failed: ' + (err.response?.data?.message||err.message)) }
  }

  async function fetchStudent(){
    if(!studentIdLookup) return alert('Provide student id')
    try{ const r = await axios.get(`${ENROLL_BASE}/student/${studentIdLookup}`, { headers: authHeader() }); setEnrolls(r.data||[]); }catch(err){ alert('Fetch student enrollments failed: ' + (err.response?.data?.message||err.message)) }
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="flex gap-2 mb-2">
          <input className="border p-2" style={{width: '40%'}} placeholder="Course ID" value={courseId} onChange={e=>setCourseId(e.target.value)} />
          <input className="border p-2" style={{width: '40%'}} placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} />
          <button className="bg-slate-800 text-white px-3 py-2 rounded" onClick={createEnroll}>Enroll</button>
        </div>
        <div className="mb-2">
          <textarea
            className="border p-2 w-full"
            rows={4}
            placeholder={'Provide JSON array like ["id1","id2"] or newline-separated ids'}
            value={bulkText}
            onChange={e=>setBulkText(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="border px-3 py-2" onClick={bulkEnroll}>Bulk Enroll</button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <input className="border p-2" placeholder="Student ID to lookup" value={studentIdLookup} onChange={e=>setStudentIdLookup(e.target.value)} />
          <button className="border px-3 py-2" onClick={fetchStudent}>Get Student Enrollments</button>
        </div>
        <div className="text-sm mt-2">Role: {role||'not logged in'}</div>
      </div>

      <div>
        {enrolls.length===0 ? (
          <div className="card">No enrollments</div>
        ) : (
          enrolls.map(e=> (
            <div className="card mb-2" key={e._id||e.id}>
              <div className="text-sm text-slate-500">Enrollment ID: {e._id || e.id}</div>
              <div><strong>Student:</strong> {e.studentId || e.user || 'N/A'}</div>
              <div><strong>Course:</strong> {e.courseId || e.course || 'N/A'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
