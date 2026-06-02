export type ProductFamily = 'Pergola' | 'Sunroom' | 'Railing' | 'Accessories';

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  sku: string;
  name: string;
  family: ProductFamily;
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
