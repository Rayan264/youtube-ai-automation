const fetch = (...args) => import('node-fetch').then(({default: f})=>f(...args));
const POLL = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10);
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';

async function poll(){
  try{
    const res = await fetch(BACKEND + '/jobs/all');
    if(!res.ok){ console.error('Failed to fetch jobs', await res.text()); return; }
    const jobs = await res.json();
    for(const job of jobs){
      if(job.status === 'pending'){
        console.log('Processing job', job.id);
        // simulate work
        await processJob(job);
      }
    }
  }catch(e){
    console.error('Poll error', e);
  }
}

async function processJob(job){
  // mark running
  await post('/jobs/update', {id:job.id, status:'running', logs:'worker started'});
  // simulate work delay
  await new Promise(r=>setTimeout(r, 3000));
  // create a dummy "video" file URL (in real system upload to R2 or S3)
  const result = `https://example.com/videos/${job.id}.mp4`;
  await post('/jobs/update', {id:job.id, status:'done', result_url: result, logs:'video created: '+result});
  console.log('Job done', job.id);
}

async function post(path, body){
  try{
    const res = await fetch(BACKEND + path, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    return res.ok ? await res.json() : (console.error('post failed', await res.text()), null);
  }catch(e){ console.error('post error', e); return null; }
}

console.log('Worker starting, will poll', BACKEND, 'every', POLL, 'ms');
setInterval(poll, POLL);
poll();
