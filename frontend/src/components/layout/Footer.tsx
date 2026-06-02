import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand-link footer-brand">
            <span className="brand-mark">H</span>
            <span>
              <strong>Henlixo</strong>
              <small>Customized Aluminum Outdoor Structures</small>
            </span>
          </div>
          <p>
            Bioclimatic aluminum pergolas, sunrooms, railing systems and outdoor enclosure solutions
            for hotels, villas, restaurants, dealers and commercial outdoor projects.
          </p>
        </div>
        <div>
          <h3>Products</h3>
          <Link to="/catalog">Aluminum Pergolas</Link>
          <Link to="/catalog">Sunrooms & Mobile Enclosures</Link>
          <Link to="/catalog">Railing & Fence Systems</Link>
          <Link to="/catalog">Accessories & Add-ons</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="mailto:info@your-domain.com">info@your-domain.com</a>
          <a href="tel:+8615925638060">+86 159-2563-8060</a>
          <a href="https://www.alibaba.com/" target="_blank" rel="noreferrer">
            Alibaba Store <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
