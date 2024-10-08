import Navbar from "./navbar";
import Hero from "./heroSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}