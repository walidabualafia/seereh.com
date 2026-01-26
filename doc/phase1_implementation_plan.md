# Phase 1: Detailed Implementation Plan

**Timeline:** January 26, 2026 – February 1, 2026
**Estimated Implementation Time:** 5-7 focused sessions

This document provides step-by-step instructions for implementing the Strapi backend. Each task is atomic and can be executed sequentially.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Task 1: Initialize Strapi Project](#task-1-initialize-strapi-project)
3. [Task 2: Configure Environment & Database](#task-2-configure-environment--database)
4. [Task 3: Create Content Types](#task-3-create-content-types)
5. [Task 4: Configure Cloudinary for Media](#task-4-configure-cloudinary-for-media)
6. [Task 5: Configure RBAC Permissions](#task-5-configure-rbac-permissions)
7. [Task 6: Migrate Content Data](#task-6-migrate-content-data)
8. [Task 7: API Testing & Validation](#task-7-api-testing--validation)
9. [Task 8: Deploy to Production](#task-8-deploy-to-production)
10. [Verification Checklist](#verification-checklist)

---

## 1. Prerequisites

Before starting, ensure the following are installed/available:

### Local Development
- [ ] **Node.js** v18+ (LTS recommended) — check with `node -v`
- [ ] **npm** v8+ or **yarn** — check with `npm -v`
- [ ] **Git** — check with `git --version`

### Accounts (Free Tiers Sufficient)
- [ ] **GitHub** account (for repository)
- [ ] **Cloudinary** account (for image hosting) — https://cloudinary.com/
- [ ] **DigitalOcean** account (for deployment) — https://digitalocean.com/
  - Alternative: Railway, Render, or Heroku

### Optional (for local PostgreSQL testing)
- [ ] **PostgreSQL** installed locally — `brew install postgresql` (macOS)
- [ ] **Postman** or **Insomnia** (for API testing)

---

## Task 1: Initialize Strapi Project

### 1.1 Create the Backend Directory

```bash
# Navigate to parent of seereh.com (or wherever you want the backend)
cd /Users/wabuala/GitHub

# Create Strapi project with SQLite (quickstart for local dev)
npx create-strapi-app@latest seereh-backend --quickstart
```

**Expected output:** Strapi will install dependencies and open the admin panel at `http://localhost:1337/admin`

### 1.2 Create Admin User

When the browser opens:
1. Fill in admin registration form:
   - First name: `Admin`
   - Last name: `Seereh`
   - Email: `admin@seereh.com` (or your email)
   - Password: (use a strong password, save it securely)
2. Click "Let's start"

### 1.3 Initialize Git Repository

```bash
cd seereh-backend

# Initialize git
git init

# Create .gitignore (Strapi creates one, but verify these are included)
# Check that .env, node_modules, .tmp, build, .cache are ignored

# Initial commit
git add .
git commit -m "Initialize Strapi backend project"

# Create GitHub repository and push
gh repo create seereh-backend --private --source=. --push
```

### 1.4 Stop the Server

Press `Ctrl+C` in the terminal to stop Strapi for now.

---

## Task 2: Configure Environment & Database

### 2.1 Install PostgreSQL Client

```bash
cd seereh-backend
npm install pg
```

### 2.2 Create Production Database Config

Create file: `config/env/production/database.js`

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', true) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
    },
    debug: false,
  },
});
```

### 2.3 Update .env.example

Create `.env.example` for documentation:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database (Production)
DATABASE_HOST=your-db-host.db.ondigitalocean.com
DATABASE_PORT=25060
DATABASE_NAME=seereh_db
DATABASE_USERNAME=doadmin
DATABASE_PASSWORD=your-password
DATABASE_SSL=true

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret
```

### 2.4 Commit Changes

```bash
git add .
git commit -m "Add PostgreSQL configuration for production"
```

---

## Task 3: Create Content Types

Start Strapi in development mode:

```bash
npm run develop
```

Navigate to `http://localhost:1337/admin` and log in.

### 3.1 Create "Category" Collection Type

Go to: **Content-Type Builder** → **Create new collection type**

**Display name:** `Category`

**Fields:**

| Field Name   | Type           | Options                                      |
|--------------|----------------|----------------------------------------------|
| `Name`       | Text (Short)   | Required                                     |
| `Slug`       | UID            | Attached to: `Name`, Required                |
| `Description`| Text (Long)    | Optional                                     |

Click **Save** (Strapi will restart)

### 3.2 Create "Artisan" Collection Type

Go to: **Content-Type Builder** → **Create new collection type**

**Display name:** `Artisan`

**Fields:**

| Field Name      | Type              | Options                                    |
|-----------------|-------------------|--------------------------------------------|
| `Name`          | Text (Short)      | Required                                   |
| `Slug`          | UID               | Attached to: `Name`, Required              |
| `Location`      | Text (Short)      | e.g., "Nablus, Palestine"                  |
| `Bio`           | Rich Text         | Short bio                                  |
| `Story`         | Rich Text         | Long-form story about their craft          |
| `ProfilePicture`| Media (Single)    | Allowed types: Images only                 |

Click **Save**

### 3.3 Create "Product" Collection Type

Go to: **Content-Type Builder** → **Create new collection type**

**Display name:** `Product`

**Fields:**

| Field Name    | Type              | Options                                      |
|---------------|-------------------|----------------------------------------------|
| `Name`        | Text (Short)      | Required                                     |
| `Slug`        | UID               | Attached to: `Name`, Required                |
| `SKU`         | Text (Short)      | Unique (for inventory reference)             |
| `Description` | Rich Text         | Full product description                     |
| `Price`       | Number (Decimal)  | Required, Min: 0                             |
| `Currency`    | Text (Short)      | Default: `GBP`                               |
| `Stock`       | Number (Integer)  | Default: 0, Min: 0                           |
| `IsFeatured`  | Boolean           | Default: false                               |
| `Images`      | Media (Multiple)  | Allowed types: Images only                   |
| `Category`    | Relation          | Product belongs to one Category              |
| `Artisan`     | Relation          | Product belongs to one Artisan               |

**Relation Configuration:**

For `Category`:
- Select: **Product belongs to one Category** (many-to-one)
- This creates `Category` field on Product and `Products` field on Category

For `Artisan`:
- Select: **Product belongs to one Artisan** (many-to-one)
- This creates `Artisan` field on Product and `Products` field on Artisan

Click **Save**

### 3.4 Create "Order" Collection Type (Preliminary)

Go to: **Content-Type Builder** → **Create new collection type**

**Display name:** `Order`

**Fields:**

| Field Name        | Type              | Options                                    |
|-------------------|-------------------|--------------------------------------------|
| `StripeSessionId` | Text (Short)      | Unique                                     |
| `Status`          | Enumeration       | Values: `pending`, `paid`, `shipped`, `cancelled` |
| `TotalAmount`     | Number (Decimal)  | Required                                   |
| `Currency`        | Text (Short)      | Default: `GBP`                             |
| `CustomerEmail`   | Email             | Required                                   |
| `CustomerName`    | Text (Short)      | Required                                   |
| `ShippingAddress` | JSON              | Stores full address object                 |
| `OrderItems`      | JSON              | Array of {productId, name, price, qty}     |

Click **Save**

### 3.5 Verify Content Types

After all saves, your Content-Type Builder should show:
- Category
- Artisan
- Product
- Order

### 3.6 Commit Schema Changes

```bash
git add .
git commit -m "Define content types: Category, Artisan, Product, Order"
```

---

## Task 4: Configure Cloudinary for Media

### 4.1 Get Cloudinary Credentials

1. Log in to https://cloudinary.com/console
2. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### 4.2 Install Cloudinary Provider

```bash
npm install @strapi/provider-upload-cloudinary
```

### 4.3 Create Upload Plugin Config

Create file: `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
```

### 4.4 Update .env with Cloudinary Credentials

Add to your `.env` file:

```env
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=123456789012345
CLOUDINARY_SECRET=your-api-secret
```

### 4.5 Configure Security Middleware for Cloudinary

Update `config/middlewares.js` to allow Cloudinary images:

```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 4.6 Test Upload

1. Restart Strapi: `npm run develop`
2. Go to **Media Library** in admin
3. Upload a test image
4. Verify it appears in your Cloudinary dashboard

### 4.7 Commit Changes

```bash
git add .
git commit -m "Configure Cloudinary for media uploads"
```

---

## Task 5: Configure RBAC Permissions

### 5.1 Configure Public Role (Unauthenticated Users)

1. Go to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Configure permissions:

| Content Type | find | findOne | create | update | delete |
|--------------|------|---------|--------|--------|--------|
| Category     | ✅   | ✅      | ❌     | ❌     | ❌     |
| Artisan      | ✅   | ✅      | ❌     | ❌     | ❌     |
| Product      | ✅   | ✅      | ❌     | ❌     | ❌     |
| Order        | ❌   | ❌      | ❌     | ❌     | ❌     |

3. Click **Save**

### 5.2 Configure Authenticated Role (Future Vendors)

1. Go to: **Settings** → **Roles** → **Authenticated**
2. For now, leave default (we'll customize for vendors in Phase 4)

### 5.3 Verify API Access

Test in browser or curl:

```bash
# Should return empty array or products
curl http://localhost:1337/api/products

# Should return 403 Forbidden
curl http://localhost:1337/api/orders
```

---

## Task 6: Migrate Content Data

### 6.1 Content Inventory (Extracted from Static Site)

#### Categories to Create:

| Name      | Slug      | Description                           |
|-----------|-----------|---------------------------------------|
| Soap      | soap      | Traditional olive oil soaps          |
| Ceramics  | ceramics  | Hand-painted pottery and plates      |
| Textiles  | textiles  | Embroidered fabrics and cushions     |
| Ritual    | ritual    | Incense burners and ceremonial items |

#### Artisans to Create:

| Name                    | Slug                    | Location            |
|-------------------------|-------------------------|---------------------|
| Fatima                  | fatima                  | Nablus, Palestine   |
| Youssef                 | youssef                 | Hebron, Palestine   |
| Layla                   | layla                   | Damascus, Syria     |
| Workshop Collective     | workshop-collective     | Damascus, Syria     |

#### Products to Create:

| Name                           | SKU              | Price | Currency | Category  | Artisan              |
|--------------------------------|------------------|-------|----------|-----------|----------------------|
| Nabulsi Olive Oil Soap         | SOAP-NAB-100     | 8     | GBP      | Soap      | Fatima               |
| Hebron Dinner Plate            | CER-PLATE-HEB-28 | 22    | GBP      | Ceramics  | Youssef              |
| Tatreez Cushion                | TXT-CUSH-TA-45   | 35    | GBP      | Textiles  | Layla                |
| Brass Incense Burner (Mabkhara)| RIT-MAB-01       | 28    | GBP      | Ritual    | Workshop Collective  |

### 6.2 Create Categories in Strapi Admin

1. Go to: **Content Manager** → **Category** → **Create new entry**
2. Create each category from the table above
3. Click **Save** then **Publish** for each

### 6.3 Upload Images to Media Library

Upload these images from the static site to Cloudinary via Strapi:

**Source folder:** `/Users/wabuala/GitHub/seereh.com/assets/img/products/`

| Filename              | Associated Product           |
|-----------------------|------------------------------|
| nabulsi-soap-1.jpg    | Nabulsi Olive Oil Soap       |
| nabulsi-soap-2.jpg    | Nabulsi Olive Oil Soap       |
| hebron-plate.jpg      | Hebron Dinner Plate          |
| hebron-plate-2.jpg    | Hebron Dinner Plate          |
| tatreez-cushion.jpg   | Tatreez Cushion              |
| tatreez-cushion-2.jpg | Tatreez Cushion              |
| incense-burner.jpg    | Brass Incense Burner         |
| incense-burner-2.jpg  | Brass Incense Burner         |

### 6.4 Create Artisans

1. Go to: **Content Manager** → **Artisan** → **Create new entry**
2. For each artisan:
   - Fill in Name, Slug (auto-generates), Location
   - Add Bio (placeholder text for now)
   - Upload ProfilePicture if available
3. **Save** and **Publish** each

### 6.5 Create Products

1. Go to: **Content Manager** → **Product** → **Create new entry**
2. For each product:
   - Name, Slug, SKU, Description, Price, Currency (`GBP`)
   - Stock: set initial value (e.g., 10)
   - IsFeatured: `true` for homepage products
   - Images: select from Media Library
   - Category: select appropriate category
   - Artisan: select appropriate artisan
3. **Save** and **Publish** each

### 6.6 Detailed Product Descriptions

Use these descriptions (from the static site):

**Nabulsi Olive Oil Soap:**
```
Traditional Nabulsi soap handcrafted with Palestinian olive oil. Made using centuries-old techniques passed down through generations in Nablus.
```

**Hebron Dinner Plate:**
```
Hand-painted ceramic plate using traditional Hebron motifs. Each piece is unique, crafted by skilled artisans in the historic glass and ceramic workshops of Hebron.
```

**Tatreez Cushion:**
```
Embroidered cushion cover celebrating Levantine patterns. Traditional Palestinian cross-stitch embroidery (tatreez) on premium fabric.
```

**Brass Incense Burner (Mabkhara):**
```
Classic mabkhara for oud and resins. Handcrafted brass incense burner perfect for traditional Middle Eastern incense ceremonies.
```

---

## Task 7: API Testing & Validation

### 7.1 Test Endpoints

Use curl, Postman, or browser:

```bash
# List all products
curl http://localhost:1337/api/products

# List products with relations populated
curl "http://localhost:1337/api/products?populate=*"

# Get single product by slug
curl "http://localhost:1337/api/products?filters[Slug][\$eq]=nabulsi-olive-oil-soap&populate=*"

# List all artisans
curl http://localhost:1337/api/artisans

# List all categories
curl http://localhost:1337/api/categories

# This should fail (403)
curl http://localhost:1337/api/orders
```

### 7.2 Expected Response Structure

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "Name": "Nabulsi Olive Oil Soap",
        "Slug": "nabulsi-olive-oil-soap",
        "Price": 8,
        "Currency": "GBP",
        "Description": "Traditional Nabulsi soap...",
        "Images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "url": "https://res.cloudinary.com/..."
              }
            }
          ]
        },
        "Category": {
          "data": {
            "id": 1,
            "attributes": {
              "Name": "Soap",
              "Slug": "soap"
            }
          }
        },
        "Artisan": {
          "data": {
            "id": 1,
            "attributes": {
              "Name": "Fatima",
              "Location": "Nablus, Palestine"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

### 7.3 Create API Token (for Frontend)

1. Go to: **Settings** → **API Tokens** → **Create new API Token**
2. Name: `Frontend Read Only`
3. Token type: `Read-only`
4. Token duration: `Unlimited`
5. Permissions: Select all `find` and `findOne` for Product, Artisan, Category
6. **Save** and copy the token (you won't see it again)

Store this token securely — it will be used by the Next.js frontend.

---

## Task 8: Deploy to Production

### 8.1 Option A: DigitalOcean App Platform (Recommended)

#### Step 1: Create Managed PostgreSQL Database

1. Log in to DigitalOcean
2. Go to: **Databases** → **Create Database**
3. Choose:
   - Engine: PostgreSQL 15
   - Plan: Basic ($15/mo is sufficient)
   - Datacenter: Choose closest to your users
   - Name: `seereh-db`
4. Note the connection details (host, port, user, password, database name)

#### Step 2: Create App

1. Go to: **Apps** → **Create App**
2. Source: GitHub → Select `seereh-backend` repo
3. Branch: `main`
4. Auto-deploy: Enable

#### Step 3: Configure Environment Variables

In App Settings → Environment Variables, add:

```
NODE_ENV=production
HOST=0.0.0.0
PORT=8080
APP_KEYS=(generate with: openssl rand -base64 32, comma-separated x4)
API_TOKEN_SALT=(generate with: openssl rand -base64 32)
ADMIN_JWT_SECRET=(generate with: openssl rand -base64 32)
TRANSFER_TOKEN_SALT=(generate with: openssl rand -base64 32)
JWT_SECRET=(generate with: openssl rand -base64 32)
DATABASE_HOST=(from DB connection details)
DATABASE_PORT=25060
DATABASE_NAME=defaultdb
DATABASE_USERNAME=doadmin
DATABASE_PASSWORD=(from DB connection details)
DATABASE_SSL=true
CLOUDINARY_NAME=(your cloud name)
CLOUDINARY_KEY=(your key)
CLOUDINARY_SECRET=(your secret)
```

#### Step 4: Deploy

1. Click **Create Resources**
2. Wait for build and deployment (5-10 minutes)
3. Note your app URL: `https://seereh-backend-xxxxx.ondigitalocean.app`

#### Step 5: Create Production Admin User

1. Visit `https://your-app-url/admin`
2. Create new admin account (different from dev)
3. Re-create content or use Strapi transfer feature

### 8.2 Option B: Railway (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up
```

### 8.3 Configure Custom Domain (Optional)

1. In DigitalOcean: **Apps** → **Settings** → **Domains**
2. Add: `api.seereh.com`
3. Update DNS: Add CNAME record pointing to the DO app URL

---

## Verification Checklist

### Local Development
- [ ] Strapi runs without errors at `http://localhost:1337`
- [ ] Admin panel accessible at `http://localhost:1337/admin`
- [ ] All 4 content types visible in Content-Type Builder
- [ ] Categories created and published (4 total)
- [ ] Artisans created and published (4 total)
- [ ] Products created and published (4 total)
- [ ] All product images uploaded and visible
- [ ] Product-Category relations working
- [ ] Product-Artisan relations working
- [ ] Public API returns products: `GET /api/products`
- [ ] Public API populates relations: `GET /api/products?populate=*`
- [ ] Orders endpoint blocked for public: `GET /api/orders` returns 403

### Production Deployment
- [ ] GitHub repository created: `seereh-backend`
- [ ] Production database provisioned (PostgreSQL)
- [ ] App deployed to DigitalOcean/Railway
- [ ] Environment variables configured
- [ ] Admin panel accessible on production
- [ ] Production admin user created
- [ ] Content migrated to production
- [ ] API Token generated for frontend
- [ ] SSL certificate active (HTTPS)
- [ ] Database backups enabled

### Documentation
- [ ] `.env.example` updated with all required variables
- [ ] README.md updated with setup instructions
- [ ] API Token stored securely (password manager)

---

## Troubleshooting

### Common Issues

**Strapi won't start:**
```bash
# Clear cache and rebuild
rm -rf .cache build node_modules
npm install
npm run build
npm run develop
```

**Database connection error (production):**
- Verify `DATABASE_SSL=true` is set
- Check if database firewall allows connections from App Platform

**Images not loading:**
- Verify Cloudinary credentials in `.env`
- Check `config/middlewares.js` includes Cloudinary domain

**API returns empty array:**
- Check if content is **Published** (not just saved as draft)
- Verify Public role has `find` permission

---

## Next Steps (Handoff to Phase 2)

After Phase 1 is complete, provide the following to the Phase 2 frontend work:

1. **API Base URL:** `https://api.seereh.com/api` (or your production URL)
2. **API Token:** The read-only token generated in Task 7.3
3. **Content Structure:** Document the response shape for each endpoint
4. **Image URLs:** All images now served from Cloudinary CDN

The frontend will consume:
- `GET /api/products?populate=*`
- `GET /api/products?filters[Slug][$eq]=<slug>&populate=*`
- `GET /api/artisans?populate=*`
- `GET /api/categories`
