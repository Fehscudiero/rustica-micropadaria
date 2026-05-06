import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { gsap } from 'gsap';
import * as content from '../data';

export default function PainelFornada() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [minutosManuais, setMinutosManuais] = useState('');
  const [tituloPao, setTituloPao] = useState('');

  const mainRef = useRef(null); 
  const cardRef = useRef(null);

  const theme = {
    primary: '#1B3022',
    primaryLight: '#2D4C38',
    accent: '#C8956C',
    accentWarm: '#D4A574',
    olivaDark: '#3D4726', 
    olivaLight: '#A9BA9D',
    bgCustom: '#D7E692',
    bgCream: '#FAF7F2',
    textMain: '#1A1A1A',
    textMuted: '#6B6B6B',
    radius: '20px',
    radiusLg: '32px',
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'Inter', -apple-system, sans-serif"
  };

  const presets = [
    { label: 'Rápida -', desc: '30 min', value: 30, icon: '🥖' },
    { label: 'Padrão -', desc: '1 hora', value: 60, icon: '🥐' },
    { label: 'Tradicional -', desc: '2 horas', value: 120, icon: '🍞' },
    { label: 'Especial -', desc: '2h 30m', value: 150, icon: '🥯' },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      gsap.fromTo(cardRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' }
      );

      gsap.to(".bubble", {
        y: "random(-40, 40)",
        x: "random(-40, 40)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random"
        }
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const atualizarBanco = async (dataISO, titulo) => {
    setLoading(true);
    setSucesso(false);
    try {
      const fornadaCol = collection(db, 'fornada');
      const snapshot = await getDocs(fornadaCol);
      const payload = { 
        horario_fim: dataISO,
        titulo: titulo || 'Pão Fresquinho'
      };

      if (snapshot.empty) {
        await addDoc(fornadaCol, payload);
      } else {
        const docRef = doc(db, 'fornada', snapshot.docs[0].id);
        await updateDoc(docRef, payload);
      }

      setSucesso(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      setTimeout(() => setSucesso(false), 4000);
    } catch (error) {
      console.error("Erro no Firebase:", error);
      alert("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const iniciarFornada = (minutos) => {
    const min = parseInt(minutos);
    if (isNaN(min) || min <= 0) return;
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + min);
    atualizarBanco(agora.toISOString(), tituloPao);
  };

  return (
    <main className="panel-container" ref={mainRef}>
      <div className="bubbles-background">
        <div className="bubble b1"></div>
        <div className="bubble b2"></div>
        <div className="bubble b3"></div>
        <div className="bubble b4"></div>
        <div className="bubble b5"></div>
        <div className="bubble b6"></div>
      </div>

      <div ref={cardRef} className="panel-card">
        <header className="panel-header">
          {content.navigation?.logo && (
            <img src={content.navigation.logo} alt="Rústica" className="panel-logo" />
          )}
          <h1 className="panel-title">Sistema de Timer</h1>
          <p className="panel-subtitle">Painel de Gestão da Cozinha</p>
        </header>

        <section className="manual-section" style={{ marginBottom: '24px' }}>
          <h2 className="section-title">O que está saindo?</h2>
          <input
            type="text"
            className="input-full"
            value={tituloPao}
            onChange={(e) => setTituloPao(e.target.value)}
            placeholder="Nome do pão..."
            disabled={loading}
          />
        </section>

        <section className="presets-grid">
          {presets.map((p) => (
            <button
              key={p.value}
              className="preset-button"
              onClick={() => iniciarFornada(p.value)}
              disabled={loading}
            >
              <span className="preset-icon">{p.icon}</span>
              <div className="preset-info">
                <span className="preset-label">{p.label}</span>
                <span className="preset-desc">{p.desc}</span>
              </div>
            </button>
          ))}
        </section>

        <section className="manual-section">
          <h2 className="section-title">Tempo Personalizado</h2>
          <div className="input-group">
            <input
              type="number"
              value={minutosManuais}
              onChange={(e) => setMinutosManuais(e.target.value)}
              placeholder="Minutos..."
              disabled={loading}
            />
            <button
              className="btn-primary"
              onClick={() => iniciarFornada(minutosManuais)}
              disabled={!minutosManuais || loading}
            >
              Iniciar
            </button>
          </div>
        </section>

        <button
          className="btn-reset"
          onClick={() => {
            if (window.confirm("Deseja ocultar o aviso do site?")) {
              atualizarBanco(new Date(0).toISOString(), "");
            }
          }}
          disabled={loading}
        >
          🛑 Ocultar aviso no site
        </button>

        <div className="status-container">
          {loading && <div className="loader">Sincronizando...</div>}
          {sucesso && <div className="success-msg">✓ Site atualizado!</div>}
        </div>
      </div>

      <style>{`
        .panel-container {
          position: relative;
          display: flex;
          min-height: 100vh;
          background-color: ${theme.bgCustom};
          padding: 20px;
          align-items: center;
          justify-content: center;
          font-family: ${theme.fontBody};
          overflow: hidden;
          cursor: default !important;
        }

        .bubbles-background {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          will-change: transform;
        }
        
        .b1 { width: 450px; height: 450px; background: ${theme.olivaDark}; top: -150px; left: -100px; }
        .b2 { width: 350px; height: 350px; background: ${theme.olivaLight}; bottom: 0%; right: -50px; }
        .b3 { width: 250px; height: 250px; background: ${theme.olivaDark}; top: 15%; right: 5%; opacity: 0.3; }
        .b4 { width: 380px; height: 380px; background: #ffffff; bottom: -100px; left: 10%; opacity: 0.25; }
        .b5 { width: 180px; height: 180px; background: ${theme.olivaDark}; top: 45%; left: -30px; }
        .b6 { width: 300px; height: 300px; background: ${theme.olivaLight}; top: -20px; left: 30%; opacity: 0.4; }

        .panel-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(15px);
          padding: 40px 32px;
          border-radius: ${theme.radiusLg};
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .panel-header { 
          text-align: center; 
          margin-bottom: 30px; 
        }

        /* LOGO CENTRALIZADO */
        .panel-logo { 
          display: block;
          width: 90px; 
          margin: 0 auto 15px; 
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.05));
        }

        .panel-title { font-family: ${theme.fontDisplay}; font-size: 28px; color: ${theme.primary}; margin: 0; }
        .panel-subtitle { color: ${theme.textMuted}; font-size: 14px; margin-top: 5px; }

        .presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .preset-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 14px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: ${theme.radius};
          cursor: pointer !important;
          transition: all 0.3s ease;
        }
        .preset-button:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border-color: ${theme.accent};
        }

        .input-full {
          width: 100%;
          padding: 16px;
          border-radius: ${theme.radius};
          border: 2px solid rgba(0,0,0,0.06);
          font-size: 16px;
          outline: none;
          background: #fff;
          cursor: text !important;
        }
        .input-full:focus { border-color: ${theme.accent}; }

        .input-group { display: flex; gap: 8px; margin-bottom: 20px; }
        input[type="number"] {
          flex: 1;
          padding: 16px;
          border-radius: ${theme.radius};
          border: 2px solid rgba(0,0,0,0.06);
          cursor: text !important;
        }

        .btn-primary {
          background: ${theme.primary};
          color: white;
          border: none;
          padding: 0 24px;
          border-radius: ${theme.radius};
          font-weight: 700;
          cursor: pointer !important;
        }

        .btn-reset {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(230, 57, 70, 0.2);
          color: #e63946;
          padding: 14px;
          border-radius: ${theme.radius};
          font-size: 12px;
          font-weight: 700;
          cursor: pointer !important;
        }

        .status-container { height: 30px; margin-top: 15px; text-align: center; }
        .success-msg { color: ${theme.primary}; font-weight: 700; }
        .loader { color: ${theme.accent}; font-weight: 600; }

        @media (max-width: 440px) {
          .presets-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}