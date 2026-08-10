"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle, Palmtree } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import { BUSINESS_NAME } from "@/config/business";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import type { FooterViewModel } from "@/lib/footer-service";

interface FooterContentProps {
  footer: FooterViewModel;
}

/** Extends CSSProperties so the `--stagger` custom property (consumed by
 * the `.footer-animate-item` animation-delay in globals.css) is type-safe. */
type StaggerStyle = CSSProperties & { "--stagger"?: number };

const linkHoverClass = "text-white/80 transition-colors hover:text-accent-lime";

export function FooterContent({ footer }: FooterContentProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className={`relative bg-text-primary text-white ${inView ? "footer-inview" : ""}`}
    >
      {/* Decorative "Coco" mascot peeking from the top edge — purely
          ornamental, kept out of the a11y tree and pointer events. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-6 z-10 w-28 -translate-y-full sm:right-12 sm:w-32 lg:right-20 lg:w-36"
      >
        <div className="footer-coco-mascot">
          <Image
            src="/fun-coco.png"
            alt=""
            width={256}
            height={256}
            className="h-auto w-full drop-shadow-xl"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-8">
          {/* Brand */}
          <div className="footer-animate-item" style={{ "--stagger": 0 } as StaggerStyle}>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-lime text-text-primary">
                <Palmtree className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">{BUSINESS_NAME}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{footer.tagline}</p>
          </div>

          {/* Navigation */}
          <div className="footer-animate-item" style={{ "--stagger": 1 } as StaggerStyle}>
            <h3 className="text-sm font-semibold tracking-wide text-white/50 uppercase">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footer.navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`text-sm ${linkHoverClass}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-animate-item" style={{ "--stagger": 2 } as StaggerStyle}>
            <h3 className="text-sm font-semibold tracking-wide text-white/50 uppercase">
              Contacto
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={footer.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-2 text-sm ${linkHoverClass}`}
                >
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-accent-lime"
                    aria-hidden="true"
                  />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={footer.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-2 text-sm ${linkHoverClass}`}
                >
                  <SiInstagram
                    className="h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-accent-lime"
                    aria-hidden="true"
                  />
                  {footer.contact.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={footer.contact.emailUrl}
                  className={`group flex items-center gap-2 text-sm ${linkHoverClass}`}
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-accent-lime"
                    aria-hidden="true"
                  />
                  {footer.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Wholesale access */}
          <div className="footer-animate-item" style={{ "--stagger": 3 } as StaggerStyle}>
            <h3 className="text-sm font-semibold tracking-wide text-white/50 uppercase">
              ¿Tienes un negocio?
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Lleva Aguita de Coco a tus clientes con precios especiales por volumen.
            </p>
            <a
              href={footer.wholesale.href}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-coconut-brown/60 px-4 py-2 text-sm font-semibold text-accent-lime transition-colors hover:border-accent-lime hover:bg-accent-lime hover:text-text-primary"
            >
              {footer.wholesale.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Legal bottom bar */}
        <div
          className="footer-animate-item mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{ "--stagger": 4 } as StaggerStyle}
        >
          <p className="text-xs text-white/50">
            © {currentYear} {footer.copyrightText}
          </p>
          <ul className="flex items-center gap-5">
            {footer.legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-xs text-white/50 transition-colors hover:text-accent-lime"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
