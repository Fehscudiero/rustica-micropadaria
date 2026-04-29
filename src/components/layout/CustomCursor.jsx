import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const follower = followerRef.current;
    if (!dot || !ring || !follower) return;

    let mouse = { x: -300, y: -300 };
    let dotPos  = { x: -300, y: -300 };
    let ringPos = { x: -300, y: -300 };
    let followerPos = { x: -300, y: -300 };
    let rafId;

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      dotPos.x  += (mouse.x - dotPos.x)  * 0.85;
      dotPos.y  += (mouse.y - dotPos.y)  * 0.85;
      followerPos.x += (mouse.x - followerPos.x) * 0.25;
      followerPos.y += (mouse.y - followerPos.y) * 0.25;

      dot.style.transform  = `translate(${dotPos.x}px,  ${dotPos.y}px)  translate(-50%, -50%)`;
      follower.style.transform = `translate(${followerPos.x}px, ${followerPos.y}px) translate(-50%, -50%)`;
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
      <div ref={followerRef} className="cursor-follower">🥐</div>
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}
