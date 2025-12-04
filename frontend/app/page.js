import Link from 'next/link';
export default function Home(){
  return (
    <div>
      <h1>YouTube AI Automation — Demo</h1>
      <p>This demo uses a minimal backend. Use Signup to create an account.</p>
      <p><Link href='/signup'>Sign up</Link> • <Link href='/login'>Log in</Link> • <Link href='/dashboard'>Dashboard</Link></p>
    </div>
  );
}
