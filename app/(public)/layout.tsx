import { Navbar } from "@/app/(public)/_components/navbar";
import { Footer } from "@/app/(public)/_components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default:
      "J.I.M. Modeling Agency - Thailand's Premier Modeling Agency Since 1984",
    template: "%s | J.I.M. Modeling Agency",
  },
  description:
    "Thailand's leading modeling agency with 40+ years of experience. Professional model representation, casting services, and international talent scouting. Connect with Thai and international models for fashion, TV, and media projects.",
  authors: [{ name: "J.I.M. Modeling Agency" }],
  creator: "J.I.M. Modeling Agency",
  publisher: "J.I.M. Modeling Agency",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://www.jimmodel.com"),
  alternates: {
    canonical: "https://www.jimmodel.com/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.jimmodel.com",
    title:
      "J.I.M. Modeling Agency - Thailand's Premier Modeling Agency Since 1984",
    description:
      "Thailand's leading modeling agency with 40+ years of experience. Professional model representation, casting services, and international talent scouting.",
    siteName: "J.I.M. Modeling Agency",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "J.I.M. Modeling Agency - Thailand's Premier Modeling Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "J.I.M. Modeling Agency - Thailand's Premier Modeling Agency Since 1984",
    description:
      "Thailand's leading modeling agency with 40+ years of experience. Professional model representation and international talent scouting.",
    images: ["/twitter-image.jpg"],
    creator: "@jim_model",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "business",
  classification: "Modeling Agency, Fashion, Entertainment",
  referrer: "origin-when-cross-origin",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
