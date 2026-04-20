import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, YEARS, HOSTEL_STATUS } from '../utils/constants';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Discover() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('users')
      .select('*')
      .neq('id', profile.id)
      .order('full_name', { ascending: true });

    if (search.trim()) {
      query = query.ilike('full_name', `%${search.trim()}%`);
    }
    if (filterBranch) {
      query = query.eq('branch', filterBranch);
    }
    if (filterYear) {
      query = query.eq('year', filterYear);
    }
    if (filterStatus) {
      query = query.eq('hostel_or_day', filterStatus);
    }

    const { data, error } = await query.limit(50);
    if (error) console.error(error);
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchUsers();
  }, [profile, search, filterBranch, filterYear, filterStatus]);

  const ChipButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? 'var(--gradient-primary)' : 'var(--color-surface-container-low)',
        color: active ? 'white' : 'var(--color-on-surface-variant)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
            Find your <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>tribe</em>.
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
            Discover students across the community based on shared academic paths and lifestyles.
          </p>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2"
                                 style={{ width: '18px', height: '18px', color: 'var(--color-outline)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, interests or vibes…"
              className="input-serene pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {/* Branch */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>Branch</p>
            <div className="flex flex-wrap gap-2">
              <ChipButton active={!filterBranch} onClick={() => setFilterBranch('')}>All Branches</ChipButton>
              {BRANCHES.slice(0, 8).map(b => (
                <ChipButton key={b} active={filterBranch === b} onClick={() => setFilterBranch(filterBranch === b ? '' : b)}>
                  {b.replace(' Engineering', '').replace(' & ', ' ')}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>Year</p>
            <div className="flex flex-wrap gap-2">
              <ChipButton active={!filterYear} onClick={() => setFilterYear('')}>All Years</ChipButton>
              {YEARS.map(y => (
                <ChipButton key={y.value} active={filterYear === y.value} onClick={() => setFilterYear(filterYear === y.value ? '' : y.value)}>
                  {y.value}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>Status</p>
            <div className="flex flex-wrap gap-2">
              <ChipButton active={!filterStatus} onClick={() => setFilterStatus('')}>All</ChipButton>
              {HOSTEL_STATUS.map(h => (
                <ChipButton key={h.value} active={filterStatus === h.value} onClick={() => setFilterStatus(filterStatus === h.value ? '' : h.value)}>
                  {h.label}
                </ChipButton>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-5 flex flex-col items-center">
                <div className="skeleton w-20 h-20 rounded-full mb-3" />
                <div className="skeleton h-4 w-24 mb-2" />
                <div className="skeleton h-3 w-32 mb-4" />
                <div className="skeleton h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-on-surface)' }}>No students found</p>
            <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map(u => <UserCard key={u.id} user={u} />)}
          </div>
        )}
      </main>
    </div>
  );
}
