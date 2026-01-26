# Phase 2: Frontend Migration & Product Display (Demo Ready)
**Timeline:** February 2, 2026 – February 15, 2026
**Status:** Pending
**Goal:** Create a visually impressive, read-only version of the e-commerce site using Next.js, populated with real data from the Phase 1 backend. This is the "Pitch Deck" version.

## 1. Objectives
*   Initialize Next.js application.
*   Migrate existing HTML/CSS design into React Components.
*   Connect Frontend to Strapi API.
*   Implement Dynamic Routing for Products and Artisans.
*   Deploy to a public URL (Vercel).

## 2. Technical Architecture
*   **Framework:** Next.js 14+ (App Router recommended).
*   **Language:** TypeScript (Strict mode).
*   **Styling:** 
    *   *Strategy:* Component-Level CSS or CSS Modules.
    *   *Action:* We will refactor the existing `style.css` into modular CSS files where possible, or keep a global stylesheet for the layout and use Modules for components to ensure speed of migration.
*   **Deployment:** Vercel.

## 3. Detailed Steps

### Step 3.1: Project Setup
1.  Run `npx create-next-app@latest frontend`.
2.  Configure `next.config.js` to allow images from the Cloudinary domain.
3.  Set up environment variables: `NEXT_PUBLIC_STRAPI_API_URL`.

### Step 3.2: Component Architecture & Migration
We will break down the `index.html` and other pages into these reusable components:

*   **Layout:**
    *   `Navbar` (Logo, Links, Cart Icon).
    *   `Footer` (Links, Newsletter, Copyright).
*   **Common:**
    *   `HeroSection` (Big image, Headline, CTA).
    *   `SectionTitle` (Styling for headers).
    *   `Button` (Primary, Secondary, Outline).
*   **Commerce:**
    *   `ProductCard` (Image, Name, Price, Artisan Name, Link).
    *   `ProductGrid` (Layout container for cards).
    *   `ArtisanCard` (Image, Name, Location).
*   **Content:**
    *   `StoryBlock` (Image + Text layout for "Journal" entries).

### Step 3.3: Page Implementation
1.  **Home (`/`):**
    *   Fetch "Featured" products from Strapi.
    *   Fetch a list of Artisans.
    *   Reconstruct the homepage layout using components.
2.  **Shop (`/shop`):**
    *   Fetch *all* products.
    *   Implement basic filtering by Category (Client-side filtering for MVP is faster).
3.  **Product Detail (`/products/[slug]`):**
    *   Use `generateStaticParams` (SSG) to pre-build pages for all products.
    *   Fetch detailed product data.
    *   Display: Large gallery, Description, Artisan info, "Add to Cart" button (disabled or dummy for now).
4.  **Artisan Detail (`/artisans/[slug]`):**
    *   Fetch Artisan profile and their specific products.
    *   Display their Story and Bio.
5.  **Static Pages:**
    *   Migrate `about.html`, `contact.html` to Next.js pages.

### Step 3.4: Data Fetching Layer
*   Create a `lib/api.ts` file.
*   Implement functions:
    *   `getProducts()`
    *   `getProductBySlug(slug)`
    *   `getArtisans()`
    *   `getArtisanBySlug(slug)`
*   Ensure error handling (e.g., if API is down, show a graceful error or fallback).

### Step 3.5: Visual Polish
*   Ensure the design matches the original aesthetic (Font adjustments, Spacing).
*   Implement a "Loading" state (Skeleton screens) while data is being fetched (if using Client Components) or enjoy the speed of Server Components.
*   **Responsiveness:** Check mobile view on valid devices.

## 4. Deliverables for Phase 2
*   [ ] GitHub Repository for Frontend (`seereh-web`).
*   [ ] Live Demo URL (e.g., `https://seereh-demo.vercel.app`).
*   [ ] Functional navigation between Home -> Shop -> Product.
*   [ ] Accurate display of data managed in Strapi.
*   [ ] "Add to Cart" button exists (visual only).
