import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Menu({ products, menuIntro, pinRef, trackRef }) {
  const imageContainerRef = useRef(null);
  const currentImageRef = useRef(null);
  const imagesRef = useRef([]);
  const hasAnimated = useRef(false);
  const gsapCtxRef = useRef(null);
  
  const titleLines = menuIntro.title.split('\n');

  useEffect(() => {
    imagesRef.current = imagesRef.current.slice(0, products.length);
  }, [products]);

  useEffect(() => {
    if (!trackRef.current || !imageContainerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const imageContainer = imageContainerRef.current;
      const menuCards = track.querySelectorAll('.menu-card');
      
      if (menuCards.length === 0) return;

      gsap.set(imageContainer, { autoAlpha: 1 });

      const getCurrentIndex = () => {
        const trackRect = track.getBoundingClientRect();
        const trackStart = trackRect.left;
        const viewportWidth = window.innerWidth;
        
        const relativeScroll = -trackStart;
        const totalWidth = trackRect.width - viewportWidth + 20;
        
        let progress = Math.max(0, Math.min(1, relativeScroll / totalWidth));
        let index = Math.round(progress * (menuCards.length - 1));
        return Math.min(index, menuCards.length - 1);
      };

      const updateImage = () => {
        const index = getCurrentIndex();
        if (currentImageRef.current !== index) {
          currentImageRef.current = index;
          
          const imgs = imageContainer.querySelectorAll('.menu-preview-img');
          gsap.to(imgs, { autoAlpha: 0, duration: 0.15 });
          gsap.to(imgs[index], { autoAlpha: 1, duration: 0.15 });
        }
      };

      const st = ScrollTrigger.create({
        trigger: '#cardapio',
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        onUpdate: updateImage,
      });

      updateImage();

      return () => {
        st.kill();
      };
    }, imageContainerRef);

    gsapCtxRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, [products, trackRef]);

  return (
    <section id="cardapio" ref={pinRef} className="menu-pin-section">
      <div ref={imageContainerRef} className="menu-image-preview">
        {products.map((p, i) => (
          <img 
            key={p.id} 
            src={p.image} 
            alt={p.name} 
            className="menu-preview-img"
            ref={el => imagesRef.current[i] = el}
          />
        ))}
      </div>
      <div ref={trackRef} className="menu-scroll-track">
        <div className="menu-intro">
          <h2>
            {titleLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}{i < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p>{menuIntro.subtitle}</p>
        </div>
        {products.map(p => (
          <div key={p.id} className="menu-card">
            <div className="menu-card-img"><img src={p.image} alt={p.name} /></div>
            <div className="menu-card-body">
              <span className="menu-tag">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
