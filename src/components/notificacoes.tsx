"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: number
  message: string
  read: boolean
}

export default function NotificationIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "A primeira etapa da Flowtec vai expirar em 1 dia!", read: false },
  ])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <Button
        variant="outline"
        className="relative p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <div className="p-4 rounded-md shadow-sm bg-white border border-gray-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notificações</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={markAllAsRead}
                  >
                    Marcar como lido
                  </Button>
                )}
              </div>
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`p-2 rounded-md ${notification.read ? 'bg-gray-50' : 'bg-blue-50'} hover:bg-gray-100 transition-colors duration-200 cursor-pointer`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-gray-800">{notification.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma nova notificação</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}