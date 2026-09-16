export const DISH_CATEGORIES = ['Кухня', 'Бар', 'Десерты'] as const

export type DishCategory = (typeof DISH_CATEGORIES)[number]

export interface Dish {
  id: string
  name: string
  category: DishCategory
  price: number
}

export type StopListStatus = 'active' | 'returned' | 'expired'

export interface StopListEntry {
  id: string
  dishId: string
  reason: string
  stoppedAt: string
  expiresAt: string
  returnedAt: string | null
}

export interface StopListEntryView extends StopListEntry {
  dish: Dish
  status: StopListStatus
  minutesLeft: number
}

export interface CreateStopEntryInput {
  dishId: string
  reason: string
  durationMinutes: number
}

export interface Pagination {
  total: number
  limit: number
  offset: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface PaginatedApiSuccess<T> extends ApiSuccess<T[]> {
  pagination: Pagination
}

export type ValidationDetails = Record<string, string[]>

export interface ApiErrorBody {
  code: string
  message: string
  details?: ValidationDetails
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorBody
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse

export type DishesResponse = ApiSuccess<Dish[]>
export type ActiveStopListResponse = ApiSuccess<StopListEntryView[]>
export type StopListMutationResponse = ApiSuccess<StopListEntryView>
export type StopListHistoryResponse = PaginatedApiSuccess<StopListEntryView>
