# VS Enterprises - Wholesale LED Bulbs Portal

An industrial-grade B2B wholesale catalog and order management portal tailored for **VS Enterprises**, leading manufacturer and supplier of LED bulbs, raw materials, drivers, housings, and commercial lighting. Built with a compact hero section, slim category navigation, a 2x2 product grid viewport layout, detailed product specs modal with tiered wholesale MOQ pricing, a floating cart bar, and an expandable sticky footer containing complete business and owner details.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during the initial planning phase:

- **Confirmed Decision 1 (Wholesale Pricing)**: Tiered wholesale pricing with Minimum Order Quantities (MOQ) displayed prominently on cards and calculated dynamically in product details.
- **Confirmed Decision 2 (Visual Theme)**: Modern tech aesthetic with bright yellow/amber lighting accents and high-contrast dark slate surfaces (`slate-900`/`slate-950`).
- **Confirmed Decision 3 (Order Workflow)**: Dual wholesale order path — Direct WhatsApp B2B Invoice dispatch with pre-filled quantity/GST breakdown, and Proforma Invoice PDF download.

---

## 1. Overview & Core Concept

- **What It Does**: Provides B2B electrical retailers, distributors, and contractors with an intuitive, fast wholesale portal to browse LED lighting inventory, view tiered bulk pricing, select quantities meeting MOQs, calculate total GST invoices, and submit direct wholesale purchase orders to VS Enterprises.
- **Target Audience**: Electrical shop owners, regional LED distributors, commercial lighting contractors, and raw material assembly buyers across India.
- **Key Value**: Direct manufacturer rates, transparent bulk discounts (e.g., 50–5000+ units), real-time GST calculation, 1-click WhatsApp order submission, and full business transparency with owner contact details.

---

## 2. User Experience & Visual Design

### Key Layout Sections & User Flows

1. **Header & Top Bar**:
   - Single-line wordmark for **VS Enterprises** (Wholesale LED Solutions).
   - Fast phone hotline, WhatsApp quick link, and search bar for wattage/model search.
   - Quick inquiry button.

2. **Compact Hero Section**:
   - High-impact concise banner highlighting "Direct Factory Rates", "GST Billing & Nationwide Delivery", and "Raw Materials & Finished LED Bulbs".
   - Key stats strip: 50,000+ Daily Capacity · 12-36 Months Warranty · 100% Tested Drivers.

3. **Slim Category Navigation Bar**:
   - Single-line horizontal scrollable tab bar with fast filtering:
     - *All LED Products* · *Raw Bulbs (Diffuser+Housing)* · *Finished LED Bulbs (9W-50W)* · *Inverter AC/DC Bulbs* · *COB & Panel Lights* · *Flood & Street Lights* · *LED Drivers & MCPCBs*.

4. **2x2 Product Grid Viewport Layout**:
   - Structured specifically to display **2 rows × 2 columns (4 products per screen frame)** with smooth pagination controls (Page 1 of N) or responsive grid view.
   - Cards display high-res product photo, Wattage/Model tag, Stock status, MOQ, base price, and tiered discount preview.
   - Action buttons: `Quick Specs` and `+ Add Bulk`.

5. **Detailed Product Modal / Drawer**:
   - Opened when clicking any product card or `Quick Specs`.
   - Comprehensive specs table: Lumens output, CRI, Surge Protection (4kV), Driver type (HPF IC Driver), Warranty, Packaging (Pcs/Box), and sample order availability.
   - Tiered MOQ Price Calculator (e.g., 100-499 pcs @ ₹18, 500-1999 pcs @ ₹15, 2000+ pcs @ ₹12).
   - Dynamic quantity stepper enforcing MOQ increments, live total price breakdown, `Add to Cart`, and `Buy Now via WhatsApp`.

6. **Floating Sticky Cart Bar (Positioned right above the footer)**:
   - Sticky bar anchored just above the expandable footer.
   - Displays real-time item count, total wholesale amount (excl./incl. 18% GST), `Clear Cart`, and `View Cart Details & Checkout`.
   - Expanding the cart opens an itemized wholesale summary with GST breakdown and 1-click order generator.

7. **Expandable Sticky Footer**:
   - Compact persistent bottom strip with expandable trigger: *"Expand Owner & Business Info"*.
   - When expanded or scrolled into, reveals:
     - **Owner Details**: Director/Owner name, direct phone line, email.
     - **Business Info**: VS Enterprises registration, GSTIN number, MSME certification, Bank payment details (UPI / NEFT).
     - **Factory & Warehouse Address**: Industrial hub location & Google Maps direction link.
     - **Wholesale Terms & Warranty**: Replacement policy, sample kit policy, shipping partners.

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: High-tech industrial lighting atmosphere with sleek dark slate containers, crisp amber/bright yellow lighting highlights, and clean tabular typography.
- **Color Palette**:
  - `Canvas Background`: Deep Dark Slate (`bg-slate-950` / `bg-slate-900`)
  - `Surface Cards`: Slate Charcoal (`bg-slate-900` / `bg-slate-800/80` with hairline `border-slate-800`)
  - `Accent Color`: High-Visibility Amber Yellow (`#F59E0B` / `#FBBF24` for CTAs, active badges, and lighting glows)
  - `Typography`: Clean off-white headings (`text-slate-100`) and tabular numbers (`font-mono tabular-nums`)
- **Typography Pairing**: `Plus Jakarta Sans` for titles and body prose, paired with `JetBrains Mono` / `font-mono` for pricing tables and wattage specifications.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 2x2 Viewport Layout Discipline**
  - *Approach*: Product grid enforces 2 columns × 2 rows (4 primary cards visible per page/screen view) on desktop and responsive stacked 2x2 layout on mobile.
  - *Why*: Directly matches user requirement for focused screen real estate without overwhelming bulk buyers with endless scroll.
- **Decision 2: Tiered Wholesale Price Engine**
  - *Approach*: Prices auto-calculate based on selected bulk quantity brackets (e.g., Tier 1: 50-250 pcs, Tier 2: 251-1000 pcs, Tier 3: 1001+ pcs).
  - *Why*: Wholesale buyers need clear unit price drops as order size increases.
- **Decision 3: Floating Cart Bar + Expandable Footer Interaction**
  - *Approach*: Cart toolbar sits persistently pinned right above the bottom sticky footer bar. Clicking footer expands complete owner and business credentials cleanly without pushing cart controls out of view.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            VS ENTERPRISES PORTAL                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Header Bar (Brand, Hotline, Search, Quick Contact)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Compact Hero Banner (Direct Manufacturer Rates, GST Billing, Fast Dispatch) │
├─────────────────────────────────────────────────────────────────────────────┤
│  Slim Category Filter Bar (Tabs: All, 9W Bulbs, Raw Material, Drivers, etc) │
├─────────────────────────────────────────────────────────────────────────────┤
│  2x2 Product Grid Viewport (4 cards per screen frame + Pagination)          │
│    ├── Card 1: 9W B22 LED Bulb (Finished/Raw)                              │
│    ├── Card 2: 12W AC/DC Inverter Bulb                                     │
│    ├── Card 3: 15W High Wattage LED Bulb                                   │
│    └── Card 4: HPF LED Driver & MCPCB Kit                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Floating Cart Summary Bar (Total Items, Total Price, Clear, View Details)  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Expandable Sticky Footer (Owner Info, Business GSTIN, Warehouse Address)   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    Product Modal & Cart Drawer │
                      ├───────────────────────────────┤
                      │ • Specs & MOQ Tier Calculator │
                      │ • WhatsApp Invoice Generator  │
                      │ • Proforma Download           │
                      └───────────────────────────────┘
```

### Data Model & State Architecture

- **Product Catalog Schema**:
  - `id`: string
  - `name`: string (e.g., "9W Prime B22 Cool Daylight LED Bulb")
  - `category`: string ("Finished Bulbs", "Raw Materials", "Inverter AC/DC", "Drivers & MCPCB", "Panel Lights")
  - `image`: string (high-res generated LED product asset)
  - `moq`: number (minimum order quantity, e.g., 100 pcs)
  - `tiers`: array of `{ minQty: number, unitPrice: number }`
  - `specs`: `{ wattage: string, lumens: string, warranty: string, driverType: string, chipType: string, pcsPerBox: number, surge: string }`
  - `inStock`: boolean
  - `description`: string

- **Cart State (`useCart`)**:
  - `items`: array of `{ product: Product, quantity: number, calculatedUnitPrice: number }`
  - `subtotal`: number
  - `gstAmount`: number (18% GST)
  - `grandTotal`: number
  - `actions`: `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `generateWhatsAppInvoice`

---

## Implementation Steps & Verification Plan

1. **Metadata & HTML Sync**:
   - Update `metadata.json` and `index.html` title to "VS Enterprises | Wholesale LED Bulbs & Commercial Lighting".
2. **Product Catalog & Data Store**:
   - Create comprehensive wholesale catalog featuring 12+ LED bulb models, raw housing materials, AC/DC inverter bulbs, and driver circuits with MOQ tier structures.
3. **Components & Layout**:
   - Build Header, Compact Hero, Slim Category Bar, 2x2 Product Grid with pagination, Product Spec Modal, Floating Cart Bar, and Expandable Sticky Footer.
4. **Interactive Features**:
   - Dynamic MOQ tier calculator, live 18% GST pricing, WhatsApp order message formatter, and local storage persistence.
5. **Build & Lint Verification**:
   - Run `compile_applet` and `lint_applet` to confirm clean compilation and zero errors.
