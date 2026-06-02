import { ArrowRight, Grid3X3, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type HeroProps = {
  trustItems: string[];
};

const fallbackTrustItems = [
  'CE Certified',
  '6063-T5 Aluminum',
  '25-35 Days Lead Time',
  '1 Set MOQ',
  '10-Year Coating Warranty',
  'Foshan Factory',
];

export function Hero({ trustItems }: HeroProps) {
  const items = trustItems.length > 0 ? trustItems : fallbackTrustItems;

  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="wrap hero-content">
        <div className="eyebrow">Henlixo Outdoor Structures</div>
        <h1>Customized Aluminum Pergolas & Outdoor Structures</h1>
        <p>
          Bioclimatic aluminum pergolas, sunrooms, railing systems and outdoor enclosure solutions
          for hotels, villas, resorts, restaurants and commercial projects.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#contact">
            Request Quote <ArrowRight size={17} />
          </a>
          <Link className="btn btn-light" to="/catalog">
            <Grid3X3 size={17} /> View Products
          </Link>
          <a
            className="btn btn-ghost-light"
            href="https://api.whatsapp.com/send?phone=8615925638060&text=Hello,%20I%20am%20interested%20in%20Henlixo%20outdoor%20structures"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="hero-trust" aria-label="Henlixo trust signals">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
