# Phase 3: E-commerce Functionality
**Timeline:** January 2, 2026 – January 23, 2026
**Status:** Pending
**Goal:** Turn the brochure site into a functioning store where users can add items to a cart, checkout, and pay securely.

## 1. Objectives
*   Implement Global State for the Shopping Cart.
*   Integrate Stripe Payment Gateway.
*   Build a Secure Checkout Flow.
*   Handle Order Creation and Webhooks.
*   Configure Transactional Emails.

## 2. Technical Architecture
*   **State Management:** React Context API (Sufficient for cart state: items, quantities, total).
*   **Payments:** Stripe (using `@stripe/stripe-js` and `@stripe/react-stripe-js`).
*   **Backend Logic:** Next.js API Routes (or Server Actions) + Strapi Custom Controllers.
*   **Email:** SendGrid or Resend (integrated via Strapi plugin).

## 3. Detailed Steps

### Step 3.1: Shopping Cart Implementation
1.  **Context Provider:** Create `CartContext.tsx`.
    *   State: `cartItems` array.
    *   Actions: `addToCart(product, qty)`, `removeFromCart(productId)`, `updateQty(productId, qty)`, `clearCart()`.
    *   Persist to `localStorage` so the cart survives page reloads.
2.  **UI Components:**
    *   **Cart Drawer/Modal:** Slides in when the cart icon is clicked.
    *   **Cart Item Row:** Shows thumbnail, name, price, and quantity adjuster.
    *   **Cart Summary:** Subtotal, expected shipping (flat rate for MVP), Total.

### Step 3.2: Checkout UI
1.  Create `/checkout` page.
2.  **Step 1: Information:**
    *   Forms for Name, Email, Shipping Address.
    *   Validation using `react-hook-form` + `zod`.
3.  **Step 2: Payment:**
    *   Integrate Stripe Elements (PaymentElement).
    *   This allows Stripe to host the sensitive input fields safely.

### Step 3.3: Backend Payment Processing
1.  **Stripe Setup:**
    *   Create Stripe Account (Test Mode).
    *   Get Secret Key and Publishable Key.
2.  **Next.js API Route (`/api/create-payment-intent`):**
    *   Receive cart items from frontend.
    *   **Validation:** *Crucial* - Query Strapi to get the *real* price of the items. Do not trust prices sent from the frontend.
    *   Calculate Total.
    *   Create a Stripe PaymentIntent.
    *   Return `clientSecret` to the frontend.

### Step 3.4: Order Fulfillment Logic
1.  **Webhook Listener:**
    *   Create an API route (or Strapi endpoint) to listen for Stripe Webhooks (`checkout.session.completed` or `payment_intent.succeeded`).
2.  **Order Creation:**
    *   When webhook fires:
        *   Verify signature.
        *   Extract customer and product info.
        *   Create an `Order` record in Strapi.
        *   Decrement `Stock` count for purchased products.
3.  **Success Page:**
    *   Redirect user to `/checkout/success` upon payment completion.

### Step 3.5: Transactional Emails
1.  Install Email Provider plugin in Strapi (e.g., SendGrid).
2.  Configure Strapi Lifecycle hook (`afterCreate` on Order model).
3.  **Logic:**
    *   When an Order is created -> Send "Order Confirmation" email to Customer.
    *   Send "New Sale" email to Admin.
    *   (Optional) Send "New Order" notification to the specific Artisan (requires logic to filter items by artisan).

## 4. Deliverables for Phase 3
*   [ ] Fully functional "Add to Cart".
*   [ ] Persistent Cart across reload.
*   [ ] Secure Checkout Page (HTTPS).
*   [ ] Successful Payment processing in Stripe Test Mode.
*   [ ] Orders appearing in Strapi Admin Panel.
*   [ ] Email received upon purchase.
