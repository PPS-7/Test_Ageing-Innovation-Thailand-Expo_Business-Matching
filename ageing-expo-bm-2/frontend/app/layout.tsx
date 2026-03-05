import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import NavBar from "@/components/NavBar";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Matching | Ageing Innovation Expo Thailand 2026",
  description:
    "Book on-site business matching sessions with 300+ exhibitors at Ageing Innovation Expo Thailand 2026 · 6–8 May 2026 · BITEC Bangna, Bangkok",
  metadataBase: new URL("https://match.ageinginnovationexpo.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSansThai.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-light-bg text-dark-slate min-h-screen">
        <LangProvider>
          <NavBar />
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
