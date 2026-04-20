import React from 'react';

const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] px-4 py-3 text-[15px] ${
          isMe 
            ? 'gradient-primary text-[var(--on-primary)] rounded-2xl rounded-tr-sm shadow-[0_4px_14px_rgba(233,30,140,0.15)]' 
            : 'bg-[var(--surface-container-high)] text-[var(--on-surface)] rounded-2xl rounded-tl-sm border border-[var(--outline-variant)]/30'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-[var(--on-primary)]/80' : 'text-[var(--on-surface-variant)]'}`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
