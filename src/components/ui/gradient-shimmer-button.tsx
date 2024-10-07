import React from 'react'
import { motion } from 'framer-motion'

interface SimpleGradientButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function SimpleGradientButton({
  children,
  onClick,
  className = '',
}: SimpleGradientButtonProps) {
  return (
    <motion.button
      className={`relative overflow-hidden rounded-xl h-14 w-52 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #007bff, #00d084, #007bff)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['100% 0%', '0% 0%', '100% 0%'],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <span className="relative z-10 text-center font-medium text-base text-white">
        {children}
      </span>
    </motion.button>
  )
}