'use client';
import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md relative">
        <div className="h-20">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Daily Chat</h1>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                {/* <h1 className="text-sm text-gray-400">2 online</h1> */}
              </div>
            </div>
          </div>
          {/* Mesajları göstermek için */}
          <div className='messagesUi p-4 overflow-y-scroll h-80'>
            {messages.map((message) => (
              <div key={message.id} className="p-2 my-2 bg-gray-800 rounded-md">
                <strong className="block">{message.gmail}</strong>
                <p>{message.messages}</p>
                <span className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
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
  );
}