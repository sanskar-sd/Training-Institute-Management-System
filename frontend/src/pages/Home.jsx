import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const nav = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Nexanova</h1>
        <p className="text-slate-600 mb-6">Choose an action to continue</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={()=>nav('/auth?mode=register&role=admin')}
            className="bg-rose-600 text-white py-3 rounded-lg shadow hover:bg-rose-700"
          >
            Register New Admin
          </button>

          <button
            onClick={()=>nav('/auth?mode=register&role=student')}
            className="bg-emerald-600 text-white py-3 rounded-lg shadow hover:bg-emerald-700"
          >
            Register New Student
          </button>

          <button
            onClick={()=>nav('/auth?mode=login')}
            className="bg-slate-800 text-white py-3 rounded-lg shadow hover:bg-slate-900"
          >
            Login
          </button>
        </div>

        <div className="text-sm text-slate-500 mt-6">You can create an admin account or login with existing credentials.</div>
      </div>
    </div>
  )
}
