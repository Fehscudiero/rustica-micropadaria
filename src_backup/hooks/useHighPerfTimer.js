import { useEffect } from 'react';

/**
 * High-performance timer that writes directly to a DOM ref.
 * Uses requestAnimationFrame — ZERO React re-renders.
 * Includes aria-live support via a separate hidden span for screen readers.
 *
 * @param {React.RefObject} displayRef - Ref to the visible <span> element.
 * @param {React.RefObject} srRef - Ref to the hidden aria-live <span> for screen readers.
 * @param {number} initialSeconds - Total seconds to count down from.
 */
export function useHighPerfTimer(displayRef, srRef, initialSeconds = 10050) {
  useEffect(() => {
    if (!displayRef.current) return;

    const endTime = Date.now() + initialSeconds * 1000;
    let rafId = null;
    let lastAnnounced = -1; // Only update aria-live every 60s to avoid spam

    const tick = () => {
      const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
      const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
      const s = (timeLeft % 60).toString().padStart(2, '0');
      const display = `${h}:${m}:${s}`;

      // Direct DOM write — bypasses React entirely
      if (displayRef.current) {
        displayRef.current.innerText = display;
      }

      // Update screen reader only every 60 seconds (minute boundary)
      const minutesLeft = Math.floor(timeLeft / 60);
      if (srRef.current && minutesLeft !== lastAnnounced) {
        lastAnnounced = minutesLeft;
        srRef.current.innerText = `Próxima fornada em ${minutesLeft} minutos.`;
      }

      if (timeLeft > 0) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [displayRef, srRef, initialSeconds]);
}
