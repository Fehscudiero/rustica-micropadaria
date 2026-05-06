import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { gsap } from 'gsap';
import * as content from '../data'; 

export default function PainelFornada() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [minutosManuais, setMinutosManuais] = useState('');
  
  const cardRef = useRef(null);

  const theme = {
    primary: '#1B3022',
    primaryLight: '#2D4C38',
    accent: '#C8956C',
    accentWarm: '#D4A574',
    bgCream: '#FAF7F2',
    bgWarm: '#F5EEE6',
    textMain: '#1A1A1A',
    textMuted: '#6B6B6B',
    radius: '20px',
    radiusLg: '32px',
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'Inter', -apple-system, sans-serif"
  };

  const presets = [
    { label: 'Rápida', desc: '30 min', value: 30, icon: '🥖' },
    { label: 'Padrão', desc: '1 hora', value: 60, icon: '🥐' },
    { label: 'Tradicional', desc: '2 horas', value: 120, icon: '🍞' },
    { label: 'Especial', desc: '2h 30m', value: 150, icon: '🥯' },
  ];

  useEffect(() => {
    // Garante que o GSAP anime o card na entrada
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }
      );
    }
  }, []);

  const atualizarBanco = async (dataISO) => {
    setLoading(true);
    setSucesso(false);
    try {
      const fornadaCol = collection(db, 'fornada');
      const snapshot = await getDocs(fornadaCol);

      if (snapshot.empty) {
        await addDoc(fornadaCol, { horario_fim: dataISO });
      } else {
        const docRef = doc(db, 'fornada', snapshot.docs[0].id);
        await updateDoc(docRef, { horario_fim: dataISO });
      }
      
      setSucesso(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50); 
      setTimeout(() => setSucesso(false), 4000);
    } catch (error) {
      console.error("Erro ao atualizar Firebase:", error);
      alert("Erro na conexão com o banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const iniciarFornada = (minutos) => {
    const min = parseInt(minutos);
    if (isNaN(min) || min <= 0) return;
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + min);
    atualizarBanco(agora.toISOString());
  };

  return (
    <main className="panel-container">
      <div ref={cardRef} className="panel-card">
        
        <header className="panel-header">
          {content.navigation?.logo && (
            <img src={content.navigation.logo} alt="Rústica" className="panel-logo" />
          )}
          <h1 className="panel-title">Sistema de Timer</h1>
          <p className="panel-subtitle">Painel de Gestão da Cozinha</p>
        </header>

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
            if(window.confirm("Deseja ocultar o aviso do site?")) {
              atualizarBanco(new Date(0).toISOString());
            }
          }}
          disabled={loading}
        >
          🛑 Ocultar aviso no site
        </button>

        <div className="status-container">
          {loading && <div className="loader">Sincronizando...</div>}
          {sucesso && <div className="success-msg">✓ Site atualizado ao vivo!</div>}
        </div>
      </div>

      <style>{`
        .panel-container {
          display: flex;
          min-height: 100vh;
          background: ${theme.bgWarm};
          background-image: radial-gradient(${theme.accent}22 1px, transparent 1px);
          background-size: 24px 24px;
          padding: 20px;
          align-items: center;
          justify-content: center;
          font-family: ${theme.fontBody};
          cursor: auto !important; /* Força o cursor do sistema a aparecer */
        }

        .panel-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          padding: 40px 32px;
          border-radius: ${theme.radiusLg};
          box-shadow: 0 20px 50px rgba(27, 48, 34, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.5);
          cursor: auto !important;
        }

        .panel-header { text-align: center; margin-bottom: 40px; cursor: auto; }
        .panel-logo { width: 120px; margin: 0 auto 20px; display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.05)); }
        .panel-title { font-family: ${theme.fontDisplay}; font-size: 32px; color: ${theme.primary}; margin: 0; }
        .panel-subtitle { color: ${theme.textMuted}; font-size: 14px; margin-top: 8px; }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }

        .preset-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 16px;
          background: ${theme.bgCream};
          border: 1px solid ${theme.bgWarm};
          border-radius: ${theme.radius};
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .preset-button:active { transform: scale(0.96); background: ${theme.bgWarm}; }
        .preset-icon { font-size: 24px; }
        .preset-label { display: block; font-weight: 700; color: ${theme.primary}; font-size: 15px; }
        .preset-desc { font-size: 12px; color: ${theme.accent}; font-weight: 500; }

        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: ${theme.textMuted}; margin-bottom: 12px; font-weight: 800; padding-left: 4px;}

        .input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        input {
          flex: 1;
          padding: 18px 20px;
          border-radius: ${theme.radius};
          border: 2px solid ${theme.bgWarm};
          background: ${theme.bgCream};
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
          cursor: text !important;
        }

        input:focus { border-color: ${theme.accent}; }

        .btn-primary {
          background: ${theme.accent};
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
          border: 1px solid #e6394633;
          color: #e63946;
          padding: 16px;
          border-radius: ${theme.radius};
          font-size: 13px;
          font-weight: 700;
          cursor: pointer !important;
          transition: background 0.2s;
        }

        .btn-reset:active { background: #e6394611; }

        .status-container { height: 40px; margin-top: 20px; display: flex; justify-content: center; align-items: center; }
        .success-msg { color: ${theme.primary}; font-weight: 700; font-size: 14px; animation: fadeInUp 0.5s ease; }
        
        .loader { color: ${theme.accent}; font-weight: 600; font-size: 14px; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 440px) {
          .presets-grid { grid-template-columns: 1fr; }
          .panel-card { padding: 32px 20px; }
          .panel-title { font-size: 26px; }
          .input-group { flex-direction: column; }
          .btn-primary { padding: 18px; }
        }

        .preset-button:hover {
          box-shadow: 0 10px 20px rgba(200, 149, 108, 0.1);
          border-color: ${theme.accent}44;
        }
      `}</style>
    </main>
  );
}