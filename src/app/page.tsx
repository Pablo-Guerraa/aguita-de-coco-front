import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { Products } from "@/components/sections/Products";
import { Moments } from "@/components/sections/Moments";
import { WhereToBuy } from "@/components/sections/WhereToBuy";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        <Introduction />
        <Products />
        <Moments />
        <WhereToBuy />
        {/*
          Future sections (to be implemented separately):
          - Por qué elegirla
        */}
      </main>
      <Footer />
    </>
  );
}
