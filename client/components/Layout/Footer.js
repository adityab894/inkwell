'use client';

import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <span>✦</span> InkWell
            </Link>
            <p className="footer__tagline">A space for thoughtful writing.<br />Where ideas find their voice.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h4>Read</h4>
              <Link href="/?domain=technology">Technology</Link>
              <Link href="/?domain=lifestyle">Lifestyle</Link>
              <Link href="/?domain=travel">Travel</Link>
              <Link href="/?domain=science">Science</Link>
            </div>
            <div className="footer__col">
              <h4>Write</h4>
              <Link href="/write">New Article</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile">Profile</Link>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} InkWell. Built with care for writers.</p>
          <p className="footer__credit">Made with ✦ and a lot of words</p>
        </div>
      </div>
    </footer>
  );
}
