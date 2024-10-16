'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FlowTechLogoProps {
  width?: number;
  height?: number;
}

export default function FlowTechLogo({ width = 150, height = 60 }: FlowTechLogoProps = {}) {
  const [isClient, setIsClient] = useState(false);

  // Verifica se está no lado do cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Só renderiza o conteúdo se estiver no lado do cliente
  if (!isClient) {
    return null;
  }

  return (
    <div>
      <Link href='/'>
        <Image 
          src='/logo.svg'
          width={125}
          height={100}
          alt='Logo'
        />
      </Link>
    </div>
  );
}
