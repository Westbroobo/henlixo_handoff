import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchProducts } from '../api/products';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import type { FamilyFilter } from '../components/catalog/CatalogFilters';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductModal } from '../components/catalog/ProductModal';
import type { Product } from '../types/product';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const initialScenario = searchParams.get('scenario') ?? 'All';
  const [products, setProducts] = useState<Product[]>([]);
  const [family, setFamily] = useState<FamilyFilter>('All');
  const [scenario, setScenario] = useState(initialScenario);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then((items) => {
        setProducts(items);
        setLoadFailed(false);
      })
      .catch(() => {
        setProducts([]);
        setLoadFailed(true);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesFamily = family === 'All' || product.family === family;
      const matchesScenario =
        scenario === 'All' ||
        product.application.some((item) => item.toLowerCase().includes(scenario.toLowerCase()));
      const haystack = [
        product.sku,
        product.name,
        product.family,
        product.subType,
        product.tier,
        product.tagline,
        product.application.join(' '),
        product.features.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return matchesFamily && matchesScenario && haystack.includes(q);
    });
  }, [family, products, scenario, search]);

  return (
    <main className="catalog-page">
      <section className="subpage-hero catalog-hero">
        <div className="wrap">
          <div className="eyebrow">Product Catalog</div>
          <h1>Henlixo product systems and SKU details.</h1>
          <p>Search all 11 Henlixo SKUs by family, application scenario, product name or technical keyword.</p>
        </div>
      </section>
      <section className="wrap catalog-section">
        <CatalogFilters
          family={family}
          scenario={scenario}
          search={search}
          onFamilyChange={setFamily}
          onScenarioChange={setScenario}
          onSearchChange={setSearch}
        />
        {loadFailed && (
          <div className="compact-state">
            Product data is temporarily unavailable.
            <a href="/#contact"> Send an inquiry</a>
            <span> or </span>
            <a href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">
              contact WhatsApp
            </a>
            .
          </div>
        )}
        {!loadFailed && <ProductGrid products={filteredProducts} onSelect={setSelectedProduct} />}
      </section>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
