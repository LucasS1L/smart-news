export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    detail?: string;
}