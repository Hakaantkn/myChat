"use client";
import { useState } from "react";
import Signup from "@/app/pages/sigin"; // Kayıt formu
import Login from "@/app/pages/login";   // Giriş formu
import "./globals.css";


export default function Home() {
  // Durumu kontrol etmek için state kullanıyoruz. Başlangıçta login gösterilecek.
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="kancik max-w-3xl mx-auto md:py-10 h-screen" >
      {showLogin ? (
        <>
          <Login /> {/* Giriş formu */}
          <p>Hesabınız yok mu? <button onClick={() => setShowLogin(false)} className="text-blue-500">Kayıt Ol</button></p> {/* Kayıt ol butonu */}
        </>
      ) : (
        <>
          <Signup /> {/* Kayıt formu */}
          <p>Hesabınız var mı? <button onClick={() => setShowLogin(true)} className="text-blue-500">Giriş Yap</button></p> {/* Giriş yap butonu */}
        </>
      )}
    </div>
  );
}