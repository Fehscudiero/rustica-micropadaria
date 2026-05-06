import React from 'react';
import { ChevronRight, MessageCircle, MapPin, Clock } from 'lucide-react';
import FornadaTracker from '../FornadaTracker/FornadaTracker';
// Importamos os estilos para usar a animação da borda
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
          {/* ENVOLVEMOS O LOGO COM O WRAPPER DA BORDA ANIMADA */}
          <div 
            className={styles['rustica-fornada__border-wrapper']} 
            style={{ borderRadius: '50%', padding: '4px' }}
          >
            <div 
              className="hero-logo-inner" 
              ref={heroLogoRef}
              style={{ 
                borderRadius: '50%', 
                background: '#fff', // Fundo branco para o logo não ficar transparente sobre a animação
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img src={content.logo} alt="Rústica Micropadaria" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}