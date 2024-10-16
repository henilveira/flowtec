"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import GradientShimmerButton from "../components/ui/gradient-shimmer-button";
import ShimmerButton from "../components/ui/shimmer-button";
import Logo from "../components/logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAnimating(true);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  useEffect(() => {
    if (isMenuOpen) {
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-4 lg:mx-36 dark:text-white text-zinc-950 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavItem title="Produto" />
              <NavItem title="Empresa" />
              <NavItem title="Preços" />
              <NavItem title="Recursos" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link href='/login'>
                <Button variant="outline" className="text-gray-700">
                  Iniciar sessão
                </Button>
                <Button className="ml-3 bg-flowtech-gradient">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>
      <nav>
        <div
          className={`lg:hidden mt-4 flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`${
              isAnimating ? "animate-fadeDown animation-delay-400" : ""
            } space-y-2 mx-4 transition-all duration-500 pb-5`}
          >
            <div className="w-full flex items-center flex-col justify-center space-y-2">
              <NavItem title="Produto" />
              <NavItem title="Empresa" />
              <NavItem title="Preços" />
              <NavItem title="Recursos" />
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full" onClick={toggleMenu}>
                Iniciar sessão
              </Button>
            </Link>
            <Button
              className="bg-flowtech-gradient p-3 text-sm w-full"
              onClick={toggleMenu}
            >
              <span className="whitespace-pre-wrap text-center font-medium tracking-tight leading-none text-white">
                Comece agora
              </span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ title }: { title: string }) => (
  <div className="relative group">
    <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
      {title}
      <ChevronDown className="ml-1 h-4 w-4" />
    </button>
    {/* Dropdown menu can be added here if needed */}
  </div>
);

export default Navbar;
