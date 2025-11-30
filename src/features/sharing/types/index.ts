export interface ShareableArticle {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  url: string;
  categoryName?: string;
  authorName?: string;
}

export type ShareMode = 'link' | 'image';
