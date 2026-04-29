import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isMissingCredentials } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from the users table
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      return data || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // If credentials are missing, skip Supabase calls entirely
    if (isMissingCredentials) {
      setLoading(false);
      return;
    }

    // Use ONLY onAuthStateChange — it fires INITIAL_SESSION on startup
    // which replaces the need for a separate getSession() call.
    // Calling both causes a lock contention deadlock on the auth token.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Synchronously update user state first
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Defer the async profile fetch to avoid blocking the auth callback
          // Using setTimeout(0) ensures this runs after the current event loop
          setTimeout(async () => {
            const p = await fetchProfile(currentUser.id);
            setProfile(p);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Safety timeout — if auth never responds, stop blocking the UI
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [fetchProfile]);

  // Refresh profile data — called after CreateProfile submission
  const refreshProfile = useCallback(async () => {
    // Use getSession to get the freshest user, don't rely on stale state
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    if (currentUser) {
      const p = await fetchProfile(currentUser.id);
      setUser(currentUser);
      setProfile(p);
      return p;
    }
    return null;
  }, [fetchProfile]);

  // Sign out helper
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
