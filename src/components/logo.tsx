import { div } from 'framer-motion/client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

interface FlowTechLogoProps {
  width?: number
  height?: number
}

export default function FlowTechLogo({ width = 150, height = 60 }: FlowTechLogoProps = {}) {
    
  return (
    <div>
        <Link href='/'>
            <Image 
              src='/logo.svg'
              width={100}
              height={100}
              alt='Logo'
            />
        </Link>
    </div>
  )
}