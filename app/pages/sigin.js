"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import "../globals.css";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else {
      setSuccess(true);
      setError(null);
    }
  };

  return (
    <div className='siginDiv'>
      <h1 className='siginH1'>Kayıt Ol</h1>
      {error && <p>{error}</p>}
      {success ? (
        <p>Kayıt başarılı! Giriş yapabilirsin!</p>
      ) : (
        <form className='signForm' onSubmit={handleSignup}>
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
          <button className='signBtn' type="submit">Kayıt Ol</button>
        </form>
      )}
    </div>
  );
}