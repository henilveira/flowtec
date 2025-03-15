// components/LoadingSlider.tsx
import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const LoadingSlider: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicia o carregamento quando a rota muda
    setLoading(true);
    setProgress(0);
    
    let timer: NodeJS.Timeout;
    
    // Inicia o progresso gradualmente
    timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Acelera no início e desacelera próximo do final
        const diff = Math.random() * 10;
        const newProgress = Math.min(oldProgress + diff, 90);
        return newProgress;
      });
    }, 100);
    
    // Completa o carregamento após um curto atraso
    const completeTimer = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      
      // Esconde o componente após completar o carregamento
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }, 500); // Ajuste esse tempo conforme necessário

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]); // Reage a mudanças na URL

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'transparent',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#2563eb', // Azul
              transition: 'width 0.2s ease-in-out',
              boxShadow: '0 0 8px rgba(37, 99, 235, 0.7)',
            }}
          />
        </div>
      )}
    </>
  );
};

export default LoadingSlider;