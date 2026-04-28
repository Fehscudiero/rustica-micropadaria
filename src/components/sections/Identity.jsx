import React from 'react';

export function Marquee({ text }) {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...Array(4)].map((_, i) => <span key={i} className="marquee-item">{text}</span>)}
      </div>
    </div>
  );
}

export function Identity({ phrase }) {
  return (
    <div className="identity-strip reveal">
      <p className="identity-phrase">{phrase}</p>
    </div>
  );
}
