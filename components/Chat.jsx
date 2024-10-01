'use client';
import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';  
import Link from 'next/link';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();  


  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('mychat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Mesajlar alınırken bir hata oluştu:', error);
    } else {
      setMessages(data);
    }
  };

  const handleSendMessage = async (text) => {
    const { data: { user } } = await supabase.auth.getUser(); 
    if (!user) {
      alert('Lütfen giriş yapın.');
      return;
    }

    const { error } = await supabase
      .from('mychat')
      .insert([{ gmail: user.email, messages: text }]);

    if (error) {
      console.error('Mesaj gönderilirken bir hata oluştu:', error);
    } else {
      setNewMessage(''); 
    }
  };

  useEffect(() => {
    const messageListener = supabase
      .channel('public:mychat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mychat' }, (payload) => {
        setMessages((currentMessages) => [...currentMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageListener);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Çıkış hatası:', error);
    else router.push('/');


};


  useEffect(() => {
    fetchMessages();
  }, []);

  return (
<div className='mainContainer'>
    <div className="container">
      <div className="h-full border rounded-md relative flex flex-col">
        <div>
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h1 className="baslik text-xl font-bold">Daily Chat</h1>
              <div className="flex items-center gap-1 ">
                <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                {/* <h1 className="text-sm text-gray-400">2 online</h1> */}
              </div>
            </div>
            <button className='exitBtn' onClick={handleSignOut}>Çıkış yap</button>
          </div>
          {/* Mesajları göstermek için */}
          <div className='messagesUi p-4 overflow-y-scroll '>
            
            {messages.map((message) => (
              <div key={message.id} className="mesajDiv p-2 my-2 bg-gray-800 rounded-md">
                    <div>
                <strong className="block">{message.gmail}</strong>
                <p className='message'>{message.messages}</p>
                <span className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
                </div>
                <div className='silBtn'>
                    <button>mesajı sil</button>
                </div>
            

              </div>
            ))}

            
          </div>
        </div>

        <div className="chatInput absolute bottom-0 left-0 right-0 p-4 border-t">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                await handleSendMessage(e.currentTarget.value);

              }
            }}
            type="text"
            placeholder="Bir mesaj gönderin"
            className="inputMesaj w-full p-2 border rounded-md text-white placeholder-white"
          />
        </div>
      </div>
    </div>
</div>
  );
}