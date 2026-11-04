import { tokenStorage } from "./token";
import { ApiError } from "./errors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
  } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // JWTを付与
  if (auth) {
    const token = tokenStorage.get();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const response = await fetch(
    url,
    {
      method,
      headers,
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined,
    }
  );

  // レスポンスの取得
  const text = await response.text();

  const data = text
    ? JSON.parse(text)
    : null;

  // HTTPエラー
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data,
      `API request failed: ${response.status}`
    );
  }

  return data as T;
}

export const apiClient = {
  get<T>(endpoint: string, auth = true) {
    return request<T>(endpoint, {
      method: "GET",
      auth,
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    auth = true
  ) {
    return request<T>(endpoint, {
      method: "POST",
      body,
      auth,
    });
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    auth = true
  ) {
    return request<T>(endpoint, {
      method: "PATCH",
      body,
      auth,
    });
  },

  delete<T>(endpoint: string, auth = true) {
    return request<T>(endpoint, {
      method: "DELETE",
      auth,
    });
  },
};
