import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import React from 'react';
import { Navbar } from '../components/Navbar';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Cal Check',
  description: 'Minimal goal tracking calendar'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}> 
      <body className="min-h-screen antialiased">
        <Navbar />
        <main className="pt-28">{children}</main>
      </body>
    </html>
  );
}
