import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isMissingCredentials } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from the users table
  async function fetchProfile(userId) {
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
  }

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
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const p = await fetchProfile(currentUser.id);
          setProfile(p);
        } else {
          setProfile(null);
        }

        setLoading(false);
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
  }, []);

  // Refresh profile data
  async function refreshProfile() {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  }

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
