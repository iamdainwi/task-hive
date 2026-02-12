const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function backendFetch(
    path: string,
    options: RequestInit & { token?: string } = {}
) {
    const { token, headers, ...rest } = options;

    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...rest,
    });

    const data = await res.json();

    if (!res.ok) {
        return { error: data.message || data.error || "Something went wrong", status: res.status };
    }

    return { data, status: res.status };
}
