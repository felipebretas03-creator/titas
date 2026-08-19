import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tita's Core - Admin",
  description: "Painel Administrativo do Tita's Core",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#955251',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              padding: '16px',
            },
            className: 'font-bold shadow-lg',
          }} 
        />
      </body>
    </html>
  );
}
