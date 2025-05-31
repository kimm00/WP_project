// src/components/Footer.js
import React from 'react';
import '../App.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {year} ChalLedger. All rights reserved.</p>
        <p className="footer-links">
          <a href="https://github.com/kimm00/WP_project" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;