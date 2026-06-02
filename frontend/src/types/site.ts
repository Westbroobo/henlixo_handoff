export type SiteConfig = {
  brand: {
    name: string;
    logoMark: string;
    tagline: string;
  };
  contact: {
    emailMain: string;
    phone: string;
    phoneRaw: string;
    address: string;
    alibabaUrl: string;
  };
  certifications: string[];
};

export type SocialPayload = {
  channels: Array<{
    name: string;
    url: string;
  }>;
  items: Array<{
    title: string;
    image: string;
    url: string;
  }>;
};
