import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function UserCard({ user }) {
  const avatar = user.profile_photo_url
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=82c6f1&color=003f5a`;

  return (
    <div className="card p-5 flex flex-col items-center text-center animate-fade-in">
      <img src={avatar} alt={user.full_name} className="avatar-lg mb-3" />
      <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-on-surface)' }}>
        {user.full_name}
      </h3>
      <p className="text-xs mb-2" style={{ color: 'var(--color-outline)' }}>
        {user.branch} • {user.year}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
        <span className="chip text-xs">{user.division && `Div ${user.division}`}</span>
        <span className="chip text-xs">{user.hostel_or_day}</span>
      </div>
      <div className="flex gap-2 w-full">
        <Link to={`/user/${user.id}`} className="btn-secondary flex-1 text-center no-underline text-xs py-2">
          View Profile
        </Link>
        <Link to={`/messages?user=${user.id}`} className="btn-primary flex-1 text-center no-underline text-xs py-2 flex items-center justify-center gap-1">
          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
          Message
        </Link>
      </div>
    </div>
  );
}
