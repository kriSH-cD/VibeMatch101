import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--surface-container-high)] w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[var(--surface-container-low)]">
          <h2 className="text-lg font-bold">Create Post</h2>
          <button onClick={onClose} className="p-2 bg-[var(--surface-container-low)] rounded-full hover:opacity-80">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-grow">
          <textarea
            className="w-full bg-transparent text-[var(--on-surface)] placeholder-[var(--on-surface-variant)] resize-none outline-none min-h-[120px] text-lg"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="p-4 border-t border-[var(--surface-container-low)] flex justify-between items-center bg-[var(--surface-container-highest)]">
          <button className="text-[var(--on-surface-variant)] p-2 hover:text-[var(--primary)] transition-colors">
            <ImageIcon size={24} />
          </button>
          
          <div className="w-32">
            <GradientButton 
              onClick={() => {
                if (content.trim()) {
                  onSubmit({ content });
                  setContent('');
                }
              }}
              disabled={!content.trim()}
              className="py-2"
            >
              Post
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
