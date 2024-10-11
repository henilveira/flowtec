'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function NavItem({
  href,
  label,
  text,
  children
}: {
  href: string
  text: string
  label: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(pathname === href)
  }, [pathname, href])

  return (
    <Link href={href} className="w-full block relative">
      <div
        className={clsx(
          'flex items-center p-2 rounded-xl  transition-colors hover:text-flowtech-blue relative',
          {
            'text-blue-600 font-medium': isActive,
          }
        )}
      >
        {/* Animated background */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-flowtech-gradient-transparent rounded-xl"
            layoutId="activeNavBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Icon with fixed size, centered vertically */}
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center relative z-10">
          {children}
        </div>

        {/* Text with fixed width, ellipsis for overflow, no wrapping, and centered vertically */}
        <span className="ml-3 w-36 truncate whitespace-nowrap flex items-center relative z-10">{text}</span>
      </div>
    </Link>
  )
}