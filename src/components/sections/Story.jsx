import React, { useEffect, useRef } from 'react';

function AnimatedStat({ value, animate, index }) {
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    if (!animate || !ref.current || observed.current) return;
    observed.current = true;

    const el = ref.current;
    const isPercent = value.includes('%');
    const suffix = isPercent ? '%' : 'h';
    const target = parseInt(value);
    
    el.textContent = (isPercent ? '0%' : '0h');
    el.style.willChange = 'transform, opacity';
    
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      
      el.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
      
      let start = null;
      const duration = 2200;
      
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3.5);
        const current = Math.round(eased * target);
        
        el.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.style.willChange = 'auto';
        }
      };
      
      setTimeout(() => requestAnimationFrame(step), index * 300);
      observer.disconnect();
    }, { threshold: 0.3 });
    
    observer.observe(el);
  }, [animate, value, index]);

  if (!animate) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref} style={{
      display: 'inline-block',
      transform: 'translateY(40px)',
      opacity: 0,
    }}>{value}</span>
  );
}

function TypedText({ text, animate }) {
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    if (!animate || !ref.current || observed.current) return;
    observed.current = true;

    const el = ref.current;
    const fullText = text;
    el.textContent = '';
    el.style.willChange = 'content';

    let i = 0;
    const speed = 18;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      const type = () => {
        if (i < fullText.length) {
          el.textContent += fullText.charAt(i);
          i++;
          setTimeout(type, speed + Math.random() * 20);
        } else {
          el.style.willChange = 'auto';
        }
      };
      
      setTimeout(type, 400);
      observer.disconnect();
    }, { threshold: 0.3 });
    
    observer.observe(el);
  }, [animate, text]);

  if (!animate) return <span>{text}</span>;

  return <span ref={ref} style={{ display: 'block', minHeight: '1em' }}>{text}</span>;
}

export default function Story({ content }) {
  const textData = typeof content.text === 'object' ? content.text : { text: content.text, animate: false };
  
  return (
    <section id="historia" className="section-pad">
      <div className="container story-grid">
        <div className="story-img reveal">
          <img src={content.image} alt={content.imageAlt} />
        </div>
        <div className="reveal">
          <p className="story-label">{content.label}</p>
          <h2
            className="story-title"
            dangerouslySetInnerHTML={{ __html: content.title.replace(' e ', '<br/>e ') }}
          />
          <p className="story-text">
            <TypedText text={textData.text} animate={textData.animate} />
          </p>
          <div className="stats-row">
            {content.stats.map((stat, i) => (
              <div key={i}>
                <div className="stat-value">
                  <AnimatedStat value={stat.value} animate={stat.animate} index={i} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
