import { div } from 'framer-motion/client'
import Link from 'next/link'
import React from 'react'

interface FlowTechLogoProps {
  width?: number
  height?: number
}

export default function FlowTechLogo({ width = 200, height = 60 }: FlowTechLogoProps = {}) {
    
  return (
    <div>
        <Link href='/'>
            <svg
            width={width}
            height={height}
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <rect width="200" height="60" />
            
            {/* Símbolo representando fluxo de dados e IA */}
            <g transform="translate(10, 15)">
                <path d="M0 15 L15 0 L30 15 L45 0" stroke="#007bff" strokeWidth="3" />
                <path d="M0 30 L15 15 L30 30 L45 15" stroke="#00d084" strokeWidth="3" />
                <circle cx="0" cy="15" r="3" fill="#007bff" />
                <circle cx="15" cy="0" r="3" fill="#007bff" />
                <circle cx="30" cy="15" r="3" fill="#007bff" />
                <circle cx="45" cy="0" r="3" fill="#007bff" />
                <circle cx="0" cy="30" r="3" fill="#00d084" />
                <circle cx="15" cy="15" r="3" fill="#00d084" />
                <circle cx="30" cy="30" r="3" fill="#00d084" />
                <circle cx="45" cy="15" r="3" fill="#00d084" />
            </g>
            
            {/* Texto "Flow" */}
            <text
                x="70"
                y="38"
                fontFamily="Arial, sans-serif"
                fontSize="28"
                fontWeight="bold"
                fill="#007bff"
                >
                Flow
            </text>
            
            {/* Texto "Tech" */}
            <text
                x="135"
                y="38"
                fontFamily="Arial, sans-serif"
                fontSize="28"
                fontWeight="bold"
                fill="#00d084"
                >
                Tech
            </text>
            </svg>
        </Link>
    </div>
  )
}