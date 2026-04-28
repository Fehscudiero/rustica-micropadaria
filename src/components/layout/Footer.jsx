import React from 'react';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer({ content, footerLogoRef, navigationLogo }) {
  const { address, hours, founders, contact } = content;

  return (
    <footer className="footer" id="contato">
      <div className="container">
        <div className="footer-top">
          <div className="footer-logo-big">
            <div className="footer-logo-inner" ref={footerLogoRef}>
              <img src={navigationLogo} alt="Rústica" />
            </div>
          </div>
          <p className="footer-tagline">{content.tagline}</p>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4>{address.title}</h4>
            <p dangerouslySetInnerHTML={{ __html: address.text.replace(/\n/g, '<br/>') }} />
            <a href={address.mapLink} 
               target="_blank" rel="noopener noreferrer"
               className="footer-map-link">
              <FaMapMarkerAlt /> Ver no Mapa
            </a>
          </div>
          <div className="footer-col">
            <h4>{hours.title}</h4>
            {hours.days.map((item, i) => (
              <p key={i} style={{ marginTop: i > 0 ? '1rem' : 0 }}>
                {item.label}<br/>{item.time}
              </p>
            ))}
          </div>
          <div className="footer-col">
            <h4>{founders.title}</h4>
            <p dangerouslySetInnerHTML={{ __html: founders.names.join('<br/>') }} />
          </div>
          <div className="footer-col">
            <h4>{contact.title}</h4>
            <div className="social-icons">
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <FaInstagram />
              </a>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href={`mailto:${contact.email}`} className="social-icon" title="E-mail">
                <FaEnvelope />
              </a>
            </div>
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer"
               className="footer-phone">
              <FaPhone /> {contact.phone}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{content.copyright}</p>
          <p>{content.madeBy}</p>
        </div>
      </div>
    </footer>
  );
}