import React, {useEffect, useState} from 'react'
import axios from 'axios'

const COURSES_BASE = 'http://localhost:8002/api/courses'

export default function CoursesPage(){
  const [courses,setCourses] = useState([])
  const [title,setTitle] = useState('')
  const [desc,setDesc] = useState('')
  const [moduleTitle, setModuleTitle] = useState('')
  const [role,setRole] = useState(null)

  useEffect(()=>{ fetchCourses(); updateRole(); window.addEventListener('storage', updateRole); return ()=>window.removeEventListener('storage', updateRole) }, [])

  function updateRole(){
    const t = localStorage.getItem('nex_token');
    if(!t){ setRole(null); return }
    try{ const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); setRole(payload.role) }catch(e){ setRole(null) }
  }

  async function fetchCourses(){
    try{ const r = await axios.get(COURSES_BASE,{ headers: authHeader() }); setCourses(r.data||[]) }catch(err){ console.error(err); setCourses([]) }
  }

  function authHeader(){ const t = localStorage.getItem('nex_token'); return t?{ Authorization: 'Bearer '+t }:{} }

  async function createCourse(){
    if(!title) return alert('Title required')
    try{ await axios.post(COURSES_BASE, { title, description: desc }, { headers: { 'Content-Type':'application/json', ...authHeader() } }); setTitle(''); setDesc(''); fetchCourses() }catch(err){ alert('Create failed: ' + (err.response?.data?.message||err.message)) }
  }

  async function addModule(courseId){
    if(!moduleTitle) return alert('Module title required')
    try{ await axios.post(`${COURSES_BASE}/${courseId}/modules`, { title: moduleTitle }, { headers: { 'Content-Type':'application/json', ...authHeader() } }); setModuleTitle(''); fetchCourses() }catch(err){ alert('Add module failed: ' + (err.response?.data?.message||err.message)) }
  }

  async function deleteCourse(courseId){
    if(!confirm('Delete course?')) return
    try{ await axios.delete(`${COURSES_BASE}/${courseId}`, { headers: authHeader() }); fetchCourses() }catch(err){ alert('Delete failed: ' + (err.response?.data?.message||err.message)) }
  }

  return (
    <div>
      <div className="card mb-4">
        {role === 'admin' ? (
          <>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
              <input className="border p-2 flex-1" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
              <button className="bg-slate-800 text-white px-3 py-2 rounded" onClick={createCourse}>Create</button>
            </div>
            <div className="flex gap-2 items-center">
              <input className="border p-2 flex-1" placeholder="Module title (select course below)" value={moduleTitle} onChange={e=>setModuleTitle(e.target.value)} />
              <div className="text-sm">Role: {role||'not logged in'}</div>
            </div>
          </>
        ) : (
          <div className="text-sm">Role: {role||'not logged in'}</div>
        )}
      </div>

      <div>
        {courses.length===0 ? <div className="card">No courses</div> : courses.map(c=> (
          <div className="card mb-2" key={c._id||c.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{c.title}</h3>
                <div className="text-xs text-slate-500">ID: {c._id || c.id}</div>
                <p>{c.description}</p>
                <small>Modules: {Array.isArray(c.modules)?c.modules.length:0}</small>
              </div>
              {role === 'admin' && (
                <div className="flex flex-col gap-2">
                  <button className="border px-2 py-1" onClick={()=>addModule(c._id||c.id)}>Add Module</button>
                  <button className="border px-2 py-1 text-red-600" onClick={()=>deleteCourse(c._id||c.id)}>Delete</button>
                </div>
              )}
            </div>
            {Array.isArray(c.modules) && c.modules.length>0 && (
              <ul className="mt-2 list-disc ml-5">
                {c.modules.map((m,i)=> <li key={i}>{m.title || m.content || m.name || JSON.stringify(m)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
