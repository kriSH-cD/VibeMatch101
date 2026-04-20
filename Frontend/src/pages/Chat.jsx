import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import MessageBubble from '../components/messages/MessageBubble';
import AvatarCircle from '../components/ui/AvatarCircle';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 1, content: "Hey! Are we still on for the study group tonight?", isMe: false, timestamp: "12:40 PM" },
  { id: 2, content: "Yes! I booked a room in the library.", isMe: true, timestamp: "12:41 PM" },
  { id: 3, content: "Perfect see you at 7 ✌️", isMe: false, timestamp: "12:42 PM" }
];

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        content: inputText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setInputText('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] flex flex-col">
      <TopBar 
        title={
          <div className="flex items-center">
            <AvatarCircle size="sm" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" />
            <div className="ml-3 flex flex-col justify-center h-full">
              <span className="text-sm font-bold leading-none mb-0.5">Elena</span>
              <span className="text-[10px] text-[var(--tertiary)] leading-none">Online</span>
            </div>
          </div>
        } 
        showBack 
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-center my-6">
          <span className="bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] text-xs px-3 py-1 rounded-full">
            Today
          </span>
        </div>
        
        {messages.map((msg, i) => {
          const isFirstInSequence = i === 0 || messages[i-1].isMe !== msg.isMe;
          return (
            <div key={msg.id} className={isFirstInSequence ? "mt-4" : ""}>
              <MessageBubble message={msg} isMe={msg.isMe} />
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="bg-[var(--surface-container-lowest)]/80 backdrop-blur-md px-4 py-3 pb-safe border-t border-[var(--surface-container-low)] sticky bottom-0 z-40">
        <div className="flex items-end bg-[var(--surface-container-low)] rounded-3xl p-2 border border-[var(--outline-variant)]/30">
          <button className="px-2 pb-1.5 text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
            <ImageIcon size={22} />
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none text-[var(--on-surface)] max-h-32 min-h-[24px] py-2 px-2 resize-none focus:outline-none placeholder-[var(--on-surface-variant)] leading-snug"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          
          <div className="flex px-1 min-h-[36px] items-center pb-1">
            <button className="px-2 text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              <Smile size={22} />
            </button>
            {inputText.trim() ? (
              <button 
                onClick={handleSend}
                className="ml-1 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center glow-primary-interactive hover:scale-105 transition-all focus:outline-none"
              >
                <Send size={16} className="relative -left-0.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
