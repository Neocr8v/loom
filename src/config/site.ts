export const siteConfig = {
  name: "loom.",
  shortName: "loom.",
  tagline: "Ghana, made good.",
  description:
    "Discover independent Ghanaian fashion labels, thoughtful design and the makers behind the work.",
  locale: "en-GH",
  language: "en",
  country: "GH",
  currency: "GHS",
  timeZone: "Africa/Accra",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  delivery: {
    freeThreshold: 500,
    primaryCity: "Accra",
    coverage: ["Accra", "Kumasi", "Cape Coast"],
  },
} as const;

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}
