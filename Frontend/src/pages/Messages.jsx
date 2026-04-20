import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Messages() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);  // { id, full_name, profile_photo_url }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchConvo, setSearchConvo] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations list
  const fetchConversations = async () => {
    if (!profile) return;
    setLoadingConvos(true);

    // Get all messages where user is sender or receiver
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(id, full_name, profile_photo_url), receiver:users!receiver_id(id, full_name, profile_photo_url)')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoadingConvos(false);
      return;
    }

    // Group by conversation partner
    const convMap = new Map();
    for (const msg of (allMessages || [])) {
      const partnerId = msg.sender_id === profile.id ? msg.receiver_id : msg.sender_id;
      const partner = msg.sender_id === profile.id ? msg.receiver : msg.sender;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
          unread: msg.receiver_id === profile.id && !msg.is_read ? 1 : 0,
        });
      } else {
        const existing = convMap.get(partnerId);
        if (msg.receiver_id === profile.id && !msg.is_read) {
          existing.unread++;
        }
      }
    }

    setConversations(Array.from(convMap.values()));
    setLoadingConvos(false);
  };

  // Open a chat with a specific user
  const openChat = async (chatUser) => {
    setActiveChat(chatUser);
    setLoadingMessages(true);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${chatUser.id}),and(sender_id.eq.${chatUser.id},receiver_id.eq.${profile.id})`)
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    setMessages(data || []);
    setLoadingMessages(false);

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', chatUser.id)
      .eq('receiver_id', profile.id)
      .eq('is_read', false);

    // Update conversations unread count
    setConversations(prev =>
      prev.map(c => c.user.id === chatUser.id ? { ...c, unread: 0 } : c)
    );

    setTimeout(scrollToBottom, 100);
  };

  // Send message
  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !activeChat) return;

    // Check if blocked
    const { data: blocked } = await supabase
      .from('blocked_users')
      .select('id')
      .or(`and(user_id.eq.${profile.id},blocked_user_id.eq.${activeChat.id}),and(user_id.eq.${activeChat.id},blocked_user_id.eq.${profile.id})`)
      .limit(1);

    if (blocked && blocked.length > 0) {
      toast.error('Cannot send messages to this user');
      return;
    }

    setSending(true);
    setNewMessage('');

    // Optimistic update
    const optimistic = {
      id: `temp-${Date.now()}`,
      sender_id: profile.id,
      receiver_id: activeChat.id,
      content: trimmed,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(scrollToBottom, 50);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: profile.id,
        receiver_id: activeChat.id,
        content: trimmed,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } else {
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
    }
    setSending(false);
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [profile]);

  // Open chat from URL param
  useEffect(() => {
    if (targetUserId && profile) {
      (async () => {
        const { data } = await supabase
          .from('users')
          .select('id, full_name, profile_photo_url')
          .eq('id', targetUserId)
          .single();
        if (data) openChat(data);
      })();
    }
  }, [targetUserId, profile]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${profile.id}` },
        (payload) => {
          const msg = payload.new;
          // If chat is open with sender, add message
          if (activeChat && msg.sender_id === activeChat.id) {
            setMessages(prev => [...prev, msg]);
            setTimeout(scrollToBottom, 50);
            // Mark as read
            supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
          }
          // Refresh conversation list
          fetchConversations();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile, activeChat]);

  const filteredConvos = conversations.filter(c =>
    c.user.full_name?.toLowerCase().includes(searchConvo.toLowerCase())
  );

  const getAvatar = (u) => u?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.full_name || 'U')}&background=82c6f1&color=003f5a`;

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="card overflow-hidden" style={{ height: 'calc(100vh - 140px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96`}
                 style={{ borderRight: '1px solid rgba(169,180,185,0.12)' }}>
              <div className="p-4" style={{ borderBottom: '1px solid rgba(169,180,185,0.12)' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>Messages</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2"
                                       style={{ width: '16px', height: '16px', color: 'var(--color-outline)' }} />
                  <input
                    value={searchConvo}
                    onChange={(e) => setSearchConvo(e.target.value)}
                    placeholder="Search conversations…"
                    className="input-serene pl-9 text-sm py-2"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConvos ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="skeleton w-11 h-11 rounded-full" />
                        <div className="flex-1">
                          <div className="skeleton h-4 w-28 mb-1.5" />
                          <div className="skeleton h-3 w-40" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConvos.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
                      {conversations.length === 0 ? 'No conversations yet' : 'No results'}
                    </p>
                  </div>
                ) : (
                  filteredConvos.map(c => (
                    <button
                      key={c.user.id}
                      onClick={() => openChat(c.user)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        border: 'none',
                        background: activeChat?.id === c.user.id ? 'var(--color-surface-container-low)' : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={getAvatar(c.user)} alt="" className="avatar" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate" style={{ color: 'var(--color-on-surface)' }}>
                            {c.user.full_name}
                          </span>
                          <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--color-outline)' }}>
                            {c.lastMessage.created_at && formatDistanceToNow(new Date(c.lastMessage.created_at), { addSuffix: false })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
                            {c.lastMessage.sender_id === profile.id ? 'You: ' : ''}{c.lastMessage.content}
                          </p>
                          {c.unread > 0 && <span className="badge ml-2 flex-shrink-0">{c.unread}</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 px-4 py-3"
                       style={{ borderBottom: '1px solid rgba(169,180,185,0.12)' }}>
                    <button onClick={() => setActiveChat(null)} className="md:hidden"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface)' }}>
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <img src={getAvatar(activeChat)} alt="" className="avatar" />
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>{activeChat.full_name}</h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'var(--color-surface-container-low)' }}>
                    {loadingMessages ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 w-48 rounded-xl" />)}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
                          Start the conversation 👋
                        </p>
                      </div>
                    ) : (
                      messages.map(msg => {
                        const isMine = msg.sender_id === profile.id;
                        return (
                          <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm"
                              style={{
                                background: isMine ? 'var(--gradient-primary)' : 'var(--color-surface-container-lowest)',
                                color: isMine ? 'white' : 'var(--color-on-surface)',
                                borderBottomRightRadius: isMine ? '0.25rem' : '1rem',
                                borderBottomLeftRadius: isMine ? '1rem' : '0.25rem',
                                boxShadow: 'var(--shadow-soft)',
                              }}
                            >
                              <p style={{ wordBreak: 'break-word' }}>{msg.content}</p>
                              <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                                {msg.created_at && new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="px-4 py-3 flex items-center gap-3"
                       style={{ borderTop: '1px solid rgba(169,180,185,0.12)' }}>
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message…"
                      className="input-serene flex-1 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    />
                    <button onClick={handleSend} disabled={sending || !newMessage.trim()} className="btn-primary py-2.5 px-4 flex items-center gap-1.5">
                      Send <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                         style={{ background: 'var(--color-surface-container)' }}>
                      <PaperAirplaneIcon className="w-7 h-7" style={{ color: 'var(--color-primary-fixed-dim)' }} />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
