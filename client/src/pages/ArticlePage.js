import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, Eye, Clock, Share2, Edit3, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import './ArticlePage.css';

export default function ArticlePage() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/articles/${slug}`);
      setArticle(res.data);
      setLikeCount(res.data.likes?.length || 0);
      setLiked(user && res.data.likes?.includes(user._id));
    } catch {
      toast.error('Article not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) { toast.info('Log in to like articles'); return; }
    try {
      const res = await axios.post(`/api/articles/${article._id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await axios.delete(`/api/articles/${article._id}`);
      toast.success('Article deleted');
      navigate('/dashboard');
    } catch { toast.error('Delete failed'); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: article.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  if (loading) {
    return (
      <div className="article-page article-page--loading">
        <div className="container-narrow">
          <div className="skeleton" style={{ height: '40px', marginTop: '120px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '40px' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px', marginBottom: '40px' }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '16px', marginBottom: '12px', width: i % 3 === 2 ? '75%' : '100%' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!article) return null;

  const isAuthor = user && article.author?._id === user._id;
  const fontFamilyMap = { Georgia: 'Georgia, serif' };
  const fontSizeMap = { small: '0.95rem', medium: '1.1rem', large: '1.2rem', xlarge: '1.35rem' };

  return (
    <div className="article-page">
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <div className="container-narrow" style={{ paddingTop: 'calc(var(--nav-height) + 48px)' }}>
        {/* Back */}
        <Link to="/" className="back-btn animate-fade-in">
          <ArrowLeft size={16} /> Back to articles
        </Link>

        {/* Header */}
        <header className="article-header animate-fade-up">
          <div className="article-header__meta">
            <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
              {article.domain}
            </span>
            {article.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="article-tag">#{tag}</span>
            ))}
          </div>

          <h1 className="article-title" style={{ fontFamily: article.layout?.fontFamily }}>
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="article-subtitle">{article.subtitle}</p>
          )}

          {/* Author & Stats */}
          <div className="article-byline">
            <div className="article-author">
              <div className="author-avatar author-avatar--lg">
                {article.author?.avatar ? (
                  <img src={article.author.avatar} alt={article.author.name} />
                ) : (
                  <span>{article.author?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="article-author__info">
                <strong>{article.author?.name}</strong>
                <div className="article-stats">
                  <span><Clock size={13} /> {article.readTime} min read</span>
                  <span>·</span>
                  <span><Eye size={13} /> {article.views} views</span>
                  <span>·</span>
                  <span>{article.publishedAt ? format(new Date(article.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="article-actions">
              <button className={`action-btn ${liked ? 'action-btn--liked' : ''}`} onClick={handleLike}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span>{likeCount}</span>
              </button>
              <button className="action-btn" onClick={handleShare}>
                <Share2 size={16} />
              </button>
              {isAuthor && (
                <>
                  <Link to={`/write/${article._id}`} className="action-btn">
                    <Edit3 size={16} />
                  </Link>
                  <button className="action-btn action-btn--danger" onClick={handleDelete}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="article-cover animate-fade-up delay-100">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        {/* Body */}
        <div
          className="article-body animate-fade-up delay-200"
          style={{
            fontFamily: article.layout?.fontFamily || 'Georgia, serif',
            fontSize: fontSizeMap[article.layout?.fontSize] || '1.1rem',
            color: article.layout?.textColor || 'var(--text-primary)',
            '--article-accent': article.layout?.accentColor || 'var(--accent)'
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer */}
        <div className="article-footer animate-fade-up delay-300">
          <div className="article-footer__tags">
            {article.tags?.map(tag => (
              <Link key={tag} to={`/?tag=${tag}`} className="article-tag">#{tag}</Link>
            ))}
          </div>

          <div className="article-footer__like">
            <button className={`like-btn-lg ${liked ? 'liked' : ''}`} onClick={handleLike}>
              <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
              <span>{liked ? 'Liked' : 'Like this article'}</span>
              <span className="like-count">{likeCount}</span>
            </button>
          </div>

          {article.author?.bio && (
            <div className="author-card">
              <div className="author-avatar author-avatar--lg">
                {article.author.avatar ? (
                  <img src={article.author.avatar} alt={article.author.name} />
                ) : (
                  <span>{article.author.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <strong className="author-card__name">{article.author.name}</strong>
                <p className="author-card__bio">{article.author.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
