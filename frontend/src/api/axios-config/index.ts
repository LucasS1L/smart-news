import axios, {type AxiosError, type AxiosInstance} from "axios";
import { toast } from 'react-toastify';
import type {ApiErrorResponse} from "../types/api.ts";


const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

class ApiClient {
    private readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: { "Content-Type": "application/json" },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
    
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiErrorResponse>) => {
                this.handleError(error);
                return Promise.reject(error);
            }
        );
    }
    private handleError(error: AxiosError<ApiErrorResponse>) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message ||
                error.response.data?.detail ||
                'Erro desconhecido';

            switch (status) {
                case 400:
                    toast.error(`Requisição inválida: ${message}`);
                    break;
                case 404:
                    toast.error("Recurso não encontrado.");
                    break;
                case 500:
                    toast.error("Erro no servidor. Tente novamente mais tarde.");
                    break;
                default:
                    toast.error(message);
            }
        } else if (error.request) {
            toast.error("Sem conexão com o servidor. Verifique sua internet.");
        } else {
            toast.error("Erro inesperado. Tente novamente.");
        }
    }

    get instance() {
        return this.api;
    }
}

export const apiClient = new ApiClient();