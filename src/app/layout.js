import { Geist, Geist_Mono, Pinyon_Script, Mr_De_Haviland, Anton, Bebas_Neue } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/Providers/NextAuthSessionProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeProvider";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  weight: "400",
});

const mrDeHaviland = Mr_De_Haviland({
  variable: "--font-mr-de-haviland",
  subsets: ["latin"],
  weight: "400",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Swap Skill",
  description: "Learn new skills, share your expertise, and earn while teaching others.",
  icons: {
    icon: "/logo1.png",
  },
};

import React, { Suspense } from "react";
import Loading from "./loading";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo1.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} ${mrDeHaviland.variable} ${anton.variable} ${bebasNeue.variable} antialiased`}
      >
        <NextAuthSessionProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Toaster position="top-right" />
            </NotificationProvider>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
