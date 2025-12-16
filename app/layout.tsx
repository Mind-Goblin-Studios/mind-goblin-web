import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { wageFont } from "./fonts";
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
    siteName: "Mind Goblin",
    images: [
      {
        url: "https://mindgoblin.gg/og-image.png",
        width: 512,
        height: 512,
        alt: "Mind Goblin",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@mindgoblin_gg",
    title: "Mind Goblin",
    description: "Next level indie game development",
    images: ["https://mindgoblin.gg/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${wageFont.variable}`}>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
