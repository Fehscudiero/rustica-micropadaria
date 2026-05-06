import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Navbar({ navigation, menuOpen, setMenuOpen }) {
  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          <img src={navigation.logo} alt="Rústica" />
        </a>
        <div className={`nav-links${menuOpen ? ' is-open' : ''}`}>
          {navigation.links.map((link, i) => (
            <a 
              key={i} 
              href={link.href} 
              className={`nav-link ${link.label === 'Fornada Ao VIVO' ? 'nav-link-live' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a 
            href={navigation.cta.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-cta" 
            onClick={() => setMenuOpen(false)}
          >
            {navigation.cta.label} <ArrowRight size={16} />
          </a>
        </div>
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
