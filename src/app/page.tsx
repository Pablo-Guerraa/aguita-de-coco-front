import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { Products } from "@/components/sections/Products";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        <Introduction />
        <Products />
        {/*
          Future sections (to be implemented separately):
          - Por qué elegirla
          - Cómo disfrutarla
          - Dónde comprar / pedidos (#contacto)
        */}
      </main>
      {/* Footer (to be implemented separately) */}
    </>
  );
}
