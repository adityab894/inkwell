'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <span>✦</span> InkWell
            </Link>
            <p className="footer__tagline">The technical publishing platform.<br />Development, DevOps, AI & DevRel.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h4>Sections</h4>
              <Link href="/?domain=development">Development</Link>
              <Link href="/?domain=devops">DevOps</Link>
              <Link href="/?domain=ai">AI</Link>
              <Link href="/?domain=devrel">DevRel</Link>
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
