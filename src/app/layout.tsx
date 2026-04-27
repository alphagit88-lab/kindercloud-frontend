import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SocketProvider } from "@/contexts/SocketContext";

export const metadata: Metadata = {
  title: "KinderCloud - Magical Preschool Management",
  description: "The all-in-one ecosystem for teachers, parents, and preschool administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans" suppressHydrationWarning>
        <AuthProvider>
          <SocketProvider>
            <CartProvider>{children}</CartProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
