import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { kanadaFont, wageFont } from "./fonts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mind Goblin",
  description: "Next level indie game development",
  metadataBase: new URL("https://mindgoblin.gg"),
  openGraph: {
    title: "Mind Goblin",
    description: "Next level indie game development",
    url: "https://mindgoblin.gg",
    siteName: "Mind Goblin Studios",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mind Goblin Studios",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind Goblin",
    description: "Next level indie game development",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth `}>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
