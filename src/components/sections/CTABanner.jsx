import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function CTABanner({ content }) {
  return (
    <section className="section-pad">
      <div className="container">
        <div className="cta-banner">
          <h2>{content.title}</h2>
          <a
            href={content.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-light"
          >
            <MessageCircle size={20} /> {content.btnLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
