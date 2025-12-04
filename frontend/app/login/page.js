'use client';
import {useState} from 'react';
import axios from 'axios';
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [message,setMessage]=useState('');
  async function submit(e){ e.preventDefault();
    try{
      const res = await axios.post((process.env.NEXT_PUBLIC_BACKEND_URL||'http://localhost:8000') + '/auth/login', {email,password});
      localStorage.setItem('token', res.data.token);
      setMessage('Login success'); window.location.href='/dashboard';
    }catch(err){ setMessage(err.response?.data?.error || 'Error'); }
  }
  return (<form onSubmit={submit}><h2>Login</h2>
    <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
    <input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
    <button type='submit'>Log in</button>
    <div>{message}</div>
  </form>);
}
