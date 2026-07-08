'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import '../login/Auth.css';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.bio);
      toast.success('Account created! Welcome to InkWell ✦');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
        <h1 className="auth-title">Create your space</h1>
        <p className="auth-subtitle">Start writing and sharing your stories</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label>Email <span className="required">*</span></label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="input input--icon"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Short Bio <span className="optional">(optional)</span></label>
            <div className="input-wrap">
              <FileText size={16} className="input-icon" />
              <input
                type="text"
                className="input input--icon"
                placeholder="A line about yourself…"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                maxLength={200}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="loading-dots">Creating account</span> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
