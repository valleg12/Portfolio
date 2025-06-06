import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Victorien ALLEG - Portfolio",
  description: "Portfolio de Victorien ALLEG - Business Intelligence & Growth Analyst",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth w-screen min-h-screen bg-[#e8e8e0] dark:bg-[#1a2639] overflow-x-hidden" style={{ backgroundColor: '#e8e8e0', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-screen bg-[#e8e8e0] dark:bg-[#1a2639] overflow-x-hidden`}
        style={{ backgroundColor: '#e8e8e0', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}
      >
        {children}
      </body>
    </html>
  );
}
