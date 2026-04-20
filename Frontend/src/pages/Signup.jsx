import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { APP_NAME, COLLEGE_NAME, EMAIL_DOMAIN } from '../utils/constants';
import toast from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith(EMAIL_DOMAIN.toLowerCase());
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      toast.error(`Only ${EMAIL_DOMAIN} emails are allowed`);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="card p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               style={{ background: 'rgba(173,237,246,0.3)' }}>
            <EnvelopeIcon className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Check Your Email</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            We've sent a verification link to <strong style={{ color: 'var(--color-on-surface)' }}>{email}</strong>.
            Click the link to verify your account, then come back to sign in.
          </p>
          <Link to="/login" className="btn-primary inline-block no-underline px-6 py-3">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
               style={{ background: 'var(--gradient-primary)' }}>V</div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{APP_NAME}</h1>
          <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Join the {COLLEGE_NAME} community</p>
        </div>

        {/* Card */}
        <div className="card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-on-surface)' }}>Create Account</h2>
          <p className="text-xs mb-6" style={{ color: 'var(--color-outline)' }}>
            Use your college email (<strong>{EMAIL_DOMAIN}</strong>) to sign up
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>
                College Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: 'var(--color-outline)', width: '18px', height: '18px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`yourname${EMAIL_DOMAIN}`}
                  className="input-serene pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--color-outline)', width: '18px', height: '18px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--color-outline)', width: '18px', height: '18px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-serene pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm animate-fade-in" style={{ color: 'var(--color-outline)', animationDelay: '0.2s' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold no-underline" style={{ color: 'var(--color-primary)' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
