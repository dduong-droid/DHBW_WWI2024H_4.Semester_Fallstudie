import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Food 4 Recovery',
  description: 'Optimiere deine Wundheilung durch klinisch erprobte Ernährung.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
