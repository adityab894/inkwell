'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import '@/styles/Auth.css';

function LoginForm() {
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode');

  useEffect(() => {
    if (initialMode === 'signup') {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!form.name || !form.email || !form.phone || !form.password) {
        return toast.error('Please fill all required fields');
      }
      if (form.password.length < 6) {
        return toast.error('Password must be at least 6 characters');
      }
      setLoading(true);
      try {
        await register(form.name, form.email, form.password, '', form.phone);
        toast.success('Account created! Welcome to InkWell ✦');
        router.push(redirectUrl);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.email || !form.password) {
        return toast.error('Please fill all fields');
      }
      setLoading(true);
      try {
        await login(form.email, form.password);
        toast.success('Welcome back! ✦');
        router.push(redirectUrl);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setForm({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__shape auth-bg__shape--1" />
        <div className="auth-bg__shape auth-bg__shape--2" />
      </div>
      <div className="auth-card animate-scale-in">
        <div className="auth-logo">
          <span className="auth-logo__icon">✦</span>
          <span className="auth-logo__text">InkWell</span>
        </div>
        <h1 className="auth-title">
          {isRegister ? 'Create your space' : 'Welcome back'}
        </h1>
        <p className="auth-subtitle">
          {isRegister ? 'Start writing and sharing your stories' : 'Sign in to continue writing'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-field">
                <label>Full Name <span className="required">*</span></label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="input input--icon"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Phone Number <span className="required">*</span></label>
                <div className="input-wrap">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    className="input input--icon"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-field">
            <label>Email <span className="required">*</span></label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="input input--icon"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Password <span className="required">*</span></label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="input input--icon input--icon-right"
                placeholder={isRegister ? 'Min. 6 characters' : 'Your password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-dots">
                {isRegister ? 'Creating account' : 'Signing in'}
              </span>
            ) : (
              isRegister ? 'Create Account & Start Writing' : 'Sign In'
            )}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button type="button" className="btn-link" onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit' }}>
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" className="btn-link" onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit' }}>
                Start writing
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
