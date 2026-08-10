import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        {/*
          Future sections (to be implemented separately):
          - Introducción       (#sobre-nosotros)
          - Productos y sabores (#nuestros-productos)
          - Por qué elegirla
          - Cómo disfrutarla
          - Dónde comprar / pedidos (#contacto)
        */}
      </main>
      {/* Footer (to be implemented separately) */}
    </>
  );
}
