//Стандартный 
import type {UserInterface} from "~/interfaces/user";
import type {BannerInterface} from "~/interfaces/banners";

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

//Интерфейс для получения ответа регистрации
export interface RegistrationResponse extends ApiResponse<AuthData | null> {

}

export interface AuthData<T = UserInterface> {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: T;
}

export interface BannersResponse extends ApiResponse<BannerInterface[] | null> {

}
