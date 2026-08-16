import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Tashrif } from "tashrif/react";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

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
      <body className={`${inter.variable} ${oswald.variable} font-sans`}>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <Tashrif clientId={process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID!} />
        {children}
      </body>
    </html>
  );
}
