export interface AuthUser {
    id: number;
    email: string;
}

interface AuthResponse {
    user: AuthUser;
}

const API_URL = process.env

export async function login(
    email: string,
    password: string,
): Promise<AuthUser> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    const data = (await response.json()) as AuthResponse;

    return data.user;
}

export async function logout(): Promise<void> {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to logout");
    }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Unable to check authentication");
    }

    const data = (await response.json()) as AuthResponse;

    return data.user;
}