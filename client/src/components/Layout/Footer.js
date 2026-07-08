import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span>✦</span> InkWell
            </Link>
            <p className="footer__tagline">A space for thoughtful writing.<br />Where ideas find their voice.</p>
          </div>
          <div className="footer__links">
            <div className="footer__col">
              <h4>Read</h4>
              <Link to="/?domain=technology">Technology</Link>
              <Link to="/?domain=lifestyle">Lifestyle</Link>
              <Link to="/?domain=travel">Travel</Link>
              <Link to="/?domain=science">Science</Link>
            </div>
            <div className="footer__col">
              <h4>Write</h4>
              <Link to="/write">New Article</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
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
