import { Inter } from "next/font/google";
import "./globals.css";

import { Playfair_Display, Sora } from "next/font/google";

// Fashion-forward fonts for public site
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
