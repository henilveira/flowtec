"use client";
import { Button } from "@/components/ui/button";
import GradientShimmerButton from "@/components/ui/gradient-shimmer-button";
import ShineBorder from "@/components/ui/shine-border";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative dark:bg-zinc-950 dark:text-white text-neutral-800 pt-6 md:pt-12 lg:pt-24 overflow-hidden">
      <div className="relative flex h-full w-full items-center flex-col justify-center overflow-hidden bg-background p-20 space-y-6">
        <div className="justify-center flex flex-col items-center space-y-7 text-center">
          <h1 className="font-bold text-6xl w-[800px] relative">
            Simplifique seus processos societários com
            <span className="ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
              FlowTech
            </span>
            {/* Imagem como "underscore" logo abaixo */}
            <div className="absolute inset-x-0 flex justify-center">
              <Image
                src="/path-header.svg"
                height={30} // Ajuste a altura conforme necessário
                width={350} // Ajuste a largura conforme necessário5
                alt="path"
                className="right-1 absolute z-10"
              />
            </div>
          </h1>
          <p className="text-muted-foreground w-[700px]">
            Simplifique a abertura e gestão de empresas em uma plataforma
            completa, transformando a gestão societária com controle total e
            praticidade.
          </p>
        </div>
        <div className="space-x-4">
          <GradientShimmerButton>Começar agora</GradientShimmerButton>
          <Button variant="outline" className="h-14 w-52 text-base rounded-xl">
            Ver mais
          </Button>
        </div>
        <div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 rounded-3xl transform rotate-2 scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded-3xl transform -rotate-2 scale-105"></div>
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
              <Image
                src="/societario.svg"
                alt="FlowTech Dashboard"
                width={1100}
                height={800}
                className="w-full h-auto"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
