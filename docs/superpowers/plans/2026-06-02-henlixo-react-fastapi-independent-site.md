# Henlixo React + FastAPI Independent Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first React + FastAPI version of the Henlixo independent B2B site with Home, Catalog, Cases, JSON-backed APIs, and inquiry conversion paths.

**Architecture:** Keep the existing static files as legacy references, create a new `frontend/` Vite React app and a new `backend/` FastAPI app. The backend serves JSON files through stable API endpoints; the frontend fetches those APIs and renders premium native-CSS pages based on the approved design spec.

**Tech Stack:** React, Vite, TypeScript, native CSS, FastAPI, Pydantic, pytest, Vitest, Testing Library.

---

## Scope Notes

- Current directory is not a Git repository, so each task ends with a verification checkpoint instead of a commit.
- If the user initializes Git before execution, run the checkpoint commands first, then commit the listed files with the task title as the commit message.
- Existing HTML files remain available as references. They should be copied into `legacy-static/` and not edited as the new application source.

## File Structure

Create this structure during implementation:

```text
backend/
  main.py
  requirements.txt
  api/
    __init__.py
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
    __init__.py
    case.py
    inquiry.py
    product.py
    site_config.py
  services/
    __init__.py
    data_loader.py
  tests/
    test_api_contracts.py

frontend/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  src/
    main.tsx
    App.tsx
    api/
      cases.ts
      client.ts
      inquiries.ts
      products.ts
      siteConfig.ts
      social.ts
    components/
      catalog/
        CatalogFilters.tsx
        ProductGrid.tsx
        ProductModal.tsx
      cases/
        ScenarioGrid.tsx
      home/
        ContactSection.tsx
        FactoryProof.tsx
        FeaturedProducts.tsx
        Hero.tsx
        ProductFamilies.tsx
        ScenarioPreview.tsx
        SocialPreview.tsx
      layout/
        Footer.tsx
        Header.tsx
    pages/
      CatalogPage.tsx
      CasesPage.tsx
      HomePage.tsx
    styles/
      globals.css
      theme.css
    types/
      case.ts
      product.ts
      site.ts
    test/
      setup.ts
      api.test.ts
      catalog.test.tsx
      home.test.tsx
      cases.test.tsx

legacy-static/
  index.html
  catalog.html
  config.js
  csv-to-config.html
  products-template.csv
```

---

### Task 1: Preserve Legacy Static Files

**Files:**
- Create: `legacy-static/index.html`
- Create: `legacy-static/catalog.html`
- Create: `legacy-static/config.js`
- Create: `legacy-static/csv-to-config.html`
- Create: `legacy-static/products-template.csv`

- [ ] **Step 1: Copy current static files into `legacy-static/`**

Run:

```powershell
New-Item -ItemType Directory -Force -Path .\legacy-static | Out-Null
Copy-Item -LiteralPath .\index.html -Destination .\legacy-static\index.html -Force
Copy-Item -LiteralPath .\catalog.html -Destination .\legacy-static\catalog.html -Force
Copy-Item -LiteralPath .\config.js -Destination .\legacy-static\config.js -Force
Copy-Item -LiteralPath .\csv-to-config.html -Destination .\legacy-static\csv-to-config.html -Force
Copy-Item -LiteralPath .\products-template.csv -Destination .\legacy-static\products-template.csv -Force
```

- [ ] **Step 2: Verify the legacy copy exists**

Run:

```powershell
Get-ChildItem -LiteralPath .\legacy-static | Select-Object Name,Length
```

Expected: five files are listed with non-zero sizes.

- [ ] **Step 3: Checkpoint**

Record in the task notes:

```text
Legacy static files preserved under legacy-static/.
```

---

### Task 2: Create FastAPI Backend Data and Contracts

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/data/site-config.json`
- Create: `backend/data/products.json`
- Create: `backend/data/cases.json`
- Create: `backend/data/social.json`
- Create: `backend/schemas/product.py`
- Create: `backend/schemas/case.py`
- Create: `backend/schemas/site_config.py`
- Create: `backend/schemas/inquiry.py`
- Create: `backend/schemas/__init__.py`
- Create: `backend/services/data_loader.py`
- Create: `backend/services/__init__.py`
- Test: `backend/tests/test_api_contracts.py`

- [ ] **Step 1: Create backend dependency file**

Create `backend/requirements.txt`:

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.4
pytest==8.3.4
httpx==0.28.1
```

- [ ] **Step 2: Write failing API contract tests**

Create `backend/tests/test_api_contracts.py`:

```python
from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_endpoint_returns_ok():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "henlixo-api"}


def test_products_endpoint_returns_henlixo_skus():
    response = client.get("/api/products")

    assert response.status_code == 200
    products = response.json()
    assert len(products) == 11
    assert products[0]["sku"] == "HL-PG-LV-STD"
    assert products[0]["family"] == "Pergola"


def test_product_detail_endpoint_returns_single_sku():
    response = client.get("/api/products/HL-MSR-PC")

    assert response.status_code == 200
    product = response.json()
    assert product["sku"] == "HL-MSR-PC"
    assert product["family"] == "Sunroom"


def test_cases_endpoint_returns_application_scenarios():
    response = client.get("/api/cases")

    assert response.status_code == 200
    cases = response.json()
    assert cases[0]["kind"] == "application-scenario"
    assert "recommendedProducts" in cases[0]


def test_social_endpoint_returns_channels_and_items():
    response = client.get("/api/social")

    assert response.status_code == 200
    payload = response.json()
    assert payload["channels"][0]["name"] == "Instagram"
    assert len(payload["items"]) >= 3


def test_inquiry_endpoint_accepts_payload_without_persistence():
    payload = {
        "name": "Jane Buyer",
        "company": "Resort Group",
        "email": "jane@example.com",
        "phone": "+1 310 555 0100",
        "country": "USA",
        "customerType": "Hotel / Resort",
        "productInterest": "Pergola",
        "projectSize": "12 sets",
        "message": "Please quote a resort pergola project.",
    }

    response = client.post("/api/inquiries", json=payload)

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Inquiry received",
    }
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```powershell
Set-Location .\backend
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m pytest tests\test_api_contracts.py -q
```

Expected: FAIL because `main.py` and API files do not exist.

- [ ] **Step 4: Add product schema**

Create `backend/schemas/product.py`:

```python
from pydantic import BaseModel


class ProductSpec(BaseModel):
    label: str
    value: str


class Product(BaseModel):
    sku: str
    name: str
    family: str
    subType: str
    application: list[str]
    tier: str
    featured: bool = False
    tagline: str
    intro: str
    image: str
    imageFallback: str
    specs: list[ProductSpec]
    features: list[str]
    accessories: list[str] = []
    leadTime: str
    moq: str
    ctaLabel: str = "Inquire via WhatsApp"
```

- [ ] **Step 5: Add case schema**

Create `backend/schemas/case.py`:

```python
from pydantic import BaseModel


class ApplicationScenario(BaseModel):
    id: str
    kind: str
    title: str
    audience: str
    summary: str
    image: str
    imageFallback: str
    recommendedProducts: list[str]
    keyPoints: list[str]
```

- [ ] **Step 6: Add site config and inquiry schemas**

Create `backend/schemas/site_config.py`:

```python
from pydantic import BaseModel


class BrandConfig(BaseModel):
    name: str
    logoMark: str
    tagline: str


class ContactConfig(BaseModel):
    emailMain: str
    phone: str
    phoneRaw: str
    address: str
    alibabaUrl: str


class SiteConfig(BaseModel):
    brand: BrandConfig
    contact: ContactConfig
    certifications: list[str]
```

Create `backend/schemas/inquiry.py`:

```python
from pydantic import BaseModel, EmailStr


class InquiryRequest(BaseModel):
    name: str
    company: str | None = None
    email: EmailStr
    phone: str | None = None
    country: str | None = None
    customerType: str
    productInterest: str
    projectSize: str | None = None
    message: str


class InquiryResponse(BaseModel):
    success: bool
    message: str
```

Create `backend/schemas/__init__.py`:

```python
from .case import ApplicationScenario
from .inquiry import InquiryRequest, InquiryResponse
from .product import Product, ProductSpec
from .site_config import SiteConfig
```

- [ ] **Step 7: Add JSON data files**

Create `backend/data/site-config.json`:

```json
{
  "brand": {
    "name": "Henlixo",
    "logoMark": "H",
    "tagline": "Customized Aluminum Outdoor Structures"
  },
  "contact": {
    "emailMain": "info@your-domain.com",
    "phone": "+86 159-2563-8060",
    "phoneRaw": "8615925638060",
    "address": "Foshan, Guangdong, China",
    "alibabaUrl": "https://www.alibaba.com/"
  },
  "certifications": [
    "CE Certified",
    "6063-T5 Aluminum",
    "25-35 Days Lead Time",
    "1 Set MOQ",
    "10-Year Coating Warranty",
    "Foshan Factory"
  ]
}
```

Create `backend/data/products.json` using the 11 Henlixo SKUs from `ai_knowledge_base/06_商品信息库_SKU`. Ensure the first object is:

```json
{
  "sku": "HL-PG-LV-STD",
  "name": "Motorized Louvered Aluminum Pergola (Standard)",
  "family": "Pergola",
  "subType": "Motorized Louvered",
  "application": ["Villa", "Restaurant", "Cafe", "Light Hotel", "Dealer"],
  "tier": "Standard main-line",
  "featured": true,
  "tagline": "Henlixo's main pergola SKU for 3-6m residential gardens, restaurant terraces, cafes and light hospitality projects.",
  "intro": "A 6063-T5 aluminum motorized louvered pergola with 0-135 degree adjustable roof, hidden post drainage, fluorocarbon 3-coat finish, RF remote control and optional LED, rain sensor, side screen and sliding glass door upgrades.",
  "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
  "imageFallback": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
  "specs": [
    {"label": "Frame", "value": "6063-T5 aluminum, 2.0mm wall thickness"},
    {"label": "Roof", "value": "Motorized louver, 0-135 degree adjustable"},
    {"label": "Lead Time", "value": "25-30 days"},
    {"label": "MOQ", "value": "1 set"}
  ],
  "features": [
    "Hidden gutter and post drainage",
    "RF remote and wall switch",
    "Optional LED, rain and wind sensor, Wi-Fi control",
    "24-month product warranty and 10-year coating warranty"
  ],
  "accessories": ["LED light strip", "Rain and wind sensor", "Side screen", "Sliding glass door"],
  "leadTime": "25-30 days",
  "moq": "1 set",
  "ctaLabel": "Inquire via WhatsApp"
}
```

Add the remaining SKUs with these `sku`, `family`, and `featured` values:

```json
[
  {"sku": "HL-PG-LV-MED", "family": "Pergola", "featured": true},
  {"sku": "HL-PG-LV-HD", "family": "Pergola", "featured": true},
  {"sku": "HL-PG-FLIP-175", "family": "Pergola", "featured": false},
  {"sku": "HL-PV-POINT", "family": "Pergola", "featured": false},
  {"sku": "HL-CY-R", "family": "Accessories", "featured": false},
  {"sku": "HL-SR-120-GBL", "family": "Sunroom", "featured": true},
  {"sku": "HL-SR-120-FLT", "family": "Sunroom", "featured": false},
  {"sku": "HL-MSR-PC", "family": "Sunroom", "featured": true},
  {"sku": "HL-RL-AL", "family": "Railing", "featured": true},
  {"sku": "HL-ACC-WC", "family": "Accessories", "featured": false}
]
```

Each object must include all fields required by the `Product` schema.

Create `backend/data/cases.json` with six application scenarios:

```json
[
  {
    "id": "hotel-resort-terraces",
    "kind": "application-scenario",
    "title": "Hotel & Resort Terraces",
    "audience": "Hotels, resorts and hospitality procurement teams",
    "summary": "Pergola and enclosure systems for pool decks, dining terraces and guest outdoor lounges.",
    "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    "imageFallback": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
    "recommendedProducts": ["HL-PG-LV-HD", "HL-MSR-PC", "HL-PV-POINT"],
    "keyPoints": ["Heavy-duty structures", "Weather protection", "Resort-grade visual finish"]
  }
]
```

Add these additional scenario IDs with the same field shape:

```json
[
  "restaurant-cafe-outdoor-dining",
  "villa-gardens-private-courtyards",
  "poolside-spa-enclosures",
  "rooftop-bars-commercial-patios",
  "real-estate-public-landscape"
]
```

Create `backend/data/social.json`:

```json
{
  "channels": [
    {"name": "Instagram", "url": "https://www.instagram.com/your-handle"},
    {"name": "TikTok", "url": "https://www.tiktok.com/@your-handle"},
    {"name": "Pinterest", "url": "https://www.pinterest.com/your-handle"},
    {"name": "YouTube", "url": "https://www.youtube.com/@your-channel"}
  ],
  "items": [
    {
      "title": "Matte Black Pergola",
      "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "url": "https://www.instagram.com/your-handle"
    },
    {
      "title": "Restaurant Terrace Inspiration",
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "url": "https://www.pinterest.com/your-handle"
    },
    {
      "title": "Poolside Outdoor Structure",
      "image": "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
      "url": "https://www.tiktok.com/@your-handle"
    }
  ]
}
```

- [ ] **Step 8: Add JSON loader service**

Create `backend/services/data_loader.py`:

```python
import json
from functools import lru_cache
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parents[1] / "data"


@lru_cache(maxsize=16)
def load_json_file(filename: str) -> Any:
    path = DATA_DIR / filename
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)
```

Create `backend/services/__init__.py`:

```python
from .data_loader import load_json_file
```

- [ ] **Step 9: Run tests to confirm backend still RED**

Run:

```powershell
Set-Location .\backend
.\.venv\Scripts\python -m pytest tests\test_api_contracts.py -q
```

Expected: FAIL because routes are not implemented yet.

---

### Task 3: Implement FastAPI Routes

**Files:**
- Create: `backend/main.py`
- Create: `backend/api/__init__.py`
- Create: `backend/api/health.py`
- Create: `backend/api/site_config.py`
- Create: `backend/api/products.py`
- Create: `backend/api/cases.py`
- Create: `backend/api/social.py`
- Create: `backend/api/inquiries.py`
- Modify: `backend/requirements.txt`
- Test: `backend/tests/test_api_contracts.py`

- [ ] **Step 1: Add email validation dependency**

Modify `backend/requirements.txt` to include:

```text
email-validator==2.2.0
```

- [ ] **Step 2: Create route package marker**

Create `backend/api/__init__.py`:

```python
```

- [ ] **Step 3: Add health route**

Create `backend/api/health.py`:

```python
from fastapi import APIRouter


router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "henlixo-api"}
```

- [ ] **Step 4: Add site config route**

Create `backend/api/site_config.py`:

```python
from fastapi import APIRouter

from schemas.site_config import SiteConfig
from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["site-config"])


@router.get("/site-config", response_model=SiteConfig)
def get_site_config() -> SiteConfig:
    return SiteConfig.model_validate(load_json_file("site-config.json"))
```

- [ ] **Step 5: Add products routes**

Create `backend/api/products.py`:

```python
from fastapi import APIRouter, HTTPException

from schemas.product import Product
from services.data_loader import load_json_file


router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return [Product.model_validate(item) for item in load_json_file("products.json")]


@router.get("/{sku}", response_model=Product)
def get_product(sku: str) -> Product:
    products = list_products()
    for product in products:
        if product.sku.lower() == sku.lower():
            return product
    raise HTTPException(status_code=404, detail="Product not found")
```

- [ ] **Step 6: Add cases and social routes**

Create `backend/api/cases.py`:

```python
from fastapi import APIRouter

from schemas.case import ApplicationScenario
from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["cases"])


@router.get("/cases", response_model=list[ApplicationScenario])
def list_cases() -> list[ApplicationScenario]:
    return [ApplicationScenario.model_validate(item) for item in load_json_file("cases.json")]
```

Create `backend/api/social.py`:

```python
from typing import Any

from fastapi import APIRouter

from services.data_loader import load_json_file


router = APIRouter(prefix="/api", tags=["social"])


@router.get("/social")
def get_social() -> dict[str, Any]:
    return load_json_file("social.json")
```

- [ ] **Step 7: Add inquiries route**

Create `backend/api/inquiries.py`:

```python
from fastapi import APIRouter

from schemas.inquiry import InquiryRequest, InquiryResponse


router = APIRouter(prefix="/api", tags=["inquiries"])


@router.post("/inquiries", response_model=InquiryResponse)
def create_inquiry(payload: InquiryRequest) -> InquiryResponse:
    return InquiryResponse(success=True, message="Inquiry received")
```

- [ ] **Step 8: Add FastAPI app**

Create `backend/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.cases import router as cases_router
from api.health import router as health_router
from api.inquiries import router as inquiries_router
from api.products import router as products_router
from api.site_config import router as site_config_router
from api.social import router as social_router


app = FastAPI(title="Henlixo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(site_config_router)
app.include_router(products_router)
app.include_router(cases_router)
app.include_router(social_router)
app.include_router(inquiries_router)
```

- [ ] **Step 9: Run backend tests to verify GREEN**

Run:

```powershell
Set-Location .\backend
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m pytest tests\test_api_contracts.py -q
```

Expected: PASS.

- [ ] **Step 10: Manually verify backend server**

Run:

```powershell
Set-Location .\backend
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

In a second terminal:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/health -UseBasicParsing
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/products -UseBasicParsing
```

Expected: health returns `200`, products returns JSON containing `HL-PG-LV-STD`.

---

### Task 4: Scaffold React Frontend and API Client

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/src/test/setup.ts`
- Create: `frontend/src/types/product.ts`
- Create: `frontend/src/types/case.ts`
- Create: `frontend/src/types/site.ts`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/products.ts`
- Create: `frontend/src/api/cases.ts`
- Create: `frontend/src/api/siteConfig.ts`
- Create: `frontend/src/api/social.ts`
- Create: `frontend/src/api/inquiries.ts`
- Test: `frontend/src/test/api.test.ts`

- [ ] **Step 1: Create frontend package manifest**

Create `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5173",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4173",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.7",
    "typescript": "^5.7.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Add Vite and TypeScript config**

Create `frontend/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Henlixo Outdoor Structures</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

Create `frontend/vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
});
```

Create `frontend/vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `frontend/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Write failing API client tests**

Create `frontend/src/test/api.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchProduct, fetchProducts } from '../api/products';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('product API client', () => {
  it('loads products from the FastAPI endpoint', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ sku: 'HL-PG-LV-STD', family: 'Pergola' }],
    }));

    const products = await fetchProducts();

    expect(fetch).toHaveBeenCalledWith('/api/products');
    expect(products[0].sku).toBe('HL-PG-LV-STD');
  });

  it('loads one product by SKU', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sku: 'HL-MSR-PC', family: 'Sunroom' }),
    }));

    const product = await fetchProduct('HL-MSR-PC');

    expect(fetch).toHaveBeenCalledWith('/api/products/HL-MSR-PC');
    expect(product.family).toBe('Sunroom');
  });

  it('throws a useful error when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));

    await expect(fetchProducts()).rejects.toThrow('API request failed: /api/products');
  });
});
```

- [ ] **Step 4: Run frontend tests to verify RED**

Run:

```powershell
Set-Location .\frontend
npm install
npm run test -- src/test/api.test.ts
```

Expected: FAIL because API client files do not exist.

- [ ] **Step 5: Add shared frontend types**

Create `frontend/src/types/product.ts`:

```ts
export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  sku: string;
  name: string;
  family: 'Pergola' | 'Sunroom' | 'Railing' | 'Accessories';
  subType: string;
  application: string[];
  tier: string;
  featured: boolean;
  tagline: string;
  intro: string;
  image: string;
  imageFallback: string;
  specs: ProductSpec[];
  features: string[];
  accessories: string[];
  leadTime: string;
  moq: string;
  ctaLabel: string;
};
```

Create `frontend/src/types/case.ts`:

```ts
export type ApplicationScenario = {
  id: string;
  kind: 'application-scenario';
  title: string;
  audience: string;
  summary: string;
  image: string;
  imageFallback: string;
  recommendedProducts: string[];
  keyPoints: string[];
};
```

Create `frontend/src/types/site.ts`:

```ts
export type SiteConfig = {
  brand: {
    name: string;
    logoMark: string;
    tagline: string;
  };
  contact: {
    emailMain: string;
    phone: string;
    phoneRaw: string;
    address: string;
    alibabaUrl: string;
  };
  certifications: string[];
};

export type SocialPayload = {
  channels: Array<{ name: string; url: string }>;
  items: Array<{ title: string; image: string; url: string }>;
};
```

- [ ] **Step 6: Add API client files**

Create `frontend/src/api/client.ts`:

```ts
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }
  return response.json() as Promise<TResponse>;
}
```

Create `frontend/src/api/products.ts`:

```ts
import { apiGet } from './client';
import type { Product } from '../types/product';

export function fetchProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/api/products');
}

export function fetchProduct(sku: string): Promise<Product> {
  return apiGet<Product>(`/api/products/${sku}`);
}
```

Create `frontend/src/api/cases.ts`:

```ts
import { apiGet } from './client';
import type { ApplicationScenario } from '../types/case';

export function fetchCases(): Promise<ApplicationScenario[]> {
  return apiGet<ApplicationScenario[]>('/api/cases');
}
```

Create `frontend/src/api/siteConfig.ts`:

```ts
import { apiGet } from './client';
import type { SiteConfig } from '../types/site';

export function fetchSiteConfig(): Promise<SiteConfig> {
  return apiGet<SiteConfig>('/api/site-config');
}
```

Create `frontend/src/api/social.ts`:

```ts
import { apiGet } from './client';
import type { SocialPayload } from '../types/site';

export function fetchSocial(): Promise<SocialPayload> {
  return apiGet<SocialPayload>('/api/social');
}
```

Create `frontend/src/api/inquiries.ts`:

```ts
import { apiPost } from './client';

export type InquiryPayload = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  customerType: string;
  productInterest: string;
  projectSize?: string;
  message: string;
};

export type InquiryResponse = {
  success: boolean;
  message: string;
};

export function sendInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  return apiPost<InquiryResponse, InquiryPayload>('/api/inquiries', payload);
}
```

- [ ] **Step 7: Run API client tests to verify GREEN**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/api.test.ts
```

Expected: PASS.

---

### Task 5: Add Frontend Theme, Routing, Layout

**Files:**
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/styles/theme.css`
- Create: `frontend/src/styles/globals.css`
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/Footer.tsx`
- Create: `frontend/src/pages/HomePage.tsx`
- Create: `frontend/src/pages/CatalogPage.tsx`
- Create: `frontend/src/pages/CasesPage.tsx`

- [ ] **Step 1: Add theme CSS**

Create `frontend/src/styles/theme.css`:

```css
:root {
  --ink: #1a1a1a;
  --ink-soft: #3a3a3a;
  --muted: #6b6b6b;
  --line: #d8d4cc;
  --line-soft: #ebe7df;
  --bg: #f5f2ec;
  --bg-alt: #ebe6db;
  --card: #ffffff;
  --charcoal: #171716;
  --brass: #a07c3d;
  --brass-light: #c69e5a;
  --serif: Georgia, "Times New Roman", serif;
  --sans: "Inter Tight", "Segoe UI", Arial, sans-serif;
}
```

Create `frontend/src/styles/globals.css`:

```css
@import './theme.css';

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

.wrap {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.eyebrow {
  color: var(--brass);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.serif {
  font-family: var(--serif);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  min-height: 46px;
  padding: 0 22px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.btn-primary {
  background: var(--ink);
  color: var(--bg);
}

.btn-brass {
  background: var(--brass);
  border-color: var(--brass);
  color: #fff;
}

@media (max-width: 760px) {
  .wrap {
    width: min(100% - 32px, 1180px);
  }
}
```

- [ ] **Step 2: Add layout components**

Create `frontend/src/components/layout/Header.tsx`:

```tsx
import type { SiteConfig } from '../../types/site';

type HeaderProps = {
  siteConfig: SiteConfig | null;
};

export function Header({ siteConfig }: HeaderProps) {
  const brand = siteConfig?.brand.name ?? 'Henlixo';
  const logoMark = siteConfig?.brand.logoMark ?? 'H';
  const phoneRaw = siteConfig?.contact.phoneRaw ?? '';
  const alibabaUrl = siteConfig?.contact.alibabaUrl ?? '#';
  const whatsappUrl = phoneRaw ? `https://api.whatsapp.com/send?phone=${phoneRaw}` : '#';

  return (
    <header className="site-header">
      <a className="brand" href="/">
        <span className="brand-mark">{logoMark}</span>
        <span>{brand}</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="/#products">Products</a>
        <a href="/cases">Cases</a>
        <a href="/#factory">Factory</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <a className="header-link" href={alibabaUrl} target="_blank" rel="noreferrer">Alibaba</a>
        <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </header>
  );
}
```

Create `frontend/src/components/layout/Footer.tsx`:

```tsx
import type { SiteConfig } from '../../types/site';

type FooterProps = {
  siteConfig: SiteConfig | null;
};

export function Footer({ siteConfig }: FooterProps) {
  const brand = siteConfig?.brand.name ?? 'Henlixo';
  const email = siteConfig?.contact.emailMain ?? 'info@your-domain.com';
  const address = siteConfig?.contact.address ?? 'Foshan, Guangdong, China';

  return (
    <footer className="site-footer">
      <div>
        <strong>{brand}</strong>
        <p>Customized aluminum pergolas and outdoor structure solutions.</p>
      </div>
      <div>
        <a href={`mailto:${email}`}>{email}</a>
        <span>{address}</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add routing without extra dependency**

Create `frontend/src/pages/HomePage.tsx`:

```tsx
export function HomePage() {
  return <main><div className="wrap">Home page loading...</div></main>;
}
```

Create `frontend/src/pages/CatalogPage.tsx`:

```tsx
export function CatalogPage() {
  return <main><div className="wrap">Catalog page loading...</div></main>;
}
```

Create `frontend/src/pages/CasesPage.tsx`:

```tsx
export function CasesPage() {
  return <main><div className="wrap">Cases page loading...</div></main>;
}
```

Create `frontend/src/App.tsx`:

```tsx
import { useEffect, useState } from 'react';

import { fetchSiteConfig } from './api/siteConfig';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { CasesPage } from './pages/CasesPage';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import type { SiteConfig } from './types/site';

function routeForPath(pathname: string) {
  if (pathname.startsWith('/catalog')) return <CatalogPage />;
  if (pathname.startsWith('/cases')) return <CasesPage />;
  return <HomePage />;
}

export function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetchSiteConfig().then(setSiteConfig).catch(() => setSiteConfig(null));
  }, []);

  return (
    <>
      <Header siteConfig={siteConfig} />
      {routeForPath(window.location.pathname)}
      <Footer siteConfig={siteConfig} />
    </>
  );
}
```

Create `frontend/src/main.tsx`:

```tsx
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(<App />);
```

- [ ] **Step 4: Add layout CSS**

Append to `frontend/src/styles/globals.css`:

```css
.site-header,
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 22px 36px;
  border-bottom: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--serif);
  font-size: 20px;
}

.main-nav,
.header-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.main-nav a,
.header-link {
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.site-footer {
  align-items: flex-start;
  background: var(--charcoal);
  color: #eee8dd;
  border-bottom: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer p,
.site-footer span {
  color: #a09b8e;
}

.site-footer div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 860px) {
  .site-header,
  .site-footer,
  .main-nav,
  .header-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 5: Run frontend build**

Run:

```powershell
Set-Location .\frontend
npm run build
```

Expected: PASS with Vite build output.

---

### Task 6: Build Home Page Components

**Files:**
- Modify: `frontend/src/pages/HomePage.tsx`
- Create: `frontend/src/components/home/Hero.tsx`
- Create: `frontend/src/components/home/ProductFamilies.tsx`
- Create: `frontend/src/components/home/FeaturedProducts.tsx`
- Create: `frontend/src/components/home/ScenarioPreview.tsx`
- Create: `frontend/src/components/home/FactoryProof.tsx`
- Create: `frontend/src/components/home/SocialPreview.tsx`
- Create: `frontend/src/components/home/ContactSection.tsx`
- Test: `frontend/src/test/home.test.tsx`

- [ ] **Step 1: Write failing home page test**

Create `frontend/src/test/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Hero } from '../components/home/Hero';
import { ProductFamilies } from '../components/home/ProductFamilies';

describe('home page sections', () => {
  it('renders Henlixo hero positioning and primary CTA', () => {
    render(<Hero />);

    expect(screen.getByText(/Customized Aluminum Pergolas/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request Quote/i })).toHaveAttribute('href', '#contact');
  });

  it('renders the four confirmed product families', () => {
    render(<ProductFamilies />);

    expect(screen.getByText('Aluminum Pergolas')).toBeInTheDocument();
    expect(screen.getByText('Sunrooms & Mobile Enclosures')).toBeInTheDocument();
    expect(screen.getByText('Railing & Fence Systems')).toBeInTheDocument();
    expect(screen.getByText('Accessories & Add-ons')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/home.test.tsx
```

Expected: FAIL because home components do not exist.

- [ ] **Step 3: Add Hero component**

Create `frontend/src/components/home/Hero.tsx`:

```tsx
export function Hero() {
  return (
    <section className="hero-section">
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">Customized Outdoor Architecture</div>
          <h1 className="serif">Customized Aluminum Pergolas & Outdoor Structures</h1>
          <p>
            Henlixo provides bioclimatic aluminum pergolas, sunrooms, railing systems and outdoor enclosure
            solutions for gardens, hotels, resorts, restaurants and commercial outdoor projects.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Request Quote</a>
            <a className="btn" href="/catalog">View Products</a>
            <a className="btn btn-brass" href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Outdoor structure visual">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80" alt="Premium outdoor terrace with aluminum structure" />
        </div>
      </div>
      <div className="wrap trust-bar">
        {['CE Certified', '6063-T5 Aluminum', '25-35 Days Lead Time', '1 Set MOQ', '10-Year Coating Warranty', 'Foshan Factory'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add ProductFamilies component**

Create `frontend/src/components/home/ProductFamilies.tsx`:

```tsx
const families = [
  {
    title: 'Aluminum Pergolas',
    text: 'Bioclimatic motorized louvered pergolas, manual flip-louver pergolas and heavy-duty project-grade systems.',
    href: '/catalog?family=Pergola',
  },
  {
    title: 'Sunrooms & Mobile Enclosures',
    text: '120-series aluminum sunrooms and mobile retractable PC enclosures for year-round commercial outdoor spaces.',
    href: '/catalog?family=Sunroom',
  },
  {
    title: 'Railing & Fence Systems',
    text: 'Aluminum railing and pool fence systems for villas, hotels, real estate and landscape projects.',
    href: '/catalog?family=Railing',
  },
  {
    title: 'Accessories & Add-ons',
    text: 'Windproof curtains, LED lighting, sensors, side screens, sliding glass doors and smart control modules.',
    href: '/catalog?family=Accessories',
  },
];

export function ProductFamilies() {
  return (
    <section className="product-family-section" id="products">
      <div className="wrap section-head">
        <div>
          <div className="eyebrow">Product Families</div>
          <h2 className="serif">Four product families for complete outdoor spaces.</h2>
        </div>
        <p>Start with the system type, then move into SKU-level configuration.</p>
      </div>
      <div className="wrap family-grid">
        {families.map((family, index) => (
          <a className={`family-card ${index === 0 ? 'featured-family' : ''}`} href={family.href} key={family.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3 className="serif">{family.title}</h3>
            <p>{family.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add remaining home components**

Create `frontend/src/components/home/FeaturedProducts.tsx`:

```tsx
import type { Product } from '../../types/product';

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.filter((product) => product.featured).slice(0, 6);

  return (
    <section className="featured-products-section">
      <div className="wrap section-head">
        <div>
          <div className="eyebrow">Featured SKU</div>
          <h2 className="serif">Core Henlixo systems for project buyers.</h2>
        </div>
        <a href="/catalog">View Complete Catalog</a>
      </div>
      <div className="wrap product-card-grid">
        {featured.map((product) => (
          <article className="product-card" key={product.sku}>
            <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = product.imageFallback; }} />
            <div>
              <span>{product.sku}</span>
              <h3 className="serif">{product.name}</h3>
              <p>{product.tagline}</p>
              <a href={`/catalog?sku=${product.sku}`}>View Details</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `frontend/src/components/home/ScenarioPreview.tsx`:

```tsx
import type { ApplicationScenario } from '../../types/case';

type ScenarioPreviewProps = {
  scenarios: ApplicationScenario[];
};

export function ScenarioPreview({ scenarios }: ScenarioPreviewProps) {
  return (
    <section className="scenario-preview-section">
      <div className="wrap section-head">
        <div>
          <div className="eyebrow">Applications</div>
          <h2 className="serif">Configured around real outdoor project scenarios.</h2>
        </div>
        <a href="/cases">Explore Scenarios</a>
      </div>
      <div className="wrap scenario-grid">
        {scenarios.slice(0, 4).map((scenario) => (
          <article className="scenario-card" key={scenario.id}>
            <img src={scenario.image} alt={scenario.title} onError={(event) => { event.currentTarget.src = scenario.imageFallback; }} />
            <h3 className="serif">{scenario.title}</h3>
            <p>{scenario.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `frontend/src/components/home/FactoryProof.tsx`:

```tsx
export function FactoryProof() {
  return (
    <section className="factory-proof-section" id="factory">
      <div className="wrap factory-grid">
        <div>
          <div className="eyebrow">Factory & Compliance</div>
          <h2 className="serif">Foshan aluminum supply chain, project-grade quality control.</h2>
          <p>Henlixo is based in Foshan, Guangdong, with 6063-T5 aluminum systems, fluorocarbon 3-coat finish, CE certification and documented coating warranty support.</p>
        </div>
        <div className="proof-list">
          {['8 quality control steps', 'CE certificate available', '2026 fluorocarbon coating report', '24-month product warranty', '10-year coating warranty'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Create `frontend/src/components/home/SocialPreview.tsx`:

```tsx
import type { SocialPayload } from '../../types/site';

type SocialPreviewProps = {
  social: SocialPayload | null;
};

export function SocialPreview({ social }: SocialPreviewProps) {
  if (!social) return null;

  return (
    <section className="social-preview-section">
      <div className="wrap section-head">
        <div>
          <div className="eyebrow">Inspiration Feed</div>
          <h2 className="serif">Outdoor structure ideas for social channels.</h2>
        </div>
        <div className="social-links">
          {social.channels.map((channel) => (
            <a href={channel.url} target="_blank" rel="noreferrer" key={channel.name}>{channel.name}</a>
          ))}
        </div>
      </div>
      <div className="wrap social-grid">
        {social.items.map((item) => (
          <a href={item.url} target="_blank" rel="noreferrer" key={item.title}>
            <img src={item.image} alt={item.title} />
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
```

Create `frontend/src/components/home/ContactSection.tsx`:

```tsx
export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <div className="eyebrow">Begin a Project</div>
          <h2 className="serif">Tell us what you want to build outdoors.</h2>
          <p>Share your project type, size, country and preferred product line. Henlixo will recommend the right configuration.</p>
          <a className="btn btn-brass" href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">WhatsApp Direct</a>
        </div>
        <form className="inquiry-form">
          <input name="name" placeholder="Name" />
          <input name="email" placeholder="Email" />
          <input name="country" placeholder="Country / Region" />
          <textarea name="message" placeholder="Project size, quantity, timeline..." />
          <button className="btn btn-primary" type="submit">Request Quote</button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire HomePage data**

Modify `frontend/src/pages/HomePage.tsx`:

```tsx
import { useEffect, useState } from 'react';

import { fetchCases } from '../api/cases';
import { fetchProducts } from '../api/products';
import { fetchSocial } from '../api/social';
import { ContactSection } from '../components/home/ContactSection';
import { FactoryProof } from '../components/home/FactoryProof';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { Hero } from '../components/home/Hero';
import { ProductFamilies } from '../components/home/ProductFamilies';
import { ScenarioPreview } from '../components/home/ScenarioPreview';
import { SocialPreview } from '../components/home/SocialPreview';
import type { ApplicationScenario } from '../types/case';
import type { Product } from '../types/product';
import type { SocialPayload } from '../types/site';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scenarios, setScenarios] = useState<ApplicationScenario[]>([]);
  const [social, setSocial] = useState<SocialPayload | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
    fetchCases().then(setScenarios).catch(() => setScenarios([]));
    fetchSocial().then(setSocial).catch(() => setSocial(null));
  }, []);

  return (
    <main>
      <Hero />
      <ProductFamilies />
      <FeaturedProducts products={products} />
      <ScenarioPreview scenarios={scenarios} />
      <FactoryProof />
      <SocialPreview social={social} />
      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 7: Add home CSS**

Append focused section CSS to `frontend/src/styles/globals.css`. Keep class names from the components:

```css
.hero-section,
.product-family-section,
.featured-products-section,
.scenario-preview-section,
.factory-proof-section,
.social-preview-section,
.contact-section {
  padding: 96px 0;
  border-bottom: 1px solid var(--line);
}

.hero-grid,
.factory-grid,
.contact-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}

.hero-section h1,
.section-head h2,
.factory-proof-section h2,
.contact-section h2 {
  margin: 14px 0 20px;
  font-size: clamp(40px, 6vw, 78px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
}

.hero-section p,
.section-head p,
.factory-proof-section p,
.contact-section p {
  color: var(--ink-soft);
  font-size: 17px;
  font-weight: 300;
}

.hero-actions,
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-visual img,
.product-card img,
.scenario-card img,
.social-grid img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-visual {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--bg-alt);
}

.trust-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 34px;
  color: var(--brass);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 34px;
}

.family-grid,
.product-card-grid,
.scenario-grid,
.social-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.family-card,
.product-card,
.scenario-card {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 24px;
}

.featured-family {
  grid-column: span 2;
  background: var(--charcoal);
  color: #eee8dd;
}

.product-card,
.scenario-card,
.social-grid a {
  padding: 0;
  overflow: hidden;
}

.product-card img,
.scenario-card img,
.social-grid img {
  aspect-ratio: 4 / 5;
}

.product-card div,
.scenario-card h3,
.scenario-card p,
.social-grid span {
  padding: 18px;
}

.factory-proof-section,
.contact-section {
  background: var(--charcoal);
  color: #eee8dd;
}

.proof-list {
  display: grid;
  gap: 12px;
}

.proof-list span {
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 16px;
}

.inquiry-form {
  display: grid;
  gap: 12px;
}

.inquiry-form input,
.inquiry-form textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  padding: 14px;
}

.inquiry-form textarea {
  min-height: 120px;
}

@media (max-width: 960px) {
  .hero-grid,
  .factory-grid,
  .contact-grid,
  .section-head {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .family-grid,
  .product-card-grid,
  .scenario-grid,
  .social-grid {
    grid-template-columns: 1fr;
  }

  .featured-family {
    grid-column: span 1;
  }
}
```

- [ ] **Step 8: Run home tests and build**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/home.test.tsx
npm run build
```

Expected: PASS.

---

### Task 7: Build Catalog Page

**Files:**
- Modify: `frontend/src/pages/CatalogPage.tsx`
- Create: `frontend/src/components/catalog/CatalogFilters.tsx`
- Create: `frontend/src/components/catalog/ProductGrid.tsx`
- Create: `frontend/src/components/catalog/ProductModal.tsx`
- Test: `frontend/src/test/catalog.test.tsx`

- [ ] **Step 1: Write failing catalog tests**

Create `frontend/src/test/catalog.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { ProductGrid } from '../components/catalog/ProductGrid';
import type { Product } from '../types/product';

const products: Product[] = [
  {
    sku: 'HL-PG-LV-STD',
    name: 'Standard Pergola',
    family: 'Pergola',
    subType: 'Motorized Louvered',
    application: ['Villa'],
    tier: 'Standard',
    featured: true,
    tagline: 'Main pergola SKU',
    intro: 'Intro',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    specs: [],
    features: [],
    accessories: [],
    leadTime: '25-30 days',
    moq: '1 set',
    ctaLabel: 'Inquire',
  },
  {
    sku: 'HL-MSR-PC',
    name: 'Mobile Sunroom',
    family: 'Sunroom',
    subType: 'Mobile',
    application: ['Restaurant'],
    tier: 'Premium',
    featured: true,
    tagline: 'Mobile enclosure',
    intro: 'Intro',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    specs: [],
    features: [],
    accessories: [],
    leadTime: '35 days',
    moq: '1 set',
    ctaLabel: 'Inquire',
  },
];

describe('catalog components', () => {
  it('renders family filter options', () => {
    render(<CatalogFilters family="All" search="" onFamilyChange={() => undefined} onSearchChange={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Pergola' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sunroom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Railing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accessories' })).toBeInTheDocument();
  });

  it('renders product cards and notifies selection', () => {
    let selectedSku = '';
    render(<ProductGrid products={products} onSelect={(product) => { selectedSku = product.sku; }} />);

    fireEvent.click(screen.getByRole('button', { name: /View details for Standard Pergola/i }));

    expect(selectedSku).toBe('HL-PG-LV-STD');
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/catalog.test.tsx
```

Expected: FAIL because catalog components do not exist.

- [ ] **Step 3: Add CatalogFilters**

Create `frontend/src/components/catalog/CatalogFilters.tsx`:

```tsx
import type { Product } from '../../types/product';

type FamilyFilter = Product['family'] | 'All';

type CatalogFiltersProps = {
  family: FamilyFilter;
  search: string;
  onFamilyChange: (family: FamilyFilter) => void;
  onSearchChange: (value: string) => void;
};

const families: FamilyFilter[] = ['All', 'Pergola', 'Sunroom', 'Railing', 'Accessories'];

export function CatalogFilters({ family, search, onFamilyChange, onSearchChange }: CatalogFiltersProps) {
  return (
    <div className="catalog-filters">
      <input value={search} placeholder="Search SKU, product, application..." onChange={(event) => onSearchChange(event.target.value)} />
      <div>
        {families.map((item) => (
          <button className={family === item ? 'active' : ''} type="button" onClick={() => onFamilyChange(item)} key={item}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add ProductGrid and ProductModal**

Create `frontend/src/components/catalog/ProductGrid.tsx`:

```tsx
import type { Product } from '../../types/product';

type ProductGridProps = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <article className="catalog-product-card" key={product.sku}>
          <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = product.imageFallback; }} />
          <div>
            <span>{product.sku}</span>
            <h3 className="serif">{product.name}</h3>
            <p>{product.tagline}</p>
            <button type="button" onClick={() => onSelect(product)} aria-label={`View details for ${product.name}`}>
              View Details
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
```

Create `frontend/src/components/catalog/ProductModal.tsx`:

```tsx
import type { Product } from '../../types/product';

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const whatsappText = encodeURIComponent(`Hello, I am interested in ${product.name} (${product.sku}). Please send pricing and specifications.`);

  return (
    <div className="product-modal" role="dialog" aria-modal="true">
      <div className="product-modal-card">
        <button type="button" className="modal-close" onClick={onClose}>Close</button>
        <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = product.imageFallback; }} />
        <div>
          <span>{product.sku}</span>
          <h2 className="serif">{product.name}</h2>
          <p>{product.intro}</p>
          <h3>Specifications</h3>
          <dl>
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <h3>Features</h3>
          <ul>
            {product.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <div className="modal-actions">
            <a className="btn btn-primary" href={`https://api.whatsapp.com/send?phone=8615925638060&text=${whatsappText}`} target="_blank" rel="noreferrer">
              WhatsApp This Product
            </a>
            <a className="btn" href="#contact">Send Inquiry</a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Wire CatalogPage**

Modify `frontend/src/pages/CatalogPage.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';

import { fetchProducts } from '../api/products';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductModal } from '../components/catalog/ProductModal';
import type { Product } from '../types/product';

type FamilyFilter = Product['family'] | 'All';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [family, setFamily] = useState<FamilyFilter>('All');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((product) => {
      const matchesFamily = family === 'All' || product.family === family;
      const haystack = [product.sku, product.name, product.family, product.subType, product.tagline, product.application.join(' ')].join(' ').toLowerCase();
      return matchesFamily && haystack.includes(q);
    });
  }, [products, family, search]);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="wrap">
          <div className="eyebrow">Product Catalog</div>
          <h1 className="serif">Henlixo product systems and SKU details.</h1>
        </div>
      </section>
      <section className="wrap">
        <CatalogFilters family={family} search={search} onFamilyChange={setFamily} onSearchChange={setSearch} />
        <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
```

- [ ] **Step 6: Add catalog CSS**

Append to `frontend/src/styles/globals.css`:

```css
.catalog-hero {
  padding: 78px 0;
  border-bottom: 1px solid var(--line);
}

.catalog-hero h1 {
  max-width: 760px;
  margin: 14px 0 0;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 1;
}

.catalog-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 28px 0;
}

.catalog-filters input {
  min-height: 44px;
  width: min(420px, 100%);
  border: 1px solid var(--line);
  background: var(--card);
  padding: 0 14px;
}

.catalog-filters div,
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.catalog-filters button,
.catalog-product-card button,
.modal-close {
  border: 1px solid var(--line);
  background: var(--card);
  cursor: pointer;
  padding: 10px 14px;
}

.catalog-filters button.active {
  background: var(--ink);
  color: var(--bg);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  padding-bottom: 86px;
}

.catalog-product-card {
  background: var(--card);
  border: 1px solid var(--line);
}

.catalog-product-card img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.catalog-product-card div {
  padding: 20px;
}

.product-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.55);
  padding: 28px;
}

.product-modal-card {
  display: grid;
  grid-template-columns: 0.85fr 1fr;
  width: min(980px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: var(--bg);
}

.product-modal-card > img {
  width: 100%;
  height: 100%;
  min-height: 520px;
  object-fit: cover;
}

.product-modal-card > div {
  padding: 34px;
}

.product-modal dl div {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  padding: 10px 0;
}

@media (max-width: 920px) {
  .catalog-filters,
  .product-modal-card {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run catalog tests and build**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/catalog.test.tsx
npm run build
```

Expected: PASS.

---

### Task 8: Build Cases Page

**Files:**
- Modify: `frontend/src/pages/CasesPage.tsx`
- Create: `frontend/src/components/cases/ScenarioGrid.tsx`
- Test: `frontend/src/test/cases.test.tsx`

- [ ] **Step 1: Write failing cases test**

Create `frontend/src/test/cases.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScenarioGrid } from '../components/cases/ScenarioGrid';
import type { ApplicationScenario } from '../types/case';

const scenarios: ApplicationScenario[] = [
  {
    id: 'hotel-resort-terraces',
    kind: 'application-scenario',
    title: 'Hotel & Resort Terraces',
    audience: 'Hotels and resorts',
    summary: 'Outdoor hospitality spaces',
    image: 'image.jpg',
    imageFallback: 'fallback.jpg',
    recommendedProducts: ['HL-PG-LV-HD'],
    keyPoints: ['Heavy-duty structures'],
  },
];

describe('ScenarioGrid', () => {
  it('renders application scenario cards without fake project labels', () => {
    render(<ScenarioGrid scenarios={scenarios} />);

    expect(screen.getByText('Hotel & Resort Terraces')).toBeInTheDocument();
    expect(screen.getByText('HL-PG-LV-HD')).toBeInTheDocument();
    expect(screen.queryByText(/client project/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/cases.test.tsx
```

Expected: FAIL because `ScenarioGrid` does not exist.

- [ ] **Step 3: Add ScenarioGrid**

Create `frontend/src/components/cases/ScenarioGrid.tsx`:

```tsx
import type { ApplicationScenario } from '../../types/case';

type ScenarioGridProps = {
  scenarios: ApplicationScenario[];
};

export function ScenarioGrid({ scenarios }: ScenarioGridProps) {
  return (
    <div className="cases-grid">
      {scenarios.map((scenario) => (
        <article className="case-card" key={scenario.id}>
          <img src={scenario.image} alt={scenario.title} onError={(event) => { event.currentTarget.src = scenario.imageFallback; }} />
          <div>
            <span>{scenario.audience}</span>
            <h2 className="serif">{scenario.title}</h2>
            <p>{scenario.summary}</p>
            <ul>
              {scenario.keyPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <div className="related-products">
              {scenario.recommendedProducts.map((sku) => <span key={sku}>{sku}</span>)}
            </div>
            <a className="btn btn-primary" href="/catalog">View Related Products</a>
          </div>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire CasesPage**

Modify `frontend/src/pages/CasesPage.tsx`:

```tsx
import { useEffect, useState } from 'react';

import { fetchCases } from '../api/cases';
import { ScenarioGrid } from '../components/cases/ScenarioGrid';
import type { ApplicationScenario } from '../types/case';

export function CasesPage() {
  const [scenarios, setScenarios] = useState<ApplicationScenario[]>([]);

  useEffect(() => {
    fetchCases().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  return (
    <main className="cases-page">
      <section className="cases-hero">
        <div className="wrap">
          <div className="eyebrow">Application Scenarios</div>
          <h1 className="serif">Outdoor structure solutions by application.</h1>
          <p>From hotel terraces and restaurant patios to villa gardens, pool enclosures and rooftop lounges, Henlixo systems are configured around real project scenarios.</p>
        </div>
      </section>
      <section className="wrap cases-section">
        <ScenarioGrid scenarios={scenarios} />
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add cases CSS**

Append to `frontend/src/styles/globals.css`:

```css
.cases-hero {
  padding: 88px 0;
  border-bottom: 1px solid var(--line);
}

.cases-hero h1 {
  max-width: 820px;
  margin: 14px 0 18px;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 1;
}

.cases-hero p {
  max-width: 720px;
  color: var(--ink-soft);
  font-size: 17px;
}

.cases-section {
  padding: 64px 0 96px;
}

.cases-grid {
  display: grid;
  gap: 28px;
}

.case-card {
  display: grid;
  grid-template-columns: 0.85fr 1fr;
  background: var(--card);
  border: 1px solid var(--line);
}

.case-card img {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
}

.case-card > div {
  padding: 34px;
}

.case-card span {
  color: var(--brass);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.related-products {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}

@media (max-width: 900px) {
  .case-card {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run cases tests and build**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/cases.test.tsx
npm run build
```

Expected: PASS.

---

### Task 9: Wire Inquiry Form Submission

**Files:**
- Modify: `frontend/src/components/home/ContactSection.tsx`
- Test: `frontend/src/test/home.test.tsx`

- [ ] **Step 1: Add failing inquiry submission test**

Append to `frontend/src/test/home.test.tsx`:

```tsx
import { fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ContactSection } from '../components/home/ContactSection';

it('submits inquiry payload and shows success', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Inquiry received' }),
  }));

  render(<ContactSection />);

  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Buyer' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Country / Region'), { target: { value: 'USA' } });
  fireEvent.change(screen.getByPlaceholderText('Project size, quantity, timeline...'), { target: { value: '12 pergolas' } });
  fireEvent.click(screen.getByRole('button', { name: 'Request Quote' }));

  await waitFor(() => {
    expect(screen.getByText(/contact you within 24 hours/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```powershell
Set-Location .\frontend
npm run test -- src/test/home.test.tsx
```

Expected: FAIL because `ContactSection` does not submit the form.

- [ ] **Step 3: Implement inquiry submission**

Replace `frontend/src/components/home/ContactSection.tsx` with:

```tsx
import { FormEvent, useState } from 'react';

import { sendInquiry } from '../../api/inquiries';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSection() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await sendInquiry({
        name: String(data.get('name') || ''),
        company: String(data.get('company') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
        country: String(data.get('country') || ''),
        customerType: String(data.get('customerType') || 'Other'),
        productInterest: String(data.get('productInterest') || 'Complete Outdoor Solution'),
        projectSize: String(data.get('projectSize') || ''),
        message: String(data.get('message') || ''),
      });
      setSubmitState('success');
      form.reset();
    } catch {
      setSubmitState('error');
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <div className="eyebrow">Begin a Project</div>
          <h2 className="serif">Tell us what you want to build outdoors.</h2>
          <p>Share your project type, size, country and preferred product line. Henlixo will recommend the right configuration.</p>
          <a className="btn btn-brass" href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">WhatsApp Direct</a>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" required />
          <input name="company" placeholder="Company" />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" placeholder="WhatsApp / Phone" />
          <input name="country" placeholder="Country / Region" />
          <select name="customerType" defaultValue="Hotel / Resort">
            <option>Hotel / Resort</option>
            <option>Dealer / Distributor</option>
            <option>Contractor</option>
            <option>Villa Owner</option>
            <option>Designer / Architect</option>
            <option>Other</option>
          </select>
          <select name="productInterest" defaultValue="Pergola">
            <option>Pergola</option>
            <option>Sunroom</option>
            <option>Railing</option>
            <option>Accessories</option>
            <option>Complete Outdoor Solution</option>
          </select>
          <input name="projectSize" placeholder="Project Size / Quantity" />
          <textarea name="message" placeholder="Project size, quantity, timeline..." required />
          <button className="btn btn-primary" type="submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? 'Sending...' : 'Request Quote'}
          </button>
          {submitState === 'success' && <p className="form-status">Thanks. Our project team will contact you within 24 hours.</p>}
          {submitState === 'error' && <p className="form-status">Submission failed. Please contact us via WhatsApp or email.</p>}
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Extend form CSS for selects and status**

Modify the existing form CSS selector in `frontend/src/styles/globals.css` so it includes `select`:

```css
.inquiry-form input,
.inquiry-form select,
.inquiry-form textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  padding: 14px;
}

.form-status {
  margin: 0;
  color: var(--brass-light);
}
```

- [ ] **Step 5: Run inquiry test and full frontend test suite**

Run:

```powershell
Set-Location .\frontend
npm run test
npm run build
```

Expected: PASS.

---

### Task 10: Final Integration Verification

**Files:**
- Modify: none unless verification reveals a failing issue in a previous task.

- [ ] **Step 1: Start backend**

Run:

```powershell
Set-Location .\backend
.\.venv\Scripts\python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Expected: FastAPI starts on `http://127.0.0.1:8000`.

- [ ] **Step 2: Start frontend**

Run in a second terminal:

```powershell
Set-Location .\frontend
npm run dev
```

Expected: Vite starts on `http://127.0.0.1:5173`.

- [ ] **Step 3: Verify backend endpoints**

Run in a third terminal:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/health -UseBasicParsing
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/products -UseBasicParsing
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/cases -UseBasicParsing
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/social -UseBasicParsing
```

Expected: all return `200`.

- [ ] **Step 4: Verify public pages in browser**

Open:

```text
http://127.0.0.1:5173/
http://127.0.0.1:5173/catalog
http://127.0.0.1:5173/cases
```

Expected:

- Home shows hero, product families, featured products, scenarios, factory proof, social preview, contact form.
- Catalog shows products and filters.
- Cases shows application scenarios.

- [ ] **Step 5: Verify responsive behavior**

Use browser dev tools at:

```text
390 x 844
768 x 1024
1440 x 900
```

Expected:

- Header does not overlap.
- Product cards stack cleanly on mobile.
- Modal content is scrollable on mobile.
- Contact form fields fit within viewport.
- Text does not overflow buttons or cards.

- [ ] **Step 6: Run automated checks**

Run:

```powershell
Set-Location .\backend
.\.venv\Scripts\python -m pytest -q

Set-Location ..\frontend
npm run test
npm run build
```

Expected: all pass.

- [ ] **Step 7: Final checkpoint**

Record:

```text
React + FastAPI first version implemented and verified:
- Home page
- Catalog page
- Cases page
- FastAPI JSON endpoints
- Inquiry API shell
- Premium native CSS style
```

