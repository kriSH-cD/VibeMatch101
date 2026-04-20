import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useRealtime(table, filterColumn = null, filterValue = null) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initial fetch (stubbed)
    const fetchData = async () => {
      let query = supabase.from(table).select('*');
      if (filterColumn && filterValue) {
        query = query.eq(filterColumn, filterValue);
      }
      const { data: res } = await query;
      if (res) setData(res);
    };

    fetchData().catch(console.error);

    // Setup realtime subscription
    const channel = supabase.channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        // Handle realtime updates
        console.log('Realtime Update:', payload);
        // Implement full merge logic in production
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterColumn, filterValue]);

  return data;
}
