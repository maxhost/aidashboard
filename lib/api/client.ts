const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://pulsor-eta.vercel.app/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

type ApiInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  token?: string | null;
};

export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders });
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${res.status}`;
    throw new ApiError(res.status, body, message);
  }
  return body as T;
}
