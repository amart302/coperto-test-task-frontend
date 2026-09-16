import type {
  ApiErrorBody,
  ApiErrorResponse,
  ApiSuccess,
  ValidationDetails,
} from '../types/api'

const DEFAULT_API_URL = 'http://localhost:3001'

const apiUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
  /\/$/,
  '',
)

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: ValidationDetails

  constructor(status: number, error: ApiErrorBody) {
    super(error.message)
    this.name = 'ApiError'
    this.status = status
    this.code = error.code
    this.details = error.details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value) || value.success !== false || !isRecord(value.error)) {
    return false
  }

  return (
    typeof value.error.code === 'string' &&
    typeof value.error.message === 'string'
  )
}

function isApiSuccess<T>(value: unknown): value is ApiSuccess<T> {
  return isRecord(value) && value.success === true && 'data' in value
}

function invalidResponseError(status: number): ApiError {
  return new ApiError(status, {
    code: 'INVALID_API_RESPONSE',
    message: 'Сервер вернул некорректный ответ',
  })
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, {
      code: 'NETWORK_ERROR',
      message: 'Не удалось подключиться к серверу',
    })
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw invalidResponseError(response.status)
  }

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiError(response.status, payload.error)
    }

    throw invalidResponseError(response.status)
  }

  if (!isApiSuccess<T>(payload)) {
    throw invalidResponseError(response.status)
  }

  return payload.data
}
