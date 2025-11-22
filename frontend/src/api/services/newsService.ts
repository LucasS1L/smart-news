import { apiClient } from "../axios-config";
import type { AxiosResponse } from "axios";
import type { NewsItemPost, NewsItem, SearchResponse } from "../../types/news";

class NewsService {
    async createNews(newsItem: NewsItemPost): Promise<AxiosResponse<NewsItem>> {
        return await apiClient.instance.post("/news/", newsItem);
    }

    async updateNews(id: number, newsItem: Partial<NewsItemPost>): Promise<AxiosResponse<NewsItem>> {
        return await apiClient.instance.put(`/news/${id}`, newsItem);
    }

    async deleteNews(id: number): Promise<AxiosResponse> {
        return await apiClient.instance.delete(`/news/${id}`);
    }

    async listNews(): Promise<AxiosResponse<NewsItem[]>> {
        return await apiClient.instance.get("/news/");
    }

    async getNews(id: number): Promise<AxiosResponse<NewsItem>> {
        return await apiClient.instance.get(`/news/${id}`);
    }

    async searchNews(query: string, topK: number = 5): Promise<AxiosResponse<SearchResponse>> {
        return await apiClient.instance.get("/search", {
            params: { q: query, top_k: topK }
        });
    }
}

export const newsService = new NewsService();