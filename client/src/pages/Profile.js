import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, FileText, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/auth/profile', form);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 48px)', paddingBottom: '80px', maxWidth: '640px' }}>
        <h1 className="profile-title animate-fade-up">Your Profile</h1>
        <p className="profile-subtitle animate-fade-up delay-100">Manage how you appear to readers</p>

        <div className="profile-card animate-scale-in delay-200">
          {/* Avatar Preview */}
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {form.avatar ? (
                <img src={form.avatar} alt={form.name} />
              ) : (
                <span>{form.name?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="profile-avatar-info">
              <strong>{form.name || 'Your Name'}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Display Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input type="text" className="input input--icon" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
            </div>

            <div className="form-field">
              <label>Avatar URL</label>
              <div className="input-wrap">
                <Camera size={16} className="input-icon" />
                <input type="url" className="input input--icon" value={form.avatar}
                  onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                  placeholder="https://your-photo-url.com/photo.jpg" />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Paste a public image URL</small>
            </div>

            <div className="form-field">
              <label>Bio</label>
              <textarea
                className="input"
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell readers about yourself…"
                maxLength={300}
                style={{ resize: 'vertical' }}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'right' }}>{form.bio.length}/300</small>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
