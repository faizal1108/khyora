import { getFirebaseAuth } from '@/services/firebase/config';

const API_BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getIdToken(): Promise<string> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new ApiError('Authentication required', 401);
  }
  return user.getIdToken();
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> {
  if (!API_BASE) {
    throw new ApiError('API URL is not configured', 500);
  }

  const token = await getIdToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.json ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload.error === 'string'
        ? payload.error
        : response.status === 413
          ? 'Image is too large. Please select an image below 5 MB.'
          : response.status === 401
            ? 'Authentication required'
            : response.status === 403
              ? 'Not authorized'
              : response.status === 404
                ? 'Scan not found'
                : 'Unable to complete request';
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
