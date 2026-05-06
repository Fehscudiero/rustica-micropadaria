import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// ─── Telas ───────────────────────────────────────────────────
import PainelFornada from './pages/PainelFornada';

// ─── Dados — edite em src/data.js ────────────────────────────
import * as content from './data';

// ─── Layout ──────────────────────────────────────────────────
import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import Preloader    from './components/layout/Preloader';
import CustomCursor from './components/layout/CustomCursor';

// ─── Seções ──────────────────────────────────────────────────
import Hero        from './components/sections/Hero';
import { Marquee, Identity } from './components/sections/Identity';
import Story       from './components/sections/Story';
import Menu        from './components/sections/Menu';
import HowItWorks  from './components/sections/HowItWorks';
import Gallery     from './components/sections/Gallery';
import CTABanner   from './components/sections/CTABanner';

// ─── Hooks ───────────────────────────────────────────────────
import { useTilt } from './hooks/useTilt';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Componente Principal do Site (Sua Landing Page) ─────────
function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const appRef      = useRef(null);
  const trackRef    = useRef(null);
  const pinRef      = useRef(null);
  const heroAnimatedRef = useRef(false);
  const heroLogoRef   = useRef(null);
  const footerLogoRef = useRef(null);

  useTilt(heroLogoRef, 20);
  useTilt(footerLogoRef, 12);

  // Lenis smooth scroll (desktop only)
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    return () => lenis.destroy();
  }, []);

  // Intro Animation - with strict mode guard
  useEffect(() => {
    if (heroAnimatedRef.current) return;
    heroAnimatedRef.current = true;

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setLoaded(true);
      }
    });

    tl.to('.preloader-fill', { width: '100%', duration: 0.6, ease: 'power2.inOut' })
      .to('.preloader', { yPercent: -100, duration: 0.5, ease: 'power3.inOut', delay: 0.1 })
      .fromTo('.dynamic-shape', 
        { opacity: 0.5, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)' },
        '-=0.25'
      )
      .from('.hero-title', { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .from('.hero-sub, .hero-meta, .hero-ctas, .hero-logo-wrap', { 
        opacity: 0, 
        y: 15, 
        duration: 0.35, 
        stagger: 0.04,
        ease: 'power2.out' 
      }, '-=0.15');
    
    return () => {
      heroAnimatedRef.current = false;
    };
  }, []);

  // Navbar Scroll Logic
  useEffect(() => {
    const onScroll = () =>
      document.querySelector('.navbar')?.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={appRef}>
      <div className="dynamic-bg" aria-hidden="true">
        <div className="dynamic-shape dynamic-shape--1" />
        <div className="dynamic-shape dynamic-shape--2" />
        <div className="dynamic-shape dynamic-shape--3" />
        <div className="dynamic-shape dynamic-shape--4" />
        <div className="dynamic-shape dynamic-shape--5" />
      </div>

      <Preloader logo={content.navigation.logo} />

      <Navbar
        navigation={content.navigation}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main>
        <Hero
          content={content.heroContent}
          heroLogoRef={heroLogoRef}
          fornadaTracker={content.fornadaTracker}
        />

        <Marquee text={content.marqueeText} />

        <Identity phrase={content.identityPhrase} />

        <Story content={content.storyContent} />

        <Menu
          products={content.products}
          menuIntro={content.menuIntro}
          pinRef={pinRef}
          trackRef={trackRef}
        />

        <HowItWorks content={content.howItWorks} />

        <Gallery content={content.gallery} />

        <CTABanner content={content.ctaBanner} />
      </main>

      <Footer
        content={content.footerContent}
        footerLogoRef={footerLogoRef}
        navigationLogo={content.navigation.logo}
      />
    </div>
  );
}

// ─── Roteador Principal ──────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forno" element={<PainelFornada />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;