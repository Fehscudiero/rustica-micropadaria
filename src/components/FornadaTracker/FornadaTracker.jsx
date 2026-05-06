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

  // Estados limpos e separados
  const [fimFornada, setFimFornada] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);
  const [nomeExibicao, setNomeExibicao] = useState(productName);
  const [estaVisivel, setEstaVisivel] = useState(false); // Começa invisível até ter dados válidos

  // 1. Escuta o Firebase apenas para pegar o "Horário Alvo"
  useEffect(() => {
    const q = query(collection(db, 'fornada'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        
        if (data.titulo) setNomeExibicao(data.titulo);

        const dataFimMs = new Date(data.horario_fim).getTime();
        
        // Verifica se é a data de Reset (1970) que enviamos pelo botão de Desligar (10000ms = margem de segurança)
        const dataValida = data.horario_fim && dataFimMs > 10000;
        
        // Se a data for inválida (foi desligado no painel), esconde o componente
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

    return () => unsubscribe(); // Cleanup correto da inscrição do Firebase
  }, []);

  // 2. Loop do Cronômetro (Totalmente isolado do Firebase)
  useEffect(() => {
    if (!fimFornada || !estaVisivel) return;

    const atualizarCalculo = () => {
      const agora = Date.now();
      const diferencaSegundos = Math.floor((fimFornada - agora) / 1000);
      setTempoRestante(diferencaSegundos);
    };

    atualizarCalculo(); // Dispara imediatamente para não ter delay de 1s
    const timerId = setInterval(atualizarCalculo, 1000);

    // Cleanup perfeito: destrói o intervalo se o componente desmontar ou se a data alvo mudar
    return () => clearInterval(timerId);
  }, [fimFornada, estaVisivel]);

  // 3. Animação do GSAP
  useEffect(() => {
    if (estaVisivel && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(containerRef.current,
          { y: 60, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 } // Reduzi o delay levemente para parecer mais responsivo
        );
      }, containerRef);
      return () => ctx.revert(); // Previne conflitos de animação se o React fizer re-render rápido
    }
  }, [estaVisivel]);

  // Derivando estado: Não precisamos de um useState para o jaSaiu
  const jaSaiu = tempoRestante !== null && tempoRestante <= 0;

  // Hooks Customizados
  useHighPerfTimer(timerDisplayRef, timerSrRef, tempoRestante !== null ? Math.abs(tempoRestante) : 0);
  useMagneticElement(ctaRef, 0.28);

  // Fallback visual: Esconde tudo enquanto não tem os dados
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