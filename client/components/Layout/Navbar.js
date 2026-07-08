'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Sun, Moon, PenLine, BookOpen, LayoutDashboard, LogOut, Menu, X, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''}`}>
      <nav className="navbar__inner container">
        {/* Logo */}
        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">InkWell</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link href="/" className={`navbar__link ${pathname === '/' ? 'active' : ''}`}>
            <BookOpen size={16} /> Read
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className={`navbar__link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/write" className="btn btn-primary btn-sm">
                <PenLine size={15} /> Write
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link href="/login" className="navbar__link">Log in</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Start Writing</Link>
            </>
          )}
        </div>

        {/* Right Controls */}
        <div className="navbar__controls">
          {/* Theme Toggle */}
          <button className="navbar__theme-btn" onClick={toggleTheme} title="Toggle theme">
            <span className={`theme-icon ${isDark ? 'theme-icon--moon' : 'theme-icon--sun'}`}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </span>
          </button>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="navbar__user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="navbar__avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              {userMenuOpen && (
                <div className="navbar__user-menu animate-scale-in">
                  <div className="user-menu__header">
                    <strong>{user?.name}</strong>
                    <small>{user?.email}</small>
                  </div>
                  <Link href="/dashboard" className="user-menu__item">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link href="/profile" className="user-menu__item">
                    <User size={15} /> Profile
                  </Link>
                  <div className="user-menu__divider" />
                  <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu animate-fade-up">
          <Link href="/" className="mobile-link">
            <BookOpen size={18} /> Read Articles
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="mobile-link">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link href="/write" className="mobile-link mobile-link--accent">
                <PenLine size={18} /> Write Article
              </Link>
              <button className="mobile-link mobile-link--danger" onClick={handleLogout}>
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-link">Log in</Link>
              <Link href="/register" className="mobile-link mobile-link--accent">Start Writing</Link>
            </>
          )}
          <div className="mobile-theme-row">
            <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
            <button className="navbar__theme-btn" onClick={toggleTheme}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
