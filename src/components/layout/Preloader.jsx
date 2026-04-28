import React from 'react';

export default function Preloader({ logo }) {
  return (
    <div className="preloader">
      <div className="preloader-logo">
        <img src={logo} alt="Rústica" />
      </div>
      <div className="preloader-text">Micropadaria</div>
      <div className="preloader-bar"><div className="preloader-fill" /></div>
    </div>
  );
}
