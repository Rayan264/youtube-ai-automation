'use client';
import {useEffect, useState} from 'react';
import axios from 'axios';
export default function Dashboard(){
  const [jobs,setJobs]=useState([]);
  async function load(){
    const token = localStorage.getItem('token');
    if(!token) { window.location.href='/login'; return; }
    const res = await axios.get((process.env.NEXT_PUBLIC_BACKEND_URL||'http://localhost:8000') + '/jobs', { headers: { Authorization: 'Bearer '+token }});
    setJobs(res.data);
  }
  useEffect(()=>{ load(); },[]);
  async function create(){
    const token = localStorage.getItem('token');
    const prompt = promptInput.value;
  }
  return (<div>
    <h2>Dashboard</h2>
    <p>Your jobs:</p>
    <ul>{jobs.map(j=>(<li key={j.id}>{j.id} — {j.status} — {j.result_url || ''}</li>))}</ul>
  </div>);
}
