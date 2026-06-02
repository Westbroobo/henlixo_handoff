# Henlixo React + FastAPI Independent Site Design

## Goal

Build a premium B2B independent website for Henlixo that can show product families, SKU details, application scenarios, and social inspiration, while keeping a backend API path open for future expansion.

The first version should achieve:

- Product showcase for Henlixo's aluminum pergola, sunroom, railing, and accessories lines.
- Application scenario showcase without pretending to have detailed real project case studies yet.
- Social media traffic routing through visual inspiration modules and channel links.
- B2B inquiry conversion through WhatsApp, website inquiry form/email, and Alibaba.
- A React frontend that preserves the current static site's high-end architectural style.
- A FastAPI backend that returns static JSON data now and can later be upgraded to database-backed content.

## Confirmed Decisions

- Frontend implementation: React + Vite + TypeScript.
- Styling approach: native CSS, porting the current HTML visual language instead of using Tailwind or a UI component library.
- Backend implementation: FastAPI.
- Backend first version: API shell only, backed by static JSON files.
- Public pages in first version:
  - Home
  - Catalog
  - Cases
- Case page type: Application Scenarios, not fabricated Project Case Studies.
- Data source: backend JSON files returned through FastAPI endpoints.
- Conversion paths: WhatsApp, website inquiry form/email, Alibaba.
- First version excludes database, login, admin CMS, payment, multilingual support, email delivery, automated social scraping, and detailed case-study pages.

## Audience

Primary audience combines project customers and channel customers:

- Hotel, resort, restaurant, and commercial project clients.
- Building material importers, outdoor furniture distributors, and dealers.

Secondary audience:

- Villa owners and garden contractors.
- Architects, designers, and landscape firms.

The site should feel credible to project buyers while still making product discovery efficient for distributors.

## Visual Direction

The current static HTML style should be preserved as the base visual language:

- Warm stone background.
- Charcoal dark sections.
- Brass accent color.
- Large serif headlines.
- Small uppercase labels.
- Thin dividers.
- Spacious editorial layout.
- Large product and application photography.

The site should feel like a premium architectural product booklet, not a low-cost factory page or generic ecommerce catalog.

## Site Architecture

Recommended first-version structure:

```text
henlixo/
  frontend/
    index.html
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      styles/
        globals.css
        theme.css
      api/
        client.ts
        products.ts
        cases.ts
        social.ts
        inquiries.ts
      components/
        layout/
          Header.tsx
          Footer.tsx
        home/
          Hero.tsx
          ProductFamilies.tsx
          FeaturedProducts.tsx
          ScenarioPreview.tsx
          FactoryProof.tsx
          SocialPreview.tsx
          ContactSection.tsx
        catalog/
          CatalogFilters.tsx
          ProductGrid.tsx
          ProductModal.tsx
        cases/
          ScenarioGrid.tsx
          ScenarioDetailCard.tsx
      pages/
        HomePage.tsx
        CatalogPage.tsx
        CasesPage.tsx

  backend/
    main.py
    api/
      health.py
      site_config.py
      products.py
      cases.py
      social.py
      inquiries.py
    data/
      site-config.json
      products.json
      cases.json
      social.json
    schemas/
      inquiry.py
      product.py
      case.py

  legacy-static/
    index.html
    catalog.html
    config.js
    csv-to-config.html
    products-template.csv
```

The existing static HTML files should be preserved as visual and content references under `legacy-static/` rather than edited in place.

## Pages

### Home

The home page is the main brand and conversion page.

Recommended section order:

1. Hero
2. Product Families
3. Featured Products
4. Application Scenarios Preview
5. Factory & Compliance
6. Social / Inspiration Preview
7. Contact

Hero should communicate:

- What Henlixo makes.
- Which projects it serves.
- How to quickly inquire.

Hero headline direction:

```text
Customized Aluminum Pergolas & Outdoor Structures
for Hotels, Villas and Commercial Projects
```

Hero supporting copy direction:

```text
Henlixo provides bioclimatic aluminum pergolas, sunrooms, railing systems
and outdoor enclosure solutions for gardens, hotels, resorts, restaurants
and commercial outdoor projects.
```

Primary CTAs:

- Request Quote
- View Products
- Chat on WhatsApp

Trust bar:

- CE Certified
- 6063-T5 Aluminum
- 25-35 Days Lead Time
- 1 Set MOQ
- 10-Year Coating Warranty
- Foshan Factory

### Catalog

The catalog page is the complete SKU browser.

Catalog should include:

- Search by SKU, product name, scenario, and keyword.
- Family filters:
  - Pergola
  - Sunroom
  - Railing
  - Accessories
- Scenario filters:
  - Hotel
  - Resort
  - Restaurant
  - Villa
  - Pool
  - Dealer
- Product cards.
- Product detail modal.
- WhatsApp and inquiry actions.

The catalog should show all 11 Henlixo SKUs from the knowledge base.

### Cases

The first version of the cases page should be an Application Scenarios page.

It should avoid invented project names or fake detailed customer stories.

Recommended page title:

```text
Outdoor Structure Solutions by Application
```

Recommended scenarios:

1. Hotel & Resort Terraces
2. Restaurant & Cafe Outdoor Dining
3. Villa Gardens & Private Courtyards
4. Poolside & Spa Enclosures
5. Rooftop Bars & Commercial Patios
6. Real Estate & Public Landscape

Each scenario card should include:

- Image.
- Scenario name.
- Suitable customers.
- Recommended products.
- Key value message.
- CTA:
  - Discuss This Scenario
  - View Related Products

## Product Strategy

Home page product display should use two layers:

### Product Families

The four family cards are:

1. Aluminum Pergolas
2. Sunrooms & Mobile Enclosures
3. Railing & Fence Systems
4. Accessories & Add-ons

Pergola should be visually dominant because it is the main product line.

### Featured SKU

Home should not show all 11 SKUs at once. It should feature six key products:

- HL-PG-LV-STD
- HL-PG-LV-MED
- HL-PG-LV-HD
- HL-SR-120-GBL
- HL-MSR-PC
- HL-RL-AL

The full catalog page shows all 11 SKUs.

## Backend API

First-version FastAPI endpoints:

```text
GET  /api/health
GET  /api/site-config
GET  /api/products
GET  /api/products/{sku}
GET  /api/cases
GET  /api/social
POST /api/inquiries
```

Data flow:

```text
JSON files -> FastAPI endpoints -> React API client -> React pages/components
```

`POST /api/inquiries` should accept the inquiry payload and return success in the first version. It should not send email or write to a database yet.

Future backend upgrades can attach email delivery, database persistence, CRM, Feishu/WeCom notification, or Alibaba lead handling without changing the public React page architecture.

## Inquiry Form

Recommended fields:

- Name
- Company
- Email
- WhatsApp / Phone
- Country / Region
- Customer Type
- Product Interest
- Project Size / Quantity
- Message

Customer type options:

- Hotel / Resort
- Dealer / Distributor
- Contractor
- Villa Owner
- Designer / Architect
- Other

Product interest options:

- Pergola
- Sunroom
- Railing
- Accessories
- Complete Outdoor Solution

Success message:

```text
Thanks. Our project team will contact you within 24 hours.
```

Fallback when submission fails:

- Show WhatsApp direct link.
- Show email fallback.
- Keep the user's form data in the browser state.

## Error Handling

The React site should avoid blank states.

Expected behavior:

- Products API failure: show a compact unavailable message and keep inquiry CTAs visible.
- Product image failure: use fallback image.
- Cases API failure: hide the scenario preview or show a reduced fallback card.
- Social API failure: hide the social module because it is secondary.
- Inquiry API failure: show WhatsApp and email alternatives.

## First-Version Non-Goals

Do not build these in version one:

- Database.
- Login.
- Admin CMS.
- Payment.
- Multilingual routing.
- Email delivery.
- Automated social media scraping.
- Detailed project case-study pages.
- Blog or SEO article system.
- Full product import workflow.

These can be added after the first React + FastAPI site is stable.

## Migration Notes

The current static project remains useful:

- `index.html` provides homepage visual rhythm and section structure.
- `catalog.html` provides catalog and modal behavior reference.
- `config.js` provides product data structure reference.
- `products-template.csv` provides product source content reference.
- `ai_knowledge_base/01`, `02`, and `06` provide Henlixo product, company, and SKU truth.

The old LUMEN OUTDOOR content should not be carried forward as brand content. The React version should use Henlixo as the public English brand.

## Verification Plan

Before considering the first implementation complete:

- Start FastAPI and verify all planned endpoints return JSON.
- Start Vite React dev server and verify the three public pages render.
- Verify product data loads from `/api/products`.
- Verify `/catalog` filters by family and scenario.
- Verify product modal opens and includes inquiry CTAs.
- Verify `/cases` renders application scenarios, not fake project case studies.
- Verify inquiry form handles success and failure states.
- Verify responsive layout on mobile and desktop.
- Verify missing images use fallback behavior.
- Verify the visual language still matches the current premium static HTML style.
