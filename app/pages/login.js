"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';  
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();  

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {

      router.push('/dashboard');
    }
  };

  return (
    <div className='loginDiv'>
      <h1>Giriş Yap</h1>
      {error && <p>{error}</p>}
      <form className='loginForm' onSubmit={handleLogin}>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='loginBtn' type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}