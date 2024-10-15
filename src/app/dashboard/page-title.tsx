import React from "react";

interface TitleProps {
  titulo: string;
  children?: React.ReactNode; // Os botões opcionais ou outros elementos que você quiser passar
}

export default function Title({ titulo, children }: TitleProps) {
  return (
    <div className="flex items-center justify-between bg-background border-b p-4">
      {/* Título à esquerda */}
      <h1 className="text-3xl font-semibold">{titulo}</h1>
      
      {/* Espaço para os botões (se houver algum) */}
      {children && (
        <div className="flex space-x-3 items-center">
          {children}
        </div>
      )}
    </div>
  );
}
