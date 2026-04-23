import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "@/app/globals.css";
import { APP_NAME } from "@/lib/constants";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Portal de empleos para Andres Merino"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <header className="site-header">
          <div className="container site-header-inner">
            <Link className="brand" href="/">
              Andres Merino
            </Link>
            <nav className="top-nav" aria-label="Principal">
              <Link href="/">Inicio</Link>
              <Link href="/empleos">Empleos</Link>
              <Link href="/#contacto">Contacto</Link>
              <Link className="admin-link" href="/admin/login">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer id="contacto" className="site-footer">
          <div className="container footer-grid">
            <div>
              <p className="eyebrow">Contacto</p>
              <p>talento@andresmerino.com</p>
              <p>+54 261 555 0000</p>
            </div>
            <div>
              <p className="eyebrow">Ubicacion</p>
              <p>Mendoza, Argentina</p>
            </div>
            <div>
              <p className="eyebrow">Portal de Empleo</p>
              <p>Desarrollado con Next.js + Supabase</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
