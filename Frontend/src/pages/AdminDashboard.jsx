import React from 'react';
import TopBar from '../components/layout/TopBar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)]">
      <TopBar title="Admin Dashboard" />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-headline mb-6 text-[var(--on-surface)]">System Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '1,492', color: 'text-[var(--primary)]' },
            { label: 'Active Today', value: '423', color: 'text-[var(--tertiary)]' },
            { label: 'Reports', value: '12', color: 'text-[var(--error)]' },
            { label: 'Matches', value: '8,401', color: 'text-[var(--secondary)]' }
          ].map(stat => (
            <div key={stat.label} className="bg-[var(--surface-container-high)] border border-[var(--outline-variant)]/20 rounded-2xl p-4">
              <h3 className="text-[var(--on-surface-variant)] text-sm mb-1">{stat.label}</h3>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-[var(--surface-container-high)] rounded-2xl p-6 border border-[var(--outline-variant)]/20">
          <h3 className="font-bold mb-4 border-b border-[var(--surface-container-low)] pb-2 text-[var(--on-surface)]">Recent Activity</h3>
          <p className="text-[var(--on-surface-variant)] text-sm">Dashboard stub. To be implemented fully.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
