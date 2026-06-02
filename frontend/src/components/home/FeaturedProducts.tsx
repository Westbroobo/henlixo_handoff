import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Product } from '../../types/product';

type FeaturedProductsProps = {
  products: Product[];
  loadFailed: boolean;
};

export function FeaturedProducts({ products, loadFailed }: FeaturedProductsProps) {
  return (
    <section className="section featured-products">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Featured SKU</div>
            <h2>Six key products for the first inquiry conversation.</h2>
          </div>
          <Link className="inline-link" to="/catalog">
            Full Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {loadFailed ? (
          <div className="compact-state">
            Product data is temporarily unavailable.
            <a href="#contact"> Send an inquiry</a>
            <span> or </span>
            <a href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">
              contact WhatsApp
            </a>
            .
          </div>
        ) : (
          <div className="featured-grid">
            {products.map((product) => (
              <article className="product-card" key={product.sku}>
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
                  <a
                    href={`https://api.whatsapp.com/send?phone=8615925638060&text=${encodeURIComponent(
                      `Hello, I am interested in ${product.name} (${product.sku}). Please send pricing and specifications.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={15} /> {product.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
