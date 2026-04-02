"use client";

import { useState } from "react";
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hi there! I'm your Sync-Fit assistant. Need help with your diet or workouts?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error..." }]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-[#c1ff00] hover:bg-[#a9e000] text-black rounded-full shadow-lg shadow-[#c1ff00]/30 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 sm:w-96 glass-panel-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#c1ff00] animate-pulse"></div>
            <h3 className="font-bold text-white text-sm tracking-wide">Sync-Fit Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 h-80 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-emerald-500/20">
          {messages.map((msg, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#c1ff00] text-black font-medium self-end rounded-br-none' : 'bg-slate-800 text-slate-200 self-start border border-white/5 rounded-bl-none'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/50 rounded-b-2xl flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about diet & workouts..."
            className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c1ff00]/50 transition-colors"
          />
          <button type="submit" disabled={!input.trim()} className="p-2.5 bg-[#c1ff00] hover:bg-[#a9e000] disabled:bg-slate-800 disabled:text-slate-500 text-black rounded-xl transition-colors shrink-0">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
}
