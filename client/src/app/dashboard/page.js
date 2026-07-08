'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { PenLine, Eye, Heart, Clock, Edit3, Trash2, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/UI/ProtectedRoute';
import '@/styles/Dashboard.css';

function DashboardContent() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/articles/my');
      setArticles(res.data.articles);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await axios.delete(`/api/articles/${id}`);
      setArticles(prev => prev.filter(a => a._id !== id));
      toast.success('Article deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = filter === 'all' ? articles : articles.filter(a => a.status === filter);
  const published = articles.filter(a => a.status === 'published');
  const drafts = articles.filter(a => a.status === 'draft');
  const totalViews = articles.reduce((s, a) => s + (a.views || 0), 0);
  const totalLikes = articles.reduce((s, a) => s + (a.likes?.length || 0), 0);

  return (
    <div className="dashboard">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Header */}
        <div className="dashboard-header animate-fade-up">
          <div className="dashboard-header__left">
            <div className="dashboard-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="dashboard-subtitle">Here's how your writing is doing</p>
            </div>
          </div>
          <Link href="/write" className="btn btn-primary">
            <PenLine size={16} /> New Article
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-fade-up delay-100">
          <div className="stat-card">
            <div className="stat-card__icon" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>
              <FileText size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{articles.length}</span>
              <span className="stat-card__label">Total Articles</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
              <BookOpen size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{published.length}</span>
              <span className="stat-card__label">Published</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
              <Eye size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{totalViews.toLocaleString()}</span>
              <span className="stat-card__label">Total Views</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
              <Heart size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{totalLikes}</span>
              <span className="stat-card__label">Total Likes</span>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="dashboard-articles animate-fade-up delay-200">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              <TrendingUp size={18} /> My Articles
            </h2>
            <div className="filter-tabs">
              {['all', 'published', 'draft'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? `All (${articles.length})` : f === 'published' ? `Published (${published.length})` : `Drafts (${drafts.length})`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="dashboard-articles-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="article-row skeleton-row">
                  <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '18px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">✍️</div>
              <h3>No articles yet</h3>
              <p>Write your first article and share it with the world.</p>
              <Link href="/write" className="btn btn-primary" style={{ marginTop: '16px' }}>
                <PenLine size={16} /> Start Writing
              </Link>
            </div>
          ) : (
            <div className="dashboard-articles-list">
              {filtered.map((article, i) => (
                <div key={article._id} className="article-row animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Thumbnail */}
                  <div className="article-row__thumb">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} />
                    ) : (
                      <div className="article-row__thumb-placeholder">
                        <span>✦</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="article-row__info">
                    <div className="article-row__top">
                      <Link
                        href={article.status === 'published' ? `/article/${article.slug}` : `/write/${article._id}`}
                        className="article-row__title"
                      >
                        {article.title}
                      </Link>
                      <span className={`status-badge status-badge--${article.status}`}>
                        {article.status}
                      </span>
                    </div>
                    <div className="article-row__meta">
                      <span><Clock size={12} /> {article.readTime} min</span>
                      <span><Eye size={12} /> {article.views || 0}</span>
                      <span><Heart size={12} /> {article.likes?.length || 0}</span>
                      <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
                      <span className="article-row__domain">{article.domain}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="article-row__actions">
                    <Link href={`/write/${article._id}`} className="row-action-btn">
                      <Edit3 size={15} />
                    </Link>
                    <button className="row-action-btn row-action-btn--danger" onClick={() => handleDelete(article._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
