import { apiRequest } from './client'
import type {
  CreateStopEntryInput,
  Dish,
  DishCategory,
  StopListEntryView,
} from '../types/api'

export function getDishes(): Promise<Dish[]> {
  return apiRequest<Dish[]>('/api/dishes')
}

export function getActiveStopList(
  category?: DishCategory,
): Promise<StopListEntryView[]> {
  const searchParams = new URLSearchParams()

  if (category) {
    searchParams.set('category', category)
  }

  const query = searchParams.toString()
  const path = `/api/stop-list${query ? `?${query}` : ''}`

  return apiRequest<StopListEntryView[]>(path)
}

export function stopDish(
  input: CreateStopEntryInput,
): Promise<StopListEntryView> {
  return apiRequest<StopListEntryView>('/api/stop-list', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function returnDish(id: string): Promise<StopListEntryView> {
  return apiRequest<StopListEntryView>(
    `/api/stop-list/${encodeURIComponent(id)}/return`,
    { method: 'PATCH' },
  )
}
