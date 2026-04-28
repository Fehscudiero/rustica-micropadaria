import React from 'react';
import { ChevronRight, MessageCircle, MapPin, Clock } from 'lucide-react';
import FornadaTracker from '../FornadaTracker/FornadaTracker';

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
          <div className="hero-meta">
            {content.meta.map((item, i) => (
              <div key={i} className="hero-meta-item">
                <div className="hero-meta-icon">
                  {item.icon === 'MapPin' ? <MapPin size={16} /> : <Clock size={16} />}
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <a href={content.ctaPrimary.href} className="btn-cta">
              {content.ctaPrimary.label} <ChevronRight size={16} />
            </a>
            <a href={content.ctaSecondary.href} target="_blank" rel="noopener noreferrer"
               className="hero-whatsapp-link">
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
          <div className="hero-logo-inner" ref={heroLogoRef}>
            <img src={content.logo} alt="Rústica Micropadaria" />
          </div>
        </div>
      </div>
    </header>
  );
}
