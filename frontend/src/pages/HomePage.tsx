import { useEffect, useMemo, useState } from 'react';

import { fetchCases } from '../api/cases';
import { fetchProducts } from '../api/products';
import { fetchSiteConfig } from '../api/siteConfig';
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
import type { SiteConfig, SocialPayload } from '../types/site';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productError, setProductError] = useState(false);
  const [scenarios, setScenarios] = useState<ApplicationScenario[]>([]);
  const [social, setSocial] = useState<SocialPayload | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetchSiteConfig().then(setSiteConfig).catch(() => setSiteConfig(null));
    fetchProducts().then(setProducts).catch(() => setProductError(true));
    fetchCases().then(setScenarios).catch(() => setScenarios([]));
    fetchSocial().then(setSocial).catch(() => setSocial(null));
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured).slice(0, 6),
    [products],
  );

  return (
    <main>
      <Hero trustItems={siteConfig?.certifications ?? []} />
      <ProductFamilies />
      <FeaturedProducts products={featuredProducts} loadFailed={productError} />
      <ScenarioPreview scenarios={scenarios} />
      <FactoryProof />
      <SocialPreview social={social} />
      <ContactSection />
    </main>
  );
}
