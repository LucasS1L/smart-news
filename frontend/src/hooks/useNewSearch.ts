import { useState, useEffect, useCallback } from 'react';
import type { NewsItem } from '../types/news';
import type { AxiosError } from 'axios';
import {newsService} from "../api/services/newsService.ts";

interface UseNewsSearchReturn {
    news: NewsItem[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    hasSearched: boolean;
    deleteNews: (id: number) => Promise<void>;
}

export const useNewsSearch = (debounceMs: number = 500): UseNewsSearchReturn => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, debounceMs]);

    const searchNews = useCallback(async () => {
        if (!debouncedQuery.trim()) {
            setNews([]);
            setHasSearched(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setHasSearched(true);

            const response = await newsService.searchNews(debouncedQuery, 10);
            setNews(response.data.items);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message || 'Erro ao buscar notícias');
            console.error('Erro ao buscar notícias:', err);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        searchNews();
    }, [searchNews]);

    const deleteNews = async (id: number) => {
        try {
            await newsService.deleteNews(id);
            setNews(prevNews => prevNews.filter(item => item.id !== id));
        } catch (err) {
            const axiosError = err as AxiosError;
            throw new Error(axiosError.message || 'Erro ao excluir notícia');
        }
    };

    return {
        news,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        hasSearched,
        deleteNews,
    };
};