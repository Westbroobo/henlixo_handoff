import { MessageCircle, Send, X } from 'lucide-react';

import type { Product } from '../../types/product';

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) {
    return null;
  }

  const whatsappText = encodeURIComponent(
    `Hello, I am interested in ${product.name} (${product.sku}). Please send pricing and specifications.`,
  );

  return (
    <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="product-modal-card">
        <button type="button" className="modal-close icon-button" onClick={onClose} aria-label="Close product details">
          <X size={20} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = product.imageFallback;
          }}
        />
        <div className="modal-body">
          <span className="sku-label">{product.sku}</span>
          <h2 id="product-modal-title">{product.name}</h2>
          <p>{product.intro}</p>

          <dl className="spec-list">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h3>Features</h3>
          <ul>
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <h3>Accessories</h3>
          <div className="tag-list">
            {product.accessories.map((accessory) => (
              <span key={accessory}>{accessory}</span>
            ))}
          </div>

          <div className="modal-actions">
            <a className="btn btn-primary" href={`https://api.whatsapp.com/send?phone=8615925638060&text=${whatsappText}`} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> WhatsApp This Product
            </a>
            <a className="btn" href="/#contact">
              <Send size={17} /> Send Inquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
