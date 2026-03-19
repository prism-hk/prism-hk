import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/LanguageContext";
import Nav from "@/components/Nav";
import LangToggle from "@/components/LangToggle";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM — Hong Kong LGBTQ+ Directory 香港 LGBTQ+ 目錄",
  description:
    "Find LGBTQ+-friendly businesses, community groups, healthcare, NGOs, and events across all 18 districts of Hong Kong. 探索香港十八區的 LGBTQ+ 友善商戶、社區組織、醫療服務及活動。",
  openGraph: {
    title: "PRISM — Hong Kong LGBTQ+ Directory",
    description:
      "Find LGBTQ+-friendly businesses, community groups, healthcare, NGOs, and events across all 18 districts of Hong Kong.",
    type: "website",
    locale: "en_HK",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <Nav />
          <LangToggle />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
