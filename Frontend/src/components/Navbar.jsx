import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  { path: '/', label: 'Feed', Icon: HomeIcon, ActiveIcon: HomeIconSolid },
  { path: '/discover', label: 'Discover', Icon: MagnifyingGlassIcon, ActiveIcon: MagnifyingGlassIconSolid },
  { path: '/messages', label: 'Messages', Icon: ChatBubbleLeftRightIcon, ActiveIcon: ChatBubbleLeftRightIconSolid },
  { path: '/profile', label: 'Profile', Icon: UserCircleIcon, ActiveIcon: UserCircleIconSolid },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch unread messages count
  useEffect(() => {
    if (!profile) return;

    async function fetchUnread() {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    }

    fetchUnread();

    // Listen for new messages
    const channel = supabase
      .channel('navbar-unread')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${profile.id}` },
        () => fetchUnread()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${profile.id}` },
        () => fetchUnread()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 hidden md:block"
           style={{ borderBottom: '1px solid rgba(169,180,185,0.15)' }}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: 'var(--gradient-primary)' }}>V</div>
            <span className="font-semibold text-base" style={{ color: 'var(--color-on-surface)', letterSpacing: '-0.02em' }}>
              {APP_NAME}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ path, label, Icon, ActiveIcon }) => {
              const isActive = location.pathname === path;
              const IconComponent = isActive ? ActiveIcon : Icon;
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl no-underline transition-all"
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    background: isActive ? 'rgba(130,198,241,0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  {label}
                  {label === 'Messages' && unreadCount > 0 && (
                    <span className="badge absolute -top-1 left-6">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sign Out */}
          <button onClick={handleSignOut} className="btn-secondary flex items-center gap-2 text-sm">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="glass-nav fixed bottom-0 left-0 right-0 z-50 md:hidden"
           style={{ borderTop: '1px solid rgba(169,180,185,0.15)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ path, label, Icon, ActiveIcon }) => {
            const isActive = location.pathname === path;
            const IconComponent = isActive ? ActiveIcon : Icon;
            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center gap-0.5 no-underline px-3 py-1"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                }}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs" style={{ fontWeight: isActive ? 600 : 400 }}>{label}</span>
                {label === 'Messages' && unreadCount > 0 && (
                  <span className="badge absolute -top-1 right-0">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
            );
          })}
          <button onClick={handleSignOut} className="flex flex-col items-center gap-0.5 px-3 py-1"
                  style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none' }}>
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>

      {/* Spacers */}
      <div className="hidden md:block h-16" />
    </>
  );
}
