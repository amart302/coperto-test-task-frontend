import { useQuery } from '@tanstack/react-query'
import { getDishes } from '../api/stop-list.api'
import { queryKeys } from './query-keys'

const FIVE_MINUTES = 5 * 60 * 1000

export function useDishes() {
  return useQuery({
    queryKey: queryKeys.dishes,
    queryFn: getDishes,
    staleTime: FIVE_MINUTES,
  })
}
