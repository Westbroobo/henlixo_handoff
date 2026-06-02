import { ArrowUpRight } from 'lucide-react';

import type { SocialPayload } from '../../types/site';

type SocialPreviewProps = {
  social: SocialPayload | null;
};

export function SocialPreview({ social }: SocialPreviewProps) {
  if (!social || social.items.length === 0) {
    return null;
  }

  return (
    <section className="section social-preview">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Social Inspiration</div>
            <h2>Visual proof points for product discovery and social traffic.</h2>
          </div>
          <div className="channel-links">
            {social.channels.map((channel) => (
              <a key={channel.name} href={channel.url} target="_blank" rel="noreferrer">
                {channel.name}
              </a>
            ))}
          </div>
        </div>
        <div className="social-grid">
          {social.items.map((item) => (
            <a key={item.title} href={item.url} target="_blank" rel="noreferrer">
              <img src={item.image} alt={item.title} />
              <span>
                {item.title} <ArrowUpRight size={15} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
