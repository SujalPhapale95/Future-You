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
  title: "Future-You Contract App",
  description: "Make promises to your future self and keep them.",
  manifest: "/manifest.json",
};

import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20 md:pb-0`}
      >
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
