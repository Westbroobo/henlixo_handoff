import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const families = [
  {
    title: 'Aluminum Pergolas',
    label: 'Main Product Family',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
    summary: 'Motorized louvered, reinforced, heavy-duty, manual flip-louver and classic pavilion structures.',
    products: 'HL-PG-LV-STD / MED / HD',
    primary: true,
  },
  {
    title: 'Sunrooms & Mobile Enclosures',
    label: 'Glass & PC Systems',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&q=80',
    summary: '120-series gable and flat-roof sunrooms plus mobile retractable PC enclosure systems.',
    products: 'HL-SR-120-GBL / FLT / HL-MSR-PC',
  },
  {
    title: 'Railing & Fence Systems',
    label: 'Outdoor Boundary',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1000&q=80',
    summary: 'Aluminum railing and pool fence systems for villas, balconies, hotels and public landscapes.',
    products: 'HL-RL-AL',
  },
  {
    title: 'Accessories & Add-ons',
    label: 'Upgrade Layer',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80',
    summary: 'Windproof curtains, rain sensors, LED lights, side screens, glass doors and control modules.',
    products: 'HL-ACC-WC / sensors / LED',
  },
];

export function ProductFamilies() {
  return (
    <section className="section product-families">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Four Product Families</div>
            <h2>Outdoor structure systems for project and channel buyers.</h2>
          </div>
          <p>
            Pergola stays visually dominant, while sunrooms, railing and accessories make Henlixo
            feel like a complete outdoor space supplier.
          </p>
        </div>
        <div className="family-grid">
          {families.map((family) => (
            <article className={family.primary ? 'family-card primary' : 'family-card'} key={family.title}>
              <img src={family.image} alt={family.title} />
              <div>
                <span>{family.label}</span>
                <h3>{family.title}</h3>
                <p>{family.summary}</p>
                <small>{family.products}</small>
                <Link to="/catalog" aria-label={`View ${family.title}`}>
                  View Catalog <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
