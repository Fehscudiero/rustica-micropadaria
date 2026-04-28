import React from 'react';

export default function Menu({ products, menuIntro, pinRef, trackRef }) {
  // menuIntro.title supports \n for line breaks
  const titleLines = menuIntro.title.split('\n');

  return (
    <section id="cardapio" ref={pinRef} className="menu-pin-section">
      <div ref={trackRef} className="menu-scroll-track">
        <div className="menu-intro">
          <h2>
            {titleLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}{i < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p>{menuIntro.subtitle}</p>
        </div>
        {products.map(p => (
          <div key={p.id} className="menu-card">
            <div className="menu-card-img"><img src={p.image} alt={p.name} /></div>
            <div className="menu-card-body">
              <span className="menu-tag">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
