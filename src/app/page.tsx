import Navbar from "@/components/navbar";
import { main } from "framer-motion/client";
import Image from "next/image";
import Hero from "./heroSection";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-[100vh] dark:bg-zinc-950">
          <Navbar />
          <main className="flex-1">
          <Hero />
    </main>
    </div>
  );
}
