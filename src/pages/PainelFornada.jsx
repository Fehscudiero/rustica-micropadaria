import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { gsap } from 'gsap';
import { Clock, Utensils, EyeOff, CheckCircle2, Loader2, Flame } from 'lucide-react';
import * as content from '../data';

export default function PainelFornada() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [minutosManuais, setMinutosManuais] = useState('');
  const [tituloPao, setTituloPao] = useState('');

  const mainRef = useRef(null); 
  const cardRef = useRef(null);
  const statusRef = useRef(null);

  const theme = {
    primary: '#1B3022', // Verde Rústica
    accent: '#C8956C',  // Bronze/Ouro
    danger: '#E63946',
    bgCustom: '#D7E692',
    glass: 'rgba(255, 255, 255, 0.75)',
    fontDisplay: "'Playfair Display', serif",
    fontBody: "'Inter', sans-serif"
  };

  const presets = [
    { label: 'Express', desc: '30 min', value: 30, icon: <Flame size={18} /> },
    { label: 'Padrão', desc: '1 hora', value: 60, icon: <Utensils size={18} /> },
    { label: 'Lenta', desc: '2 horas', value: 120, icon: <Clock size={18} /> },
    { label: 'Especial', desc: '2h 30m', value: 150, icon: <Clock size={18} /> },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrada triunfal do card
      gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }
      );

      // Animação das bolhas de fundo
      gsap.to(".bubble", {
        y: "random(-60, 60)",
        x: "random(-60, 60)",
        duration: "random(6, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.8, from: "random" }
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const atualizarBanco = async (dataISO, titulo, visivel = true) => {
    setLoading(true);
    setSucesso(false);
    try {
      const fornadaCol = collection(db, 'fornada');
      const snapshot = await getDocs(fornadaCol);
      
      const payload = { 
        horario_fim: dataISO,
        titulo: titulo || 'Pão Fresquinho',
        visivel: visivel // Flag de controle sincronizada
      };

      if (snapshot.empty) {
        await addDoc(fornadaCol, payload);
      } else {
        const docRef = doc(db, 'fornada', snapshot.docs[0].id);
        await updateDoc(docRef, payload);
      }

      setSucesso(true);
      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
      
      // Animação de sucesso
      gsap.fromTo(statusRef.current, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
      );

      setTimeout(() => setSucesso(false), 4000);
    } catch (error) {
      console.error("Erro no Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarFornada = (minutos) => {
    const min = parseInt(minutos);
    if (isNaN(min) || min <= 0) return;
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() + min);
    atualizarBanco(agora.toISOString(), tituloPao, true);
  };

  return (
    <main className="premium-panel" ref={mainRef}>
      <div className="bg-visuals">
        <div className="bubble b-main"></div>
        <div className="bubble b-accent"></div>
      </div>

      <div ref={cardRef} className="glass-card">
        <header className="brand-header">
          <div className="live-tag">
            <span className="dot"></span> LIVE KITCHEN
          </div>
          {content.navigation?.logo && (
            <img src="/logo.png" alt="Rústica" className="brand-logo" />
          )}
          <h1 className="brand-title">Gestão de Fornada</h1>
        </header>

        <div className="content-stack">
          <section className="input-group-premium">
            <label>O QUE ESTÁ SAINDO AGORA?</label>
            <div className="input-wrapper">
              <Utensils size={18} className="input-icon" />
              <input 
                type="text" 
                value={tituloPao}
                onChange={(e) => setTituloPao(e.target.value)}
                placeholder="Ex: Croissant de Amêndoas..."
                disabled={loading}
              />
            </div>
          </section>

          <section className="grid-presets">
            {presets.map((p) => (
              <button 
                key={p.value} 
                className="card-preset"
                onClick={() => iniciarFornada(p.value)}
                disabled={loading}
              >
                <div className="preset-icon-wrap">{p.icon}</div>
                <div className="preset-text">
                  <span className="p-label">{p.label}</span>
                  <span className="p-time">{p.desc}</span>
                </div>
              </button>
            ))}
          </section>

          <div className="divider"><span>OU TEMPO MANUAL</span></div>

          <section className="manual-entry">
            <input 
              type="number" 
              value={minutosManuais}
              onChange={(e) => setMinutosManuais(e.target.value)}
              placeholder="Minutos"
            />
            <button 
              className="btn-glow" 
              onClick={() => iniciarFornada(minutosManuais)}
              disabled={!minutosManuais || loading}
            >
              ATIVAR TIMER
            </button>
          </section>

          <button 
            className="btn-ghost"
            onClick={() => {
              if (window.confirm("Ocultar aviso do site?")) {
                atualizarBanco(new Date(0).toISOString(), "", false); // Reset seguro[cite: 2]
              }
            }}
          >
            <EyeOff size={16} /> Ocultar do Site
          </button>
        </div>

        <footer className="panel-footer" ref={statusRef}>
          {loading && <div className="status-item loading"><Loader2 className="spin" size={18}/> Sincronizando...</div>}
          {sucesso && <div className="status-item success"><CheckCircle2 size={18}/> Fornada Publicada!</div>}
        </footer>
      </div>

      <style>{`
        .premium-panel {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${theme.bgCustom};
          font-family: ${theme.fontBody};
          padding: 20px;
          overflow: hidden;
          position: relative;
        }

        .bg-visuals .bubble {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 1;
          opacity: 0.5;
        }
        .b-main { width: 500px; height: 500px; background: ${theme.primary}; top: -100px; left: -100px; }
        .b-accent { width: 400px; height: 400px; background: ${theme.accent}; bottom: -100px; right: -100px; }

        .glass-card {
          width: 100%;
          max-width: 480px;
          background: ${theme.glass};
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 40px;
          padding: 48px;
          box-shadow: 0 40px 100px rgba(27, 48, 34, 0.15);
          z-index: 10;
          position: relative;
        }

        .brand-header { text-align: center; margin-bottom: 40px; }
        .live-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: ${theme.primary};
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .live-tag .dot { width: 6px; height: 6px; background: ${theme.danger}; border-radius: 50%; animation: pulse 1.5s infinite; }

        .brand-logo { width: 80px; margin: 0 auto 15px; display: block; }
        .brand-title { font-family: ${theme.fontDisplay}; font-size: 32px; color: ${theme.primary}; margin: 0; }

        .input-group-premium label {
          font-size: 11px;
          font-weight: 700;
          color: ${theme.primary};
          letter-spacing: 1px;
          margin-bottom: 10px;
          display: block;
          opacity: 0.6;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 20px;
          padding: 4px 20px;
          border: 2px solid transparent;
          transition: 0.3s;
        }
        .input-wrapper:focus-within { border-color: ${theme.accent}; box-shadow: 0 10px 30px rgba(200, 149, 108, 0.1); }
        .input-wrapper input {
          border: none;
          padding: 16px 10px;
          width: 100%;
          font-size: 16px;
          font-weight: 500;
          outline: none;
          background: transparent;
        }
        .input-icon { color: ${theme.accent}; }

        .grid-presets {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 24px 0;
        }
        .card-preset {
          background: #fff;
          border: none;
          padding: 16px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-preset:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        .preset-icon-wrap {
          width: 36px;
          height: 36px;
          background: ${theme.bgCustom};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.primary};
        }
        .p-label { display: block; font-weight: 700; font-size: 13px; color: ${theme.primary}; text-align: center; }
        .p-time { font-size: 11px; color: ${theme.accent}; font-weight: 600; }

        .divider { text-align: center; margin: 24px 0; position: relative; }
        .divider::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: rgba(0,0,0,0.05); z-index: 1; }
        .divider span { background: #fdfdfd; padding: 0 15px; font-size: 10px; font-weight: 800; color: #000; position: relative; z-index: 2; }

        .manual-entry { display: flex; gap: 16px; align-items: center; justify-content: center; }
        .manual-entry input {
          width: 120px;
          background: #fff;
          border: none;
          border-radius: 18px;
          padding: 15px;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          outline: none;
        }
        .btn-glow {
          padding: 14px 24px;
          background: ${theme.primary};
          color: #fff;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-glow:hover { background: #8FA35D; transform: scale(1.02); }

        .btn-ghost {
          width: auto;
          margin: 16px auto 0;
          background: ${theme.danger};
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn-ghost:hover { background: #c62828; }

        .panel-footer { height: 40px; margin-top: 30px; display: flex; justify-content: center; }
        .status-item { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; }
        .status-item.success { color: ${theme.primary}; }
        .status-item.loading { color: ${theme.accent}; }

        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

        @media (max-width: 480px) {
          .glass-card { padding: 30px 20px; border-radius: 30px; }
          .grid-presets { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </main>
  );
}