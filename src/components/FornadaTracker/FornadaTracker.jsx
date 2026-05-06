import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './FornadaTracker.module.css';
import { useHighPerfTimer } from '../../hooks/useHighPerfTimer';
import { useMagneticElement } from '../../hooks/useMagneticElement';
import { Clock } from 'lucide-react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function FornadaTracker({ productName = "Pão de Castanhas", whatsapp = "https://wa.me/5511993968023" }) {
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const timerDisplayRef = useRef(null);
  const timerSrRef = useRef(null);

  const [fimFornada, setFimFornada] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [nomeExibicao, setNomeExibicao] = useState(productName);
  const [estaVisivel, setEstaVisivel] = useState(false);
  
  // Offset do relógio (Diferença entre o servidor da Vercel e o PC do usuário)
  const [timeOffset, setTimeOffset] = useState(0);

  // 1. Sincroniza o relógio com o Servidor da Vercel (À prova de falhas e AdBlocks)
  useEffect(() => {
    let isMounted = true;
    
    const syncClock = async () => {
      try {
        // Faz uma requisição super leve ("HEAD") para o próprio site
        const res = await fetch(window.location.origin, { 
          method: 'HEAD', 
          cache: 'no-store' 
        });
        
        // Pega a data carimbada pelo servidor atômico da Vercel no cabeçalho da resposta
        const serverDateStr = res.headers.get('Date');
        
        if (serverDateStr && isMounted) {
          const realTime = new Date(serverDateStr).getTime();
          const localTime = Date.now();
          const offset = realTime - localTime;
          
          setTimeOffset(offset);
          
          // Debug visual para vocês conferirem no F12 (Console)
          console.log(`⏱️ Tempo do Servidor: ${new Date(realTime).toLocaleTimeString()}`);
          console.log(`⏱️ Tempo do PC Local: ${new Date(localTime).toLocaleTimeString()}`);
          console.log(`🔧 Correção aplicada (Offset): ${offset / 1000} segundos`);
        }
      } catch (error) {
        console.error("Falha ao sincronizar relógio com a Vercel:", error);
      }
    };
    
    syncClock();
    return () => { isMounted = false; };
  }, []);

  // 2. Escuta o Firebase
  useEffect(() => {
    const q = query(collection(db, 'fornada'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        
        if (data.titulo) setNomeExibicao(data.titulo);

        const dataFimMs = new Date(data.horario_fim).getTime();
        const dataValida = data.horario_fim && dataFimMs > 10000;
        
        if (!dataValida || data.visivel === false) {
          setEstaVisivel(false);
          setFimFornada(null);
        } else {
          setFimFornada(dataFimMs);
          setEstaVisivel(true);
        }
      } else {
        setEstaVisivel(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. Loop do Cronômetro com a Correção Ativa
  useEffect(() => {
    if (!fimFornada || !estaVisivel) return;

    const atualizarCalculo = () => {
      // O "agora" soma o offset, empurrando o relógio quebrado do usuário para a hora exata da Vercel
      const agoraCorrigido = Date.now() + timeOffset; 
      const diferencaSegundos = Math.floor((fimFornada - agoraCorrigido) / 1000);
      setTempoRestante(diferencaSegundos);
    };

    atualizarCalculo(); 
    const timerId = setInterval(atualizarCalculo, 1000);

    return () => clearInterval(timerId);
  }, [fimFornada, estaVisivel, timeOffset]);

  // 4. Animação
  useEffect(() => {
    if (estaVisivel && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(containerRef.current,
          { y: 60, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 }
        );
      }, containerRef);
      return () => ctx.revert(); 
    }
  }, [estaVisivel]);

  const jaSaiu = tempoRestante !== null && tempoRestante <= 0;

  useHighPerfTimer(timerDisplayRef, timerSrRef, tempoRestante !== null ? Math.abs(tempoRestante) : 0);
  useMagneticElement(ctaRef, 0.28);

  if (!estaVisivel || tempoRestante === null) return null;

  return (
    <div className={styles['rustica-fornada__border-wrapper']}>
      <article className={`${styles['rustica-fornada__container']} ${jaSaiu ? styles['is-hot'] : ''}`} ref={containerRef}>
        <div className={styles['rustica-fornada__header']}>
          <div className={styles['rustica-fornada__indicator']} aria-hidden="true">
            <span className={styles['rustica-fornada__pulse']} />
          </div>
          <span className={styles['rustica-fornada__title']}>{jaSaiu ? "Fornada Quentinha" : "Fornada ao Vivo"}</span>
        </div>
        
        <h4 className={styles['rustica-fornada__product']}>{nomeExibicao}</h4>
        
        <div className={styles['rustica-fornada__timer-box']}>
          <Clock size={16} strokeWidth={2.5} className={styles['rustica-fornada__icon']} />
          <span className={styles['rustica-fornada__timer-text']}>
            {jaSaiu ? "O pão saiu há:" : "Saindo em:"}{' '}
            <strong ref={timerDisplayRef} className={styles['rustica-fornada__timer-digits']}>00:00:00</strong>
          </span>
        </div>
        
        <span ref={timerSrRef} className={styles['rustica-fornada__sr-only']} aria-live="polite" />
        
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles['rustica-fornada__cta']} ref={ctaRef}>
          <span className={styles['rustica-fornada__cta-icon']}>→</span>
          <span className={styles['rustica-fornada__cta-text']}>{jaSaiu ? "Garantir o meu agora" : "Reservar Unidade"}</span>
        </a>
      </article>
    </div>
  );
}