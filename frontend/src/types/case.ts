export type ApplicationScenario = {
  id: string;
  kind: 'application-scenario';
  title: string;
  audience: string;
  summary: string;
  image: string;
  imageFallback: string;
  recommendedProducts: string[];
  keyPoints: string[];
};
