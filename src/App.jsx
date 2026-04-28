import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

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

function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const appRef      = useRef(null);
  const trackRef    = useRef(null);
  const pinRef      = useRef(null);
  const hasAnimated = useRef(false);
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

  // Intro Animation
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setLoaded(true);
      }
    });

    tl.to('.preloader-fill', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
      .fromTo('.preloader-logo', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }, 0.2)
      .from('.preloader-text', { opacity: 0, y: 10, duration: 0.6 }, 0.5)
      .add(() => { window.scrollTo({ top: 0, behavior: 'instant' }); })
      .to('.preloader', { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: 0.3 })
      .from('.hero-title-word', { y: 140, opacity: 0, rotationX: -40, stagger: 0.12, duration: 1.2, ease: 'power4.out' }, '-=0.4')
      .from('.hero-sub', { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-meta-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.5')
      .from('.hero-ctas', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-logo-wrap', { scale: 0.7, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1');
  }, []);

  // Scroll Animations
  useLayoutEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {

      // Reveal items on scroll
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      const mm = gsap.matchMedia();

      // Desktop: Horizontal Scroll + Parallax
      mm.add('(min-width: 769px)', () => {
        if (trackRef.current && pinRef.current) {
          const dist = trackRef.current.scrollWidth - window.innerWidth;
          gsap.to(trackRef.current, {
            x: -dist,
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              scrub: 1.5,
              start: 'top top',
              end: () => `+=${dist}`,
              invalidateOnRefresh: true,
            }
          });
        }

        gsap.to('.hero-logo-wrap', {
          y: 120,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });

      // Mobile: Simple Reveals
      mm.add('(max-width: 768px)', () => {
        if (trackRef.current) {
          const cards = trackRef.current.querySelectorAll('.menu-card');
          cards.forEach(card => {
            gsap.from(card, {
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%' }
            });
          });
        }
      });

      // Gallery Entrance
      gsap.from('.mosaic-item', {
        y: 80, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.mosaic-grid', start: 'top 80%' }
      });

      // Footer Logo Entrance
      gsap.from('.footer-logo-big', {
        y: 100, opacity: 0, scale: 0.7, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-top', start: 'top 80%' }
      });

      // Dynamic background shapes - optimized with will-change and GPU
      const shapes = gsap.utils.toArray('.dynamic-shape');
      
      // Check for reduced motion preference
      const MotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (MotionPreference.matches) return;

      // Desktop only entrance animation - mobile uses CSS only
      if (window.innerWidth >= 769) {
        shapes.forEach((shape, i) => {
          gsap.fromTo(shape, 
            { scale: 0.3, opacity: 0 },
            { 
              scale: 1,
              opacity: 0.5,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: shape,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        // Minimal parallax - only on desktop with proper GPU
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            y: (i % 2 === 0 ? -1 : 1) * (50 + i * 20),
            ease: 'none',
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            }
          });
        });
      }

    }, appRef);
    return () => ctx.revert();
  }, [loaded]);

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

      <CustomCursor />

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

export default App;
