import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardinal",
  description:
    "Understand your money, learn the basics, explore investing, and plan what comes next.",
  applicationName: "Cardinal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#181818",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} dark min-h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
