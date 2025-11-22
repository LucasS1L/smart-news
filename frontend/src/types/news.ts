export interface NewsItemPost {
    title: string;
    text: string;
    author?: string;
    source?: string;
    date: string;
}
export interface NewsItem {
    id: number;
    title: string;
    text: string;
    author?: string;
    source?: string;
    date: string;
}

export interface SearchResponse {
    query: string;
    items: NewsItem[];
}