import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://supplypilot-ops.openai.site"),
  title: "SupplyPilot — Inventory & Expense Operations",
  description:
    "A modern inventory, purchasing and expense management platform for small businesses.",
  keywords: [
    "inventory management",
    "purchase orders",
    "Spring Boot",
    "React",
    "PostgreSQL",
  ],
  authors: [{name: "Georgios Karamousalis", url: "https://gkaramou.github.io/"}],
  openGraph: {
    title: "SupplyPilot — Inventory. Purchasing. Control.",
    description:
      "A production-oriented operations platform built with React, Spring Boot and PostgreSQL.",
    url: "https://supplypilot-ops.openai.site",
    siteName: "SupplyPilot",
    images: [{url: "/og.png", width: 1200, height: 630, alt: "SupplyPilot operations dashboard"}],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SupplyPilot — Inventory. Purchasing. Control.",
    description: "Inventory, purchasing and expense operations in one focused workspace.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
