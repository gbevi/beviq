import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Doto,
  Bricolage_Grotesque,
  Familjen_Grotesk,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Preloader } from "@/components/preloader";
import { Nav } from "@/components/nav";
import "./globals.css";

const jet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin"],
  display: "swap",
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "beviq · sistemas e agentes",
  description:
    "Sistemas e agentes feitos à mão. Engenharia e opinião contra o digital genérico da era agêntica, pensados pra durar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${jet.variable} ${doto.variable} ${bricolage.variable} ${familjen.variable}`}
    >
      <body className="min-h-dvh">
        <Preloader />
        <Nav />
        <main className="relative">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
