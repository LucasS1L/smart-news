import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import {newsService} from "../api/services/newsService.ts";

export interface NewsItem {
    id: number;
    title: string;
    text: string;
    author?: string;
    source?: string;
    date: string;
}

interface UseNewsReturn {
    news: NewsItem[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    deleteNews: (id: number) => Promise<void>;
}

export const useNews = (): UseNewsReturn => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await newsService.listNews();
            setNews(response.data);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message || 'Erro ao carregar notícias');
            console.error('Erro ao buscar notícias:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteNews = async (id: number) => {
        try {
            await newsService.deleteNews(id);
            setNews(prevNews => prevNews.filter(item => item.id !== id));
        } catch (err) {
            const axiosError = err as AxiosError;
            throw new Error(axiosError.message || 'Erro ao excluir notícia');
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return {
        news,
        loading,
        error,
        refetch: fetchNews,
        deleteNews,
    };
};