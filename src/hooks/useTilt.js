import { useEffect } from 'react';

export function useTilt(ref, intensity = 15) {
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
