import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './FornadaTracker.module.css';
import { useHighPerfTimer } from '../../hooks/useHighPerfTimer';
import { useMagneticElement } from '../../hooks/useMagneticElement';
import { Clock } from 'lucide-react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebase'; // Ajuste o caminho se necessário

export default function FornadaTracker({ productName = "Pão de Castanhas", whatsapp = "https://wa.me/5511993968023" }) {
  const containerRef = useRef(null);
  const ctaRef = useRef(null);

  // Timer refs: one for display (DOM injection), one for screen readers (aria-live)
  const timerDisplayRef = useRef(null);
  const timerSrRef = useRef(null);

  const [tempoRestante, setTempoRestante] = useState(0);

  // Escuta o Firebase em tempo real (zero re-renders em loop, roda apenas quando a cozinha atualiza)
  useEffect(() => {
    const q = query(collection(db, 'fornada'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data.horario_fim) {
          const fim = new Date(data.horario_fim).getTime();
          const agora = new Date().getTime();
          // Calcula diferença em segundos e garante que não fique negativo
          const diferencaSegundos = Math.max(0, Math.floor((fim - agora) / 1000));
          
          setTempoRestante(diferencaSegundos);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // High-perf timer
  // Nota: Garanta que lá dentro do seu useHighPerfTimer ele reaja quando o "tempoRestante" mudar de 0 para o tempo real.
  useHighPerfTimer(timerDisplayRef, timerSrRef, tempoRestante);

  // Magnetic button physics
  useMagneticElement(ctaRef, 0.28);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 60, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.4 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Oculta o componente se o timer estiver zerado para não gerar frustração
  if (tempoRestante === 0) return null;

  return (
    <article
      className={styles['rustica-fornada__container']}
      ref={containerRef}
      aria-label={`Status ao vivo da fornada de ${productName}`}
    >
      {/* Status Header */}
      <div className={styles['rustica-fornada__header']}>
        <div
          className={styles['rustica-fornada__indicator']}
          aria-hidden="true"
        >
          <span className={styles['rustica-fornada__pulse']} />
        </div>
        <span className={styles['rustica-fornada__title']}>Fornada ao Vivo</span>
      </div>

      {/* Product Name */}
      <h4 className={styles['rustica-fornada__product']}>{productName}</h4>

      {/* Timer Box */}
      <div className={styles['rustica-fornada__timer-box']}>
        <Clock
          size={16}
          strokeWidth={2.5}
          className={styles['rustica-fornada__icon']}
          aria-hidden="true"
        />
        <span className={styles['rustica-fornada__timer-text']}>
          Saindo em:{' '}
          {/* aria-hidden: the visual timer is meaningless to screen readers mid-update */}
          <strong
            ref={timerDisplayRef}
            className={styles['rustica-fornada__timer-digits']}
            aria-hidden="true"
          >
            --:--:--
          </strong>
        </span>
      </div>

      {/* aria-live: screen readers receive a calm, rate-limited update */}
      <span
        ref={timerSrRef}
        className={styles['rustica-fornada__sr-only']}
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Magnetic CTA */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['rustica-fornada__cta']}
        ref={ctaRef}
        aria-label={`Reservar ${productName} via WhatsApp`}
      >
        <span aria-hidden="true" className={styles['rustica-fornada__cta-icon']}>→</span>
        <span className={styles['rustica-fornada__cta-text']}>Reservar Unidade</span>
      </a>
    </article>
  );
}