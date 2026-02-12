export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: boolean;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export interface ApiError {
    message?: string;
    error?: string;
}
