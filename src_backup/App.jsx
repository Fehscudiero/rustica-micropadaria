import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, MapPin, Clock, Camera, Mail, MessageCircle, Phone, ChevronRight } from 'lucide-react';
import './index.css';

import logo from './assets/logo.png';

import creatorsImg from './assets/creators.png';
import boloBananaImg from './assets/products/bolo-banana.png';
import paoCastanhasImg from './assets/products/pao-castanhas.png';
import croissantImg from './assets/products/croissant.png';
import pizzaImg from './assets/products/pizza.png';
import macaronsImg from './assets/products/macarons.png';
import vibe1 from './assets/vibe-1.png';
import vibe2 from './assets/vibe-2.png';
import vibe3 from './assets/vibe-3.png';

import FornadaTracker from './components/FornadaTracker/FornadaTracker';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 1, name: "Bolo de Banana com Nozes", desc: "Fofo, saboroso e perfeito para o café da manhã.", tag: "Todos os dias", img: boloBananaImg },
  { id: 2, name: "Pão de Castanhas", desc: "Rústico de fermentação natural, com caju, nozes e baru.", tag: "Sábados", img: paoCastanhasImg },
  { id: 3, name: "Croissant de Limão", desc: "Massa folhada leve com toque cítrico de torta de limão.", tag: "Diário", img: croissantImg },
  { id: 4, name: "Pizza Artesanal", desc: "Massa leve, fermentação natural e crocância irresistível.", tag: "Sex & Sáb", img: pizzaImg },
  { id: 5, name: "Macaron de Morango", desc: "Delicadeza francesa com morango fresco.", tag: "Sábados", img: macaronsImg },
];

const marqueeText = "Fermentação Natural • Feito à Mão • Sem Conservantes • Perdizes SP • Produção Limitada • Reservas Abertas • ";

// ═══ CUSTOM CURSOR — Elegant dot + soft ring ═══
// Minimal, on-brand (dark green / cream). Fluid lerp, no gimmicks.
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouse = { x: -300, y: -300 };
    let dotPos  = { x: -300, y: -300 };
    let ringPos = { x: -300, y: -300 };
    let rafId;

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      // Dot: fast (near-instant, feels precise)
      dotPos.x  += (mouse.x - dotPos.x)  * 0.85;
      dotPos.y  += (mouse.y - dotPos.y)  * 0.85;
      // Ring: slow lag (feels fluid and premium)
      ringPos.x += (mouse.x - ringPos.x) * 0.12;
      ringPos.y += (mouse.y - ringPos.y) * 0.12;

      dot.style.transform  = `translate(${dotPos.x}px,  ${dotPos.y}px)  translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const hoverTargets = document.querySelectorAll(
      'a, button, .menu-card, .mosaic-item, .social-icon'
    );
    const addHover    = () => ring.classList.add('cursor-ring--hover');
    const removeHover = () => ring.classList.remove('cursor-ring--hover');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      hoverTargets.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}

// ═══ 3D TILT ON CURSOR ═══
function useTilt(ref, intensity = 15) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.innerWidth < 769) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`;
    };
    const onLeave = () => { el.style.transform = 'rotateY(0deg) rotateX(0deg)'; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, intensity]);
}

// ═══ MAIN APP ═══
function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const appRef = useRef(null);
  const trackRef = useRef(null);
  const pinRef = useRef(null);
  const hasAnimated = useRef(false);
  const heroLogoRef = useRef(null);
  const footerLogoRef = useRef(null);

  useTilt(heroLogoRef, 20);
  useTilt(footerLogoRef, 12);

  // Lenis smooth scroll — desktop only.
  // On mobile, native momentum scroll is always superior; Lenis can cause jank.
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return; // Let the browser handle native scroll on mobile

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    return () => lenis.destroy();
  }, []);

  // Intro — ONCE only
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // ── Lock scroll immediately so the user can't wander while loading ──
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''; // Restore scroll after curtain
        setLoaded(true);
      }
    });

    // Loading bar
    tl.to('.preloader-fill', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
    // Logo pulse
    .fromTo('.preloader-logo', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }, 0.2)
    .from('.preloader-text', { opacity: 0, y: 10, duration: 0.6 }, 0.5)
    // Before curtain rises: snap scroll position to top (user may have scrolled)
    .add(() => { window.scrollTo({ top: 0, behavior: 'instant' }); })
    // Curtain up
    .to('.preloader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.3 })
    // Hero sequence
    .from('.hero-title-word', { y: 140, opacity: 0, rotationX: -40, stagger: 0.12, duration: 1.2, ease: 'power4.out' }, '-=0.4')
    .from('.hero-sub', { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-meta-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.5')
    .from('.hero-ctas', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-logo-wrap', { scale: 0.7, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1');
  }, []);

  // Scroll-triggered — after loaded
  useLayoutEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      // Reveals — run on all screen sizes (lightweight fade-ups)
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      const mm = gsap.matchMedia();

      // —— DESKTOP ONLY: heavy pinning + parallax ——
      // On mobile these create scroll jank and fight native rubber-band scroll.
      mm.add('(min-width: 769px)', () => {
        // Horizontal card scroll (pins the section)
        if (trackRef.current && pinRef.current) {
          const dist = trackRef.current.scrollWidth - window.innerWidth;
          gsap.to(trackRef.current, {
            x: -dist, ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current, pin: true, scrub: 1.5,
              start: 'top top', end: () => `+=${dist}`,
              invalidateOnRefresh: true,
            }
          });
        }

        // Hero logo parallax
        gsap.to('.hero-logo-wrap', {
          y: 120, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });

      // —— MOBILE: static stacked card list, no pinning ——
      mm.add('(max-width: 768px)', () => {
        // Cards simply fade in when they scroll into view
        if (trackRef.current) {
          const cards = trackRef.current.querySelectorAll('.menu-card');
          cards.forEach(card => {
            gsap.from(card, {
              y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%' }
            });
          });
        }
      });

      // Mosaic
      gsap.from('.mosaic-item', {
        y: 80, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.mosaic-grid', start: 'top 80%' }
      });

      // CTA
      gsap.from('.cta-banner', {
        y: 60, opacity: 0, scale: 0.96, duration: 1,
        scrollTrigger: { trigger: '.cta-banner', start: 'top 85%' }
      });

      // Footer logo entrance
      gsap.from('.footer-logo-big', {
        y: 100, opacity: 0, scale: 0.7, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-top', start: 'top 80%' }
      });
    }, appRef);
    return () => ctx.revert();
  }, [loaded]);

  // Navbar scroll class
  useEffect(() => {
    const onScroll = () => document.querySelector('.navbar')?.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={appRef}>
      <CustomCursor />

      {/* ═══ PRELOADER ═══ */}
      <div className="preloader">
        <div className="preloader-logo">
          <img src={logo} alt="Rústica" />
        </div>
        <div className="preloader-text">Micropadaria</div>
        <div className="preloader-bar"><div className="preloader-fill" /></div>
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className="navbar">
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            <img src={logo} alt="Rústica" />
          </a>
          <div className={`nav-links${menuOpen ? ' is-open' : ''}`}>
            <a href="#historia" className="nav-link" onClick={() => setMenuOpen(false)}>Nossa História</a>
            <a href="#cardapio" className="nav-link" onClick={() => setMenuOpen(false)}>Cardápio</a>
            <a href="#espaco" className="nav-link" onClick={() => setMenuOpen(false)}>Nosso Espaço</a>
            <a href="#como-funciona" className="nav-link" onClick={() => setMenuOpen(false)}>Como Funciona</a>
            <a href="https://wa.me/5511993968023" target="_blank" rel="noopener noreferrer" className="btn-cta" onClick={() => setMenuOpen(false)}>
              Fazer Pedido <ArrowRight size={16} />
            </a>
          </div>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <header className="hero">
        <div className="container hero-layout">
          <div>
            <h1 className="hero-title">
              <span className="hero-title-line"><span className="hero-title-word">Pão de</span></span>
              <span className="hero-title-line"><span className="hero-title-word">Verdade.</span></span>
            </h1>
            <p className="hero-sub">
              Micropadaria artesanal em Perdizes. Fermentação natural de 48h, 
              produção limitada e atenção a cada etapa do processo.
            </p>
            <div className="hero-meta">
              <div className="hero-meta-item">
                <div className="hero-meta-icon"><MapPin size={16} /></div>
                <span>Perdizes, São Paulo</span>
              </div>
              <div className="hero-meta-item">
                <div className="hero-meta-icon"><Clock size={16} /></div>
                <span>Qua–Sáb</span>
              </div>
            </div>
            <div className="hero-ctas">
              <a href="#cardapio" className="btn-cta">
                Ver Cardápio <ChevronRight size={16} />
              </a>
              <a href="https://wa.me/5511993968023" target="_blank" rel="noopener noreferrer"
                 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
            <div style={{ marginTop: '3rem' }}>
              <FornadaTracker productName="Pão de Castanhas" />
            </div>
          </div>

          <div className="hero-logo-wrap">
            <div className="hero-logo-inner" ref={heroLogoRef}>
              <img src={logo} alt="Rústica Micropadaria" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => <span key={i} className="marquee-item">{marqueeText}</span>)}
        </div>
      </div>

      {/* ═══ IDENTITY PHRASE ═══ */}
      <div className="identity-strip reveal">
        <p className="identity-phrase">
          Acreditamos que comer bem é um ato gentil — com o corpo, com o tempo e com quem faz.
        </p>
      </div>

      {/* ═══ STORY ═══ */}
      <section id="historia" className="section-pad">
        <div className="container story-grid">
          <div className="story-img reveal">
            <img src={creatorsImg} alt="Flávia e Helena na inauguração" />
          </div>
          <div className="reveal">
            <p className="story-label">Nossa Essência</p>
            <h2 className="story-title">Por @flaviaounada<br/>e @helena_doliveira</h2>
            <p className="story-text">
              A Rústica nasceu de uma ideia simples: pão de verdade, sem pressa e sem atalhos. 
              Fermentação natural de 48 horas, produção em lotes limitados e atenção a cada detalhe 
              do processo. Não é escala — é cuidado.
            </p>
            <div className="stats-row">
              <div><div className="stat-value">48h</div><div className="stat-label">Fermentação</div></div>
              <div><div className="stat-value">100%</div><div className="stat-label">Natural</div></div>
              <div><div className="stat-value">0</div><div className="stat-label">Conservantes</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HORIZONTAL MENU ═══ */}
      <section id="cardapio" ref={pinRef} className="menu-pin-section">
        <div ref={trackRef} className="menu-scroll-track">
          <div className="menu-intro">
            <h2>Nossa<br/>Fornada.</h2>
            <p>Produção limitada e respeito ao tempo de cada massa. Reserve pelo WhatsApp.</p>
          </div>
          {products.map(p => (
            <div key={p.id} className="menu-card">
              <div className="menu-card-img"><img src={p.img} alt={p.name} /></div>
              <div className="menu-card-body">
                <span className="menu-tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="como-funciona" className="section-pad">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <p className="story-label" style={{ textAlign: 'center' }}>Para Nossos Clientes</p>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', maxWidth: '600px', margin: '0 auto' }}>Como Funciona</h2>
          </div>
          <div className="how-grid">
            <div className="how-card reveal">
              <div className="how-num">01</div>
              <h3>Acompanhe no Instagram</h3>
              <p>Toda semana postamos as novidades da fornada. Fique de olho no @rustica.micropadaria.</p>
            </div>
            <div className="how-card reveal">
              <div className="how-num">02</div>
              <h3>Reserve pelo WhatsApp</h3>
              <p>Nossa produção é limitada. Mande uma mensagem pra garantir o seu antes que acabe.</p>
            </div>
            <div className="how-card reveal">
              <div className="how-num">03</div>
              <h3>Retire em Perdizes</h3>
              <p>Venha buscar fresquinho na Rua Caraíbas, 1282. Qua–Sex 10h–18h, Sáb 9h–14h.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section id="espaco" className="section-pad" style={{ background: 'var(--bg-warm)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="story-label" style={{ textAlign: 'center' }}>Nosso Espaço</p>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>A Vibe Rústica</h2>
          </div>
          <div className="mosaic-grid">
            <div className="mosaic-item m1"><img src={vibe1} alt="Clientes no balcão" /></div>
            <div className="mosaic-item m2"><img src={vibe2} alt="Bastidores" /></div>
            <div className="mosaic-item m3"><img src={vibe3} alt="Equipe" /></div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-pad">
        <div className="container">
          <div className="cta-banner">
            <h2>Quer garantir a fornada da semana?</h2>
            <a href="https://wa.me/5511993968023" target="_blank" rel="noopener noreferrer" className="btn-cta-light">
              <MessageCircle size={20} /> Reservar Agora
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo-big">
              <div className="footer-logo-inner" ref={footerLogoRef}>
                <img src={logo} alt="Rústica" />
              </div>
            </div>
            <p className="footer-tagline">Onde o tempo se transforma em pão de verdade.</p>
          </div>

          <div className="footer-grid">
            <div>
              <h4>Endereço</h4>
              <p>Rua Caraíbas, 1282<br/>Perdizes, São Paulo<br/>CEP 05020-000</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Rua+Caraíbas+1282+São+Paulo" 
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', opacity: 1, color: 'var(--accent)' }}>
                <MapPin size={14} /> Ver no Mapa
              </a>
            </div>
            <div>
              <h4>Horários</h4>
              <p>Quarta a Sexta<br/>10h — 18h</p>
              <p style={{ marginTop: '1rem' }}>Sábado<br/>09h — 14h</p>
            </div>
            <div>
              <h4>Fundadoras</h4>
              <p>@flaviaounada<br/>@helena_doliveira</p>
            </div>
            <div>
              <h4>Contato</h4>
              <div className="social-icons">
                <a href="https://instagram.com/rustica.micropadaria" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram"><Camera size={18} /></a>
                <a href="https://wa.me/5511993968023" target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp"><MessageCircle size={18} /></a>
                <a href="mailto:contato@rusticamicropadaria.com" className="social-icon" title="E-mail"><Mail size={18} /></a>
              </div>
              <a href="https://wa.me/5511993968023" target="_blank" rel="noopener noreferrer"
                 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem' }}>
                <Phone size={14} /> (11) 99396-8023
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Rústica Micropadaria</p>
            <p>Feito com 💚 por Flávia e Helena</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
