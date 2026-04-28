import React from 'react';

export default function HowItWorks({ content }) {
  return (
    <section id="como-funciona" className="section-pad">
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <p className="story-label" style={{ textAlign: 'center' }}>{content.label}</p>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', maxWidth: '600px', margin: '0 auto' }}>{content.title}</h2>
        </div>
        <div className="how-grid">
          {content.steps.map((step, i) => (
            <div key={i} className="how-card reveal">
              <div className="how-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
