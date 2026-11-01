# loom. — Ghana, made good

A responsive Ghanaian fashion marketplace prototype with an editorial storefront and a sample merchant workspace.

## Site configuration

Shared brand, locale, currency and delivery values are defined in `src/config/site.ts`:

- Brand: **loom.** — Ghana, made good.
- Locale and language: `en-GH` / `en`.
- Currency and time zone: Ghana cedi (`GHS`) / `Africa/Accra`.
- Complimentary delivery threshold: GH₵500 in Accra; displayed coverage includes Accra, Kumasi and Cape Coast.
- Maker name: **Next Store**.
- SEO metadata, Open Graph and Twitter cards are configured in the root app layout.
- PWA metadata is available at `/manifest.webmanifest`; crawler rules and the sitemap are served from `/robots.txt` and `/sitemap.xml`.

Copy `.env.example` to `.env.local` for local overrides. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before deployment; the local default is `http://localhost:3000`. Update the delivery area, threshold, real maker details, product images, and copy in the site configuration and product data before launch.

## Neon PostgreSQL and maker workspace

The maker workspace uses Neon PostgreSQL through `@neondatabase/serverless` and Drizzle ORM when a database is configured. Without Neon, the dashboard displays static sample metrics and records so the mockup can be presented immediately; changes are not saved.

1. Create a Neon project and copy its pooled connection string into `DATABASE_URL` in `.env.local`.
2. Optionally set `DASHBOARD_STORE_SLUG=next-store` in `.env.local` to select a store.
3. Apply the checked-in SQL migrations with `npm run db:migrate`.
4. Load sample products, customers, orders and payment rows with `npm run db:seed`.
5. Open `/login`; **any non-empty access key** enters the presentation dashboard.

Dashboard routes: Overview, Orders, Products & stock, Customers, Insights, Payouts & transactions, and Store settings. Without `DATABASE_URL`, these screens use mock data and form submissions do not persist. With Neon configured, the data pages and server actions use the configured store. Payout requests are records only; they do not move money.

**Demo-only access:** the login accepts any non-empty key. This is not authentication and must not be used for real sellers, private customer data, payments, or production deployments. Before live commerce, replace it with authenticated accounts, role-based access control, per-user store membership checks, rate limits, verified payment-provider webhooks and database backups. Never use demo contacts or payment references for real customer data.

## Storefront mockup

The storefront includes working category and text filters, maker-city filtering, responsive navigation, and a shopping bag saved in browser local storage. The bag supports quantity changes and removal, and the checkout validates delivery details before showing a demo confirmation. Checkout does not submit personal details, create a database order, or collect payment. The studio journal has an index and individual story pages. Newsletter signup is also presentation-only.

## Run locally

Run `npm install`, then `npm run dev` and open http://localhost:3000.

Run `npm run build` for a production build and `npm run lint` for ESLint.

## Prototype scope

Product, maker, order, inventory and analytics data are demonstration content. The shopping bag is local to the browser and checkout is simulated. The dashboard is not connected to real-time storefront inventory, sales, authentication, shipping or payment services. Integrate and test those services before accepting transactions. Replace Unsplash demo photos with approved product photography and confirm all maker names, descriptions, prices, delivery rules, legal policies and contact information before launch.
