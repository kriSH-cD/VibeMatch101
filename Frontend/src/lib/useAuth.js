import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        // Listen for changes on auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      }
    } catch (e) {
      console.warn("Supabase not fully connected. Defaulting to local dummy auth.");
    }
    
    // Fallback: Local dummy authentication to prevent lock-out during frontend dev
    const timer = setTimeout(() => {
      setUser({ id: "dummy-user-123", email: "elena@campusmatch.edu" });
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    loading,
    signIn: (email) => supabase.auth.signInWithOtp({ email }),
    signOut: () => supabase.auth.signOut()
  };
}
