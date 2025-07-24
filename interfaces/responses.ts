//Стандартный 
export interface ApiResponse<T = any> {
    status: boolean;
    code: number;
    message: string | null;
    data: T | null;
    errors: (ApiError | string)[] | null;
}

interface ApiError {
    field?: string;
    message: string;
}