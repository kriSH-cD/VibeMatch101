import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isMissingCredentials } from '../lib/supabase';
import { APP_NAME, COLLEGE_NAME, EMAIL_DOMAIN } from '../utils/constants';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email!');
      setResetMode(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
               style={{ background: 'var(--gradient-primary)' }}>V</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{APP_NAME}</h1>
          <p className="text-sm" style={{ color: 'var(--color-outline)' }}>A Digital Sanctuary for {COLLEGE_NAME}</p>
        </div>

        {/* Missing credentials banner */}
        {isMissingCredentials && (
          <div className="card p-4 mb-4 animate-fade-in flex items-start gap-3" style={{ background: 'rgba(168,56,54,0.06)', animationDelay: '0.05s' }}>
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-error)' }}>Supabase not connected</p>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                Create a <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--color-surface-container)' }}>.env</code> file in <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--color-surface-container)' }}>Frontend/</code> with:<br />
                <code className="text-xs" style={{ color: 'var(--color-primary)' }}>VITE_SUPABASE_URL=https://xxx.supabase.co</code><br />
                <code className="text-xs" style={{ color: 'var(--color-primary)' }}>VITE_SUPABASE_ANON_KEY=your-key</code>
              </p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-on-surface)' }}>
            {resetMode ? 'Reset Password' : 'Welcome Back'}
          </h2>

          <form onSubmit={resetMode ? handleResetPassword : handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>
                Institutional Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: 'var(--color-outline)', width: '18px', height: '18px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`name${EMAIL_DOMAIN}`}
                  className="input-serene pl-10"
                />
              </div>
            </div>

            {/* Password */}
            {!resetMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider"
                         style={{ color: 'var(--color-on-surface-variant)' }}>
                    Password
                  </label>
                  <button type="button" onClick={() => setResetMode(true)}
                          className="text-xs font-medium"
                          style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <LockClosedIcon className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2"
                                  style={{ color: 'var(--color-outline)', width: '18px', height: '18px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-serene pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                    {showPassword
                      ? <EyeSlashIcon style={{ width: '18px', height: '18px' }} />
                      : <EyeIcon style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Please wait…' : resetMode ? 'Send Reset Link' : 'Sign In →'}
            </button>
          </form>

          {resetMode && (
            <button onClick={() => setResetMode(false)}
                    className="mt-3 text-sm w-full text-center"
                    style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Back to login
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm animate-fade-in" style={{ color: 'var(--color-outline)', animationDelay: '0.2s' }}>
          New to the commons?{' '}
          <Link to="/signup" className="font-semibold no-underline" style={{ color: 'var(--color-primary)' }}>
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
}
