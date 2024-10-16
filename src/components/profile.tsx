"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import Logout from "./ui/logout";
import ProfileAvatar from "./avatar";

export default function Profile() {
  const { primeiroNome, ultimoNome, email } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center hover:bg-white dark:bg-zinc-950 p-2 space-x-2 rounded-md duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ProfileAvatar className="w-10 h-10" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <div className="rounded-md shadow-sm bg-white border border-gray-200">
              <div className="p-4 flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                <ProfileAvatar />
                <div>
                  <h3 className="font-semibold text-gray-800">{`${primeiroNome} ${ultimoNome}`}</h3>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
                <Logout />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
