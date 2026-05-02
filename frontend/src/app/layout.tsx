import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food4Recovery",
  description: "Digitale Orientierung für Recovery-Ernährung, Rezepte und Tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
