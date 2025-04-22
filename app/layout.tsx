import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mind Goblin Studios | Indie Game Development",
  description: "Welcome to Mind Goblin Studios - Crafting unique gaming experiences through innovative indie game development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
