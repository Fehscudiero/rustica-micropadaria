import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Applies a subtle magnetic pull effect to an element.
 * Automatically disabled on touch devices via gsap.matchMedia.
 * @param {React.RefObject} ref - The ref to the element to magnetize.
 * @param {number} strength - How strong the pull is (0-1). Default: 0.3.
 */
export function useMagneticElement(ref, strength = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(hover: hover) and (pointer: fine)', () => {
      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.6,
          ease: 'power3.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        });
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => mm.revert();
  }, [ref, strength]);
}
