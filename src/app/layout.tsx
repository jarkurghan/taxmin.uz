import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taxminlar Ligasi — FIFA 2026",
  description: "FIFA Jahon chempionati 2026 o'yinlari uchun taxmin qiling va do'stlaringiz bilan raqobatlashing!",
  openGraph: {
    title: "Taxminlar Ligasi — FIFA 2026",
    description: "Taxminingizni biling va reyting yuqoriga ko'taring!",
    url: "https://taxmin.uz",
    siteName: "Taxminlar Ligasi",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
