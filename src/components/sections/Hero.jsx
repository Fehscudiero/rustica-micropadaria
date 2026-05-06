// Hero.jsx - COLA O CÓDIGO INTEIRO
import React from 'react';
import { ChevronRight, MessageCircle, MapPin, Clock } from 'lucide-react';
import FornadaTracker from '../FornadaTracker/FornadaTracker';
import styles from '../FornadaTracker/FornadaTracker.module.css'; 

export default function Hero({ content, heroLogoRef, fornadaTracker }) {
  return (
    <header className="hero">
      <div className="container hero-layout">
        <div>
          <h1 className="hero-title">
            <span className="hero-title-line"><span className="hero-title-word">{content.titleLine1}</span></span>
            <span className="hero-title-line"><span className="hero-title-word">{content.titleLine2}</span></span>
          </h1>
          <p className="hero-sub">{content.subtitle}</p>
          
          <div className="hero-ctas">
            <a href={content.ctaPrimary.href} className="btn-cta">
              {content.ctaPrimary.label} <ChevronRight size={16} />
            </a>
            <a href={content.ctaSecondary.href} target="_blank" rel="noopener noreferrer" className="hero-whatsapp-link">
              <MessageCircle size={18} /> {content.ctaSecondary.label}
            </a>
          </div>

          <div className="hero-tracker-wrap">
            <FornadaTracker
              productName={fornadaTracker.productName}
              whatsapp={fornadaTracker.whatsapp}
            />
          </div>
        </div>

        <div className="hero-logo-wrap">
          <div className={styles['rustica-fornada__border-wrapper']} style={{ borderRadius: '50%', padding: '1.5px' }}>
            <div className="hero-logo-inner" ref={heroLogoRef} style={{ borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              
              {/* O segredo está aqui: NÃO use variável, use a string "/logo.png" */}
              <img 
                src="/logo.png" 
                alt="Rústica" 
                fetchPriority="high" 
                loading="eager" 
                decoding="sync"
              />
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}