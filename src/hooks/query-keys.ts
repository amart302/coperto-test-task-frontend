import type { DishCategory } from '../types/api'

export const queryKeys = {
  dishes: ['dishes'] as const,
  activeStopListRoot: ['stop-list', 'active'] as const,
  activeStopList: (category?: DishCategory) =>
    ['stop-list', 'active', category ?? 'all'] as const,
}
