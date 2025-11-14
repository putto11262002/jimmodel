import { Navbar } from "@/app/(public)/_components/navbar";
import { Sora, Inter } from "next/font/google";

// Fashion-forward fonts for public site
const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sora.variable} ${inter.variable}`}>
      <Navbar />
      {children}
    </div>
  );
}
