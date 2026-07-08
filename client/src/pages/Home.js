import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import ArticleCard from '../components/Cards/ArticleCard';
import './Home.css';

const DOMAINS = [
  { value: 'all', label: 'All', emoji: '🌐' },
  { value: 'technology', label: 'Tech', emoji: '💻' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '✨' },
  { value: 'travel', label: 'Travel', emoji: '🌍' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'health', label: 'Health', emoji: '🌿' },
  { value: 'finance', label: 'Finance', emoji: '💰' },
  { value: 'culture', label: 'Culture', emoji: '🎭' },
  { value: 'science', label: 'Science', emoji: '🔬' },
  { value: 'personal', label: 'Personal', emoji: '📔' },
];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: '180px', borderRadius: '12px 12px 0 0' }} />
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '14px', width: '60%' }} />
        <div className="skeleton" style={{ height: '20px', width: '90%' }} />
        <div className="skeleton" style={{ height: '16px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', marginTop: '6px' }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort: '-publishedAt' };
      if (domain !== 'all') params.domain = domain;
      if (search) params.search = search;

      const res = await axios.get('/api/articles', { params });
      setArticles(res.data.articles);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching articles', err);
    } finally {
      setLoading(false);
    }
  }, [domain, search, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setPage(1);
  }, [domain, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge animate-fade-up">
              <Sparkles size={14} />
              <span>A space for thoughtful writing</span>
            </div>
            <h1 className="hero__title animate-fade-up delay-100">
              Where ideas find<br />
              <span className="gradient-text">their voice</span>
            </h1>
            <p className="hero__subtitle animate-fade-up delay-200">
              Discover beautifully written articles across technology, culture, travel, and the stories that move us.
            </p>

            {/* Search */}
            <form className="hero__search animate-fade-up delay-300" onSubmit={handleSearchSubmit}>
              <div className="search-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles, topics, authors..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary search-btn">Search</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Domain Filter */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-bar">
            <div className="filter-bar__scroll">
              {DOMAINS.map(d => (
                <button
                  key={d.value}
                  className={`filter-chip ${domain === d.value ? 'filter-chip--active' : ''}`}
                  onClick={() => setDomain(d.value)}
                >
                  <span>{d.emoji}</span> {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="articles-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <div className="section-header__left">
              <TrendingUp size={18} className="section-icon" />
              <h2 className="section-title">
                {search ? `Results for "${search}"` : domain === 'all' ? 'Latest Articles' : `${DOMAINS.find(d => d.value === domain)?.emoji} ${DOMAINS.find(d => d.value === domain)?.label}`}
              </h2>
            </div>
            {total > 0 && (
              <span className="section-count">{total} {total === 1 ? 'article' : 'articles'}</span>
            )}
          </div>

          {loading ? (
            <div className="articles-grid">
              {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📭</div>
              <h3>No articles found</h3>
              <p>{search ? `No results for "${search}". Try a different search.` : 'Be the first to write in this category!'}</p>
            </div>
          ) : (
            <>
              {/* Featured First Article */}
              {featuredArticle && !search && page === 1 && (
                <div className="featured-row">
                  <ArticleCard article={featuredArticle} featured={true} index={0} />
                </div>
              )}

              {/* Grid */}
              <div className="articles-grid">
                {(search || page > 1 ? articles : gridArticles).map((article, i) => (
                  <ArticleCard key={article._id} article={article} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </button>
                  <div className="pagination__pages">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          className={`pagination__page ${page === p ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
