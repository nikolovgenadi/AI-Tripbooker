// Common types for the trip booking application

export interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  type: 'standalone' | 'addon';
  includes: string[];
  image: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
}

export interface Experience {
  slug: string;
  title: string;
  description: string;
  location: string;
  category: string;
  pricePerPerson: number;
  duration: string;
  image: string;
  teaser: string;
  tags: string[];
  details: {
    highlights: string[];
    included: string[];
    notIncluded: string[];
  };
}

export interface DataResponse {
  packages: Package[];
  articles: Article[];
  experiences: Experience[];
}
