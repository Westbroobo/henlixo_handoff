import { Eye } from 'lucide-react';

import type { Product } from '../../types/product';

type ProductGridProps = {
  products: Product[];
  onSelect: (product: Product) => void;
};

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="compact-state">
        No products match this filter. Try another family, scenario or SKU keyword.
      </div>
    );
  }

  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <article className="catalog-product-card" key={product.sku}>
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = product.imageFallback;
            }}
          />
          <div>
            <span>{product.sku}</span>
            <h3>{product.name}</h3>
            <p>{product.tagline}</p>
            <button type="button" onClick={() => onSelect(product)} aria-label={`View details for ${product.name}`}>
              <Eye size={15} /> View Details
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
