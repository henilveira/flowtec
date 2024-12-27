"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { AuroraBackground } from "@/components/ui/aurora-background";
import FormularioAbertura from "./form";
import Logo from "@/components/logo";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-full max-w-2xl space-y-8 rounded-xl border backdrop-blur-sm sm:p-8"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Title and subtitle */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Formulário de abertura</h2>
          <p className="mt-2 text-sm text-gray-600">
            Insira seus dados para abrirmos sua empresa!
          </p>
        </div>

        {/* Form */}
        <FormularioAbertura />
      </motion.div>
    </div>
  );
}
