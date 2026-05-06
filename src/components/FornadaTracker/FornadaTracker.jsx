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

  const [tempoRestante, setTempoRestante] = useState(null);
  const [nomeExibicao, setNomeExibicao] = useState(productName);

  useEffect(() => {
    const q = query(collection(db, 'fornada'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data.titulo) setNomeExibicao(data.titulo);

        if (data.horario_fim) {
          const fim = new Date(data.horario_fim).getTime();
          const atualizarCalculo = () => {
            const agora = new Date().getTime();
            const diferenca = Math.floor((fim - agora) / 1000);
            setTempoRestante(diferenca);
          };
          atualizarCalculo();
          const timerId = setInterval(atualizarCalculo, 1000);
          return () => clearInterval(timerId);
        }
      }
    });
    return () => unsubscribe();
  }, [productName]);

  const jaSaiu = tempoRestante !== null && tempoRestante <= 0;

  useHighPerfTimer(timerDisplayRef, timerSrRef, tempoRestante !== null ? Math.abs(tempoRestante) : 0);
  useMagneticElement(ctaRef, 0.28);

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

  if (tempoRestante === null) return null;

  return (
    <div className={styles['rustica-fornada__border-wrapper']}>
      <article
        className={`${styles['rustica-fornada__container']} ${jaSaiu ? styles['is-hot'] : ''}`}
        ref={containerRef}
        aria-label={`Status da fornada de ${nomeExibicao}`}
      >
        <div className={styles['rustica-fornada__header']}>
          {/* A bolinha agora será vermelha via CSS */}
          <div className={styles['rustica-fornada__indicator']} aria-hidden="true">
            <span className={styles['rustica-fornada__pulse']} />
          </div>
          <span className={styles['rustica-fornada__title']}>
            {jaSaiu ? "Fornada Quentinha" : "Fornada ao Vivo"}
          </span>
        </div>

        <h4 className={styles['rustica-fornada__product']}>{nomeExibicao}</h4>

        <div className={styles['rustica-fornada__timer-box']}>
          <Clock size={16} strokeWidth={2.5} className={styles['rustica-fornada__icon']} aria-hidden="true" />
          <span className={styles['rustica-fornada__timer-text']}>
            {jaSaiu ? "O pão saiu há:" : "Saindo em:"}{' '}
            <strong
              ref={timerDisplayRef}
              className={styles['rustica-fornada__timer-digits']}
              aria-hidden="true"
            >
              00:00:00
            </strong>
          </span>
        </div>

        <span ref={timerSrRef} className={styles['rustica-fornada__sr-only']} aria-live="polite" />

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['rustica-fornada__cta']}
          ref={ctaRef}
        >
          <span className={styles['rustica-fornada__cta-icon']}>→</span>
          <span className={styles['rustica-fornada__cta-text']}>
            {jaSaiu ? "Garantir o meu agora" : "Reservar Unidade"}
          </span>
        </a>
      </article>
    </div>
  );
}