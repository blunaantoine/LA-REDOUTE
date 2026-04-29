import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LoadingBar from "@/components/ui/loading-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://laredoute.tg";
const SITE_NAME = "LA REDOUTE SARL-U";
const SITE_DESCRIPTION = "Distribution professionnelle de pneus, huiles moteurs et produits d'alimentation générale au Togo. Qualité, fiabilité et service exceptionnel.";

export const metadata: Metadata = {
  title: {
    default: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "LA REDOUTE",
    "distribution",
    "pneus",
    "huiles moteurs",
    "agroalimentaire",
    "Togo",
    "Lomé",
    "pneumatiques",
    "lubrifiants",
    "produits alimentaires",
    "SARL-U",
    "Afrique de l'Ouest",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "fr-TG": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-main.png",
  },
  openGraph: {
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_TG",
    type: "website",
    images: [
      {
        url: "/logo-main.png",
        width: 1200,
        height: 630,
        alt: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LA REDOUTE SARL-U - Distribution Professionnelle au Togo",
    description: SITE_DESCRIPTION,
    images: ["/logo-main.png"],
  },
  category: "business",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LA REDOUTE SARL-U",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-main.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2005",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue du Commerce, Lomé",
    addressLocality: "Lomé",
    addressRegion: "Maritime",
    postalCode: "BP 12345",
    addressCountry: "TG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+228-90-00-00-00",
    contactType: "customer service",
    availableLanguage: ["French", "English"],
    areaServed: "Togo",
  },
  sameAs: [],
};

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "LA REDOUTE SARL-U",
  image: `${SITE_URL}/logo-main.png`,
  url: SITE_URL,
  telephone: "+228-90-00-00-00",
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue du Commerce, Lomé",
    addressLocality: "Lomé",
    addressRegion: "Maritime",
    postalCode: "BP 12345",
    addressCountry: "TG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.1319,
    longitude: 1.2228,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "XOF",
  paymentAccepted: "Cash, Bank Transfer",
  areaServed: {
    "@type": "Country",
    name: "Togo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdLocalBusiness),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LoadingBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
