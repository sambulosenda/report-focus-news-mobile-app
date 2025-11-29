export interface CategoryItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
}

export interface CategoriesResponse {
  categories: {
    nodes: CategoryItem[];
  };
}
