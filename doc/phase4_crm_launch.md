# Phase 4: CRM, Advanced Features & Deployment
**Timeline:** March 9, 2026 – March 29, 2026
**Status:** Pending
**Goal:** Integrate business intelligence tools, polish the experience, and launch the platform to the public.

## 1. Objectives
*   Connect HubSpot CRM.
*   Implement Vendor Dashboard (Simplified view).
*   SEO & Performance Optimization.
*   Final QA and Testing.
*   Production Deployment.

## 2. Technical Architecture
*   **CRM:** HubSpot (Free Tier).
*   **Analytics:** Google Analytics 4 (GA4) or plausible.io (privacy-focused).
*   **Hosting:** Vercel (Production) + DigitalOcean (Production DB/Strapi).

## 3. Detailed Steps

### Step 3.1: HubSpot Integration
1.  **Setup:** Create HubSpot account and generate a Private App Access Token.
2.  **Logic (Backend):**
    *   In the Order Creation logic (Phase 3 Webhook or Controller):
    *   Call HubSpot API to `Create or Update Contact` (by email).
    *   Add properties: `Last Order Date`, `Total Spent`, `Customer Type` (e.g., "Buyer").
    *   Create a `Deal` in HubSpot associated with the Contact to track revenue pipeline.

### Step 3.2: Analytics & SEO
1.  **Metadata:**
    *   Use Next.js Metadata API to ensure every page has correct `<title>`, `<meta description>`, and Open Graph images (for sharing on social media).
2.  **Sitemap:**
    *   Generate `sitemap.xml` dynamically based on Strapi products/pages.
3.  **Tracking:**
    *   Add GA4 script or preferred analytics tool to `layout.tsx`.

### Step 3.3: Testing (QA)
1.  **Functional Testing:**
    *   Test full checkout flow with bad cards (declined), good cards, and edge cases.
    *   Test stock depletion (what happens if I buy the last item?).
2.  **Responsive Testing:**
    *   Verify layout on iPhone SE (small), iPhone 15 Pro, iPad, and Desktop.
3.  **Performance:**
    *   Run Lighthouse audit. Aim for all Green scores (90+).
    *   Optimize images (ensure correct sizing and formats like WebP).

### Step 3.4: Vendor Experience Refinement
*   *Note:* Building a custom frontend dashboard for vendors is a large task. For MVP, we will optimize the Strapi Admin panel for them.
*   **Customization:**
    *   Hide "Settings", "Content-Type Builder", and other non-vendor menus from the `Vendor` role.
    *   Ensure they only see their products.

### Step 3.5: Final Deployment (Go Live)
1.  **Database:**
    *   Migrate Dev data to Production Database (or clean wipe and start fresh).
    *   Ensure backups are running.
2.  **Domains:**
    *   Point `seereh.com` to Vercel.
    *   Point `api.seereh.com` to the Strapi host.
    *   Configure SSL (Automatic on Vercel/DigitalOcean).
3.  **Environment Variables:**
    *   Switch Stripe keys from `sk_test_...` to `sk_live_...`.
    *   Update API URLs to production versions.

## 4. Deliverables for Phase 4
*   [ ] Live, transacting Website.
*   [ ] HubSpot population with new customers.
*   [ ] SEO Optimized pages (verifiable via Google Search Console).
*   [ ] Handover documentation for the client (How to add products, how to fulfill orders).
