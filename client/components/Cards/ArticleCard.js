'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Heart, Eye, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './ArticleCard.css';

const DOMAIN_EMOJIS = {
  technology: '💻', lifestyle: '✨', travel: '🌍', food: '🍜',
  health: '🌿', finance: '💰', culture: '🎭', science: '🔬',
  personal: '📔', other: '📝'
};

export default function ArticleCard({ article, index = 0, featured = false }) {
  const {
    title, slug, excerpt, coverImage, author,
    domain, readTime, views, likes, publishedAt, tags
  } = article;

  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : 'Draft';

  return (
    <article
      className={`article-card ${featured ? 'article-card--featured' : ''}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Cover Image */}
      <Link href={`/article/${slug}`} className="article-card__image-wrap">
        {coverImage ? (
          <img src={coverImage} alt={title} className="article-card__image" loading="lazy" />
        ) : (
          <div className="article-card__image-placeholder">
            <span className="article-card__domain-emoji">{DOMAIN_EMOJIS[domain] || '📝'}</span>
          </div>
        )}
        <div className="article-card__image-overlay" />
        {domain && (
          <span className={`article-card__domain badge badge-accent domain-${domain}`}>
            {DOMAIN_EMOJIS[domain]} {domain}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="article-card__body">
        {/* Author */}
        <div className="article-card__author">
          <div className="author-avatar">
            {author?.avatar ? (
              <img src={author.avatar} alt={author.name} />
            ) : (
              <span>{author?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="author-info">
            <span className="author-name">{author?.name}</span>
            <span className="author-date">{timeAgo}</span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <Link href={`/article/${slug}`} className="article-card__title-link">
          <h2 className="article-card__title">{title}</h2>
        </Link>

        {featured && excerpt && (
          <p className="article-card__excerpt">{excerpt}</p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="article-card__tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="article-tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="article-card__footer">
          <div className="article-card__stats">
            <span className="stat-item">
              <Clock size={13} /> {readTime} min
            </span>
            <span className="stat-item">
              <Eye size={13} /> {views || 0}
            </span>
            <span className="stat-item">
              <Heart size={13} /> {likes?.length || 0}
            </span>
          </div>
          <Link href={`/article/${slug}`} className="article-card__read-btn">
            <BookOpen size={14} /> Read
          </Link>
        </div>
      </div>
    </article>
  );
}
