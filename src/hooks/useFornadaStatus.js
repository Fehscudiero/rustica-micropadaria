import { useEffect, useRef } from 'react';

export function useFornadaStatus(initialSeconds = 10050) { // 2h47m30s
  const timerRef = useRef(null);
  const timeEndRef = useRef(Date.now() + initialSeconds * 1000);
  const reqRef = useRef(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((timeEndRef.current - now) / 1000));

      if (timerRef.current) {
        const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
        const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        
        const newText = `${h}:${m}:${s}`;
        if (timerRef.current.innerText !== newText) {
          timerRef.current.innerText = newText;
        }
      }

      if (timeLeft > 0) {
        reqRef.current = requestAnimationFrame(updateTimer);
      }
    };

    reqRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return {
    status: 'saindo', // Lógica futura de estado
    unitsLeft: 3,
    timerRef // Ref que será injetada diretamente no elemento span do DOM
  };
}
