import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { Products } from "@/components/sections/Products";
import { Moments } from "@/components/sections/Moments";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        <Introduction />
        <Products />
        <Moments />
        {/*
          Future sections (to be implemented separately):
          - Por qué elegirla
          - Dónde comprar / pedidos (#contacto)
        */}
      </main>
      {/* Footer (to be implemented separately) */}
    </>
  );
}
