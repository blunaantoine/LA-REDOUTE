import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
  description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.",
  keywords: ["LA REDOUTE", "distribution", "pneus", "huiles moteurs", "agroalimentaire", "Togo", "Lomé"],
  authors: [{ name: "LA REDOUTE SARL-U" }],
  icons: {
    icon: "/logo-main.png",
  },
  openGraph: {
    title: "LA REDOUTE SARL-U",
    description: "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
