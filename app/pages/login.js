"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // useRouter hook'u burada kullanılıyor
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();  // useRouter'ı burada tanımlıyoruz

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Giriş başarılı olduğunda kullanıcıyı başka bir sayfaya yönlendiriyoruz
      router.push('/dashboard');
    }
  };

  return (
    <div>
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