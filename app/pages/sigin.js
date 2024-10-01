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
    if (error) {
      if (error.message.includes("not authorized")) {
        setError("This email address is not authorized for sign-up.");
      } else {
        setError(error.message);
      }
    } else {
      setSuccess(true);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
      {success && <p>Sign-up successful! Please check your email to verify your account.</p>}
    </form>
  );
}