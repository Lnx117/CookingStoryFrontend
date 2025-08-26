import type {UserInterface} from "~/interfaces/user";

export interface RecipeInterface {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string;
    preview_image: string | null;
    servings: number;
    cooking_time: number;
    calories_total: number | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    user: UserInterface;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface RecipePaginationData {
    current_page: number;
    data: RecipeInterface[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface RecipeListResponseInterface {
    status: boolean;
    code: number;
    message: string;
    data: RecipePaginationData;
    errors: any | null;
}