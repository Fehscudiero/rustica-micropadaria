import React from 'react';

export default function Story({ content }) {
  return (
    <section id="historia" className="section-pad">
      <div className="container story-grid">
        <div className="story-img reveal">
          <img src={content.image} alt={content.imageAlt} />
        </div>
        <div className="reveal">
          <p className="story-label">{content.label}</p>
          <h2
            className="story-title"
            dangerouslySetInnerHTML={{ __html: content.title.replace(' e ', '<br/>e ') }}
          />
          <p className="story-text">{content.text}</p>
          <div className="stats-row">
            {content.stats.map((stat, i) => (
              <div key={i}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
