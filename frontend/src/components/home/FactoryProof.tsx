import { BadgeCheck, Boxes, Factory, ShieldCheck } from 'lucide-react';

const proofItems = [
  {
    icon: Factory,
    value: 'Foshan',
    label: 'Aluminum building materials cluster',
  },
  {
    icon: Boxes,
    value: '1 Set',
    label: 'MOQ for samples and project orders',
  },
  {
    icon: BadgeCheck,
    value: 'CE',
    label: 'Certificate available upon request',
  },
  {
    icon: ShieldCheck,
    value: '10 Years',
    label: 'Coating warranty support',
  },
];

export function FactoryProof() {
  return (
    <section className="factory-proof">
      <div className="wrap factory-grid">
        <div>
          <div className="eyebrow">Factory & Compliance</div>
          <h2>Project support from Foshan's aluminum supply chain.</h2>
          <p>
            Henlixo supports project drawings, size and color customization, accessory configuration,
            export packing and market-specific compliance confirmation.
          </p>
        </div>
        <div className="proof-grid">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.value}>
                <Icon size={22} />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
