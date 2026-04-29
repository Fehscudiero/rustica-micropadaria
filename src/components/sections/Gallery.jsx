import React from 'react';

export default function Gallery({ content }) {
  return (
    <section id="espaco" className="section-pad">
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="story-label" style={{ textAlign: 'center' }}>{content.label}</p>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>{content.title}</h2>
        </div>
        <div className="mosaic-grid">
          {content.images.map((img, i) => (
            <div key={i} className={`mosaic-item m${i+1}`}>
              <img src={img} alt={`Vibe Rústica ${i+1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
