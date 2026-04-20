import React from 'react';
import AvatarCircle from '../ui/AvatarCircle';
import { ChevronRight } from 'lucide-react';

const ConversationRow = ({ conversation, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between p-4 mb-2 cursor-pointer
                 bg-[var(--surface-container-high)] rounded-2xl border border-transparent
                 hover:border-[var(--outline-variant)] hover:bg-[var(--surface-variant)] transition-all"
      onClick={onClick}
    >
      <div className="flex items-center overflow-hidden">
        <div className="relative">
          <AvatarCircle src={conversation.user.imageUrl} alt={conversation.user.name} size="md" />
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--tertiary)] rounded-full border-2 border-[var(--surface-container-high)]"></div>
          )}
        </div>
        <div className="ml-4 truncate">
          <h3 className={`text-[var(--on-surface)] ${conversation.unread ? 'font-bold' : 'font-medium'}`}>
            {conversation.user.name}
          </h3>
          <p className={`truncate text-sm ${conversation.unread ? 'text-[var(--on-surface)] font-medium' : 'text-[var(--on-surface-variant)]'}`}>
            {conversation.lastMessage}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end ml-2 flex-shrink-0">
        <span className="text-xs text-[var(--on-surface-variant)] mb-1">{conversation.timestamp}</span>
        {conversation.unreadCount > 0 ? (
          <div className="w-5 h-5 bg-[var(--primary)] text-[var(--on-primary)] rounded-full flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(233,30,140,0.4)]">
            {conversation.unreadCount}
          </div>
        ) : (
          <ChevronRight size={18} className="text-[var(--on-surface-variant)]" />
        )}
      </div>
    </div>
  );
};

export default ConversationRow;
