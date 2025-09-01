export type PropertyFilters = {
  userId?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  withinNeighborhood?: boolean;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  ageMax?: number;
  walkMax?: number;
  floorMin?: boolean;
  layouts?: string[];
  features?: string[];
  favoritesOnly?: boolean;
  inquiryOnly?: boolean;
};
