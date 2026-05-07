const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type ApiErrorResponse = {
  message?: string | string[];
};

function getErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const errorData = data as ApiErrorResponse;

    if (Array.isArray(errorData.message)) {
      return errorData.message.join(", ");
    }

    if (typeof errorData.message === "string") {
      return errorData.message;
    }
  }

  return "Something went wrong";
}

export async function apiRequest<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as TResponse;
}
