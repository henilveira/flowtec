"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Logo from "@/components/logo";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function Finalizado() {
  const [confettiActive, setConfettiActive] = useState(true);
  const [numberOfPieces, setNumberOfPieces] = useState(200);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 1000,
  });

  useEffect(() => {
    // Atualiza as dimensões da janela
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Configura o listener de redimensionamento
    window.addEventListener("resize", handleResize);
    handleResize();

    // Gradualmente diminui o número de confetes
    const startTime = Date.now();
    const duration = 5000; // 5 segundos

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setNumberOfPieces(Math.max(0, Math.floor(200 * (1 - progress))));

      if (progress >= 1) {
        clearInterval(animationInterval);
        setConfettiActive(false);
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full items-start justify-center p-4 sm:p-8">
      {confettiActive && numberOfPieces > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={numberOfPieces}
          recycle={true}
          gravity={0.2}
          tweenDuration={100}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-full max-w-2xl space-y-8 sm:p-8"
      >
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold">Formulário de abertura</h2>
          <p className="mt-2 text-sm text-gray-600">
            Seu formulário foi enviado com sucesso!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
