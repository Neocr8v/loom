import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { StorefrontCartProvider } from "@/app/storefront/cart";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "shopping",
  keywords: [
    "Ghanaian fashion",
    "Ghana designers",
    "independent fashion labels",
    "made in Ghana",
    "African fashion marketplace",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.language} data-scroll-behavior="smooth">
      <body><StorefrontCartProvider>{children}</StorefrontCartProvider></body>
    </html>
  );
}
