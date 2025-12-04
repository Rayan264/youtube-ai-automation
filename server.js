const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;
const DATA_FILE = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

function readDB(){
  try{
    return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
  }catch(e){
    return {users:[], jobs:[]};
  }
}
function writeDB(data){ fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2)); }

// Health
app.get('/', (req,res)=> res.send({status:'Backend OK'}));

// Signup
app.post('/auth/signup', async (req,res)=>{
  const {email,password,name} = req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  const db = readDB();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({error:'email exists'});
  const hash = await bcrypt.hash(password,10);
  const user = {id:Date.now().toString(), email, name: name||'', password_hash: hash, created_at:new Date().toISOString()};
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({userId:user.id,email:user.email}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,email:user.email,name:user.name}});
});

// Login
app.post('/auth/login', async(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password) return res.status(400).json({error:'email and password required'});
  const db = readDB();
  const user = db.users.find(u=>u.email===email);
  if(!user) return res.status(400).json({error:'invalid credentials'});
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(400).json({error:'invalid credentials'});
  const token = jwt.sign({userId:user.id,email:user.email}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,email:user.email,name:user.name}});
});

// Auth middleware
function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'missing auth'});
  const parts = auth.split(' ');
  if(parts.length!==2) return res.status(401).json({error:'invalid auth format'});
  const token = parts[1];
  try{
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}

// Create video job
app.post('/videos/generate', authMiddleware, (req,res)=>{
  const {prompt, title} = req.body;
  if(!prompt) return res.status(400).json({error:'prompt required'});
  const db = readDB();
  const job = {id: 'job_'+Date.now(), userId: req.user.userId, prompt, title: title||'AI Video', status:'pending', created_at: new Date().toISOString(), result_url: null, logs:[]};
  db.jobs.push(job);
  writeDB(db);
  res.json({job});
});

// List jobs (user)
app.get('/jobs', authMiddleware, (req,res)=>{
  const db = readDB();
  const jobs = db.jobs.filter(j=>j.userId===req.user.userId);
  res.json(jobs);
});

// Admin: list all jobs (for worker)
app.get('/jobs/all', (req,res)=>{
  const db = readDB();
  res.json(db.jobs);
});

// Update job status (worker calls)
app.post('/jobs/update', (req,res)=>{
  const {id,status,result_url,logs} = req.body;
  const db = readDB();
  const job = db.jobs.find(j=>j.id===id);
  if(!job) return res.status(404).json({error:'job not found'});
  if(status) job.status = status;
  if(result_url) job.result_url = result_url;
  if(logs){
    if(!job.logs) job.logs = [];
    job.logs.push({time:new Date().toISOString(), entry: logs});
  }
  writeDB(db);
  res.json({ok:true, job});
});

app.listen(PORT, '0.0.0.0', ()=> console.log('Backend running on', PORT));
