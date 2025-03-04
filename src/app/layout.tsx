import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexiStep - Optimise Ton Potentiel Mental",
  description: "Programme de 21 jours pour transformer ton cerveau et booster ta productivité",
  openGraph: {
    title: "LexiStep - Révolutionne Ta Concentration",
    description: "Méthode révolutionnaire pour optimiser ton cerveau en 21 jours",
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexiStep - Ta Transformation Mentale',
    description: 'Programme intensif de 21 jours pour réinventer ton potentiel',
    images: ['/twitter-image.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-yellow-300 text-black`}>
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '2px solid #FFD700',
              fontWeight: 'bold',
            },
          }}
        />
      </body>
    </html>
  );
}