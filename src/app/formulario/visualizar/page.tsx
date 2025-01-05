"use client";

import { motion } from "framer-motion";
import FormularioAbertura from "./form";
import Logo from "@/components/logo";

export default function Visualizar() {
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
        className="w-full max-w-2xl space-y-8 sm:p-8"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Title and subtitle */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Visualizando formulário</h2>
          <p className="mt-2 text-sm text-gray-600">
            Verifique se seu cliente preencheu com as informações corretas.
          </p>
        </div>

        {/* Form */}
        <FormularioAbertura />
      </motion.div>
    </div>
  );
}
