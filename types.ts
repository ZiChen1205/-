
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceType: 'Authority' | 'Social';
  url: string;
  date: string;
  category: string;
  keyPoints: string[];
  expertPerspective: string;
}

export interface NewsState {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}
