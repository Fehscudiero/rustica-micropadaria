import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './FornadaTracker.module.css';
import { useHighPerfTimer } from '../../hooks/useHighPerfTimer';
import { useMagneticElement } from '../../hooks/useMagneticElement';
import { Clock } from 'lucide-react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Mantemos o productName como um fallback (valor padrão)
export default function FornadaTracker({ productName = "Pão de Castanhas", whatsapp = "https://wa.me/5511993968023" }) {
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const timerDisplayRef = useRef(null);
  const timerSrRef = useRef(null);

  const [tempoRestante, setTempoRestante] = useState(0);
  
  // NOVO: Estado para armazenar o nome que vem do Firebase
  const [nomeExibicao, setNomeExibicao] = useState(productName);

  useEffect(() => {
    const q = query(collection(db, 'fornada'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        
        // 1. Atualiza o Título vindo do Banco
        // Se houver um título no banco, usamos ele. Se não, usamos a prop inicial.
        if (data.titulo) {
          setNomeExibicao(data.titulo);
        } else {
          setNomeExibicao(productName);
        }

        // 2. Atualiza o Tempo
        if (data.horario_fim) {
          const fim = new Date(data.horario_fim).getTime();
          const agora = new Date().getTime();
          const diferencaSegundos = Math.max(0, Math.floor((fim - agora) / 1000));
          setTempoRestante(diferencaSegundos);
        }
      }
    });

    return () => unsubscribe();
  }, [productName]); // Adicionado productName como dependência por boa prática

  useHighPerfTimer(timerDisplayRef, timerSrRef, tempoRestante);
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

  if (tempoRestante === 0) return null;

  return (
    <article
      className={styles['rustica-fornada__container']}
      ref={containerRef}
      aria-label={`Status ao vivo da fornada de ${nomeExibicao}`}
    >
      <div className={styles['rustica-fornada__header']}>
        <div className={styles['rustica-fornada__indicator']} aria-hidden="true">
          <span className={styles['rustica-fornada__pulse']} />
        </div>
        <span className={styles['rustica-fornada__title']}>Fornada ao Vivo</span>
      </div>

      {/* AGORA USA O ESTADO DINÂMICO */}
      <h4 className={styles['rustica-fornada__product']}>{nomeExibicao}</h4>

      <div className={styles['rustica-fornada__timer-box']}>
        <Clock size={16} strokeWidth={2.5} className={styles['rustica-fornada__icon']} aria-hidden="true" />
        <span className={styles['rustica-fornada__timer-text']}>
          Saindo em:{' '}
          <strong
            ref={timerDisplayRef}
            className={styles['rustica-fornada__timer-digits']}
            aria-hidden="true"
          >
            --:--:--
          </strong>
        </span>
      </div>

      <span
        ref={timerSrRef}
        className={styles['rustica-fornada__sr-only']}
        aria-live="polite"
        aria-atomic="true"
      />

      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['rustica-fornada__cta']}
        ref={ctaRef}
        aria-label={`Reservar ${nomeExibicao} via WhatsApp`}
      >
        <span aria-hidden="true" className={styles['rustica-fornada__cta-icon']}>→</span>
        <span className={styles['rustica-fornada__cta-text']}>Reservar Unidade</span>
      </a>
    </article>
  );
}