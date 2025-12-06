# Phase 1: Backend Foundation & Product Management
**Timeline:** December 6, 2025 – December 12, 2025
**Status:** Pending
**Goal:** Establish a robust content management system (CMS) and database schema to house product, artisan, and order data.

## 1. Objectives
*   Deploy a production-ready instance of Strapi (Headless CMS).
*   Provision and connect a PostgreSQL database.
*   Define the Content Types (Schema) for the platform.
*   Configure User Roles and Permissions (RBAC).
*   Migrate initial content (Products/Artisans) from static HTML.

## 2. Technical Architecture
*   **CMS:** Strapi (latest stable version).
*   **Database:** PostgreSQL.
*   **Hosting (Dev/Staging):** 
    *   *Option A:* DigitalOcean App Platform (Recommended for ease of use + managed DB).
    *   *Option B:* Heroku (Good ecosystem, but pricing has changed).
    *   *Option C:* VPS (e.g., Hetzner/AWS EC2) + Docker (More manual work, cheaper).
    *   *Decision:* We will proceed with **DigitalOcean App Platform** or a similar container-based PaaS for speed.
*   **Asset Storage:** Cloudinary or AWS S3 bucket for storing product images (Strapi requires a provider for persistent media storage).

## 3. Detailed Steps

### Step 3.1: Initialization
1.  Initialize local Strapi project: `npx create-strapi-app@latest backend --quickstart`.
2.  Initialize Git repository within the `backend` folder.
3.  Install the PostgreSQL client: `npm install pg`.

### Step 3.2: Database Schema Design (Content Modeling)
We need to define the following "Collection Types" in the Content-Type Builder:

#### A. Artisan (Vendor)
*   `Name` (Text, Short) - Required
*   `Slug` (UID, attached to Name) - Required, Unique
*   `Bio` (Rich Text)
*   `Location` (Text, Short) - e.g., "Hebron, Palestine"
*   `ProfilePicture` (Media, Single Image)
*   `Story` (Rich Text) - Long form content about their craft.
*   `Products` (Relation) - One Artisan has many Products.

#### B. Product
*   `Name` (Text, Short) - Required
*   `Slug` (UID, attached to Name) - Required, Unique
*   `Description` (Rich Text)
*   `Price` (Number, Decimal) - Required
*   `Currency` (Text, Short, Default: "USD")
*   `Stock` (Number, Integer, Default: 0)
*   `Images` (Media, Multiple Images)
*   `Category` (Relation) - Many Products belong to one Category.
*   `Artisan` (Relation) - Many Products belong to one Artisan.
*   `IsFeatured` (Boolean) - For homepage display.

#### C. Category
*   `Name` (Text, Short)
*   `Slug` (UID)
*   `Description` (Text, Long)
*   `Products` (Relation) - One Category has many Products.

#### D. Order (Preliminary Structure)
*   `StripeSessionId` (Text, Short) - For reference.
*   `Status` (Enumeration: Pending, Paid, Shipped, Cancelled)
*   `TotalAmount` (Number, Decimal)
*   `CustomerEmail` (Email)
*   `ShippingAddress` (JSON)
*   `OrderItems` (Component/Relation) - JSON structure or relation to specific snapshots of products.

### Step 3.3: Role-Based Access Control (RBAC) configuration
1.  **Public Role:**
    *   Can `find` and `findOne` on: `Product`, `Artisan`, `Category`.
    *   Cannot access `Order`.
2.  **Vendor Role (Authenticated):**
    *   Can `create`, `update` own `Product` entries.
    *   Can `find` own `Order` entries.
    *   *Note:* Requires custom policy implementation in Strapi to restrict updates to "own" data only (filtering by `author` or relation).
3.  **Admin Role:**
    *   Full access to all Content Types and Settings.

### Step 3.4: Asset Management
1.  Set up a Cloudinary account (Free tier is sufficient for prototype).
2.  Install `@strapi/provider-upload-cloudinary`.
3.  Configure `plugins.js` with Cloudinary credentials.

### Step 3.5: Content Migration
*   **Source:** `products/*.html` and `artisans/index.html`.
*   **Method:** Manual Entry via Strapi Admin Panel.
*   **Task:**
    *   Extract text and images from the existing file structure.
    *   Create the Artisans first (Hebron Glass, Nablus Soap makers, etc.).
    *   Create Categories (Ceramics, Soap, Textiles, etc.).
    *   Create Products and link them to Artisans and Categories.

### Step 3.6: API Testing
*   Use Postman or Insomnia to verify endpoints:
    *   `GET /api/products`
    *   `GET /api/artisans`
    *   `GET /api/products?populate=*` (To see images and relations).

## 4. Deliverables for Phase 1
*   [ ] GitHub Repository for Backend (`seereh-backend`).
*   [ ] Deployed Strapi Admin URL.
*   [ ] API Endpoint URL (e.g., `https://api.seereh.com/api`).
*   [ ] Database backup schedule configured.
*   [ ] JSON Dump of initial data.
