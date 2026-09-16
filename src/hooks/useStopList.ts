import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getActiveStopList,
  returnDish,
  stopDish,
} from '../api/stop-list.api'
import type { DishCategory } from '../types/api'
import { queryKeys } from './query-keys'

export function useActiveStopList(category?: DishCategory) {
  return useQuery({
    queryKey: queryKeys.activeStopList(category),
    queryFn: () => getActiveStopList(category),
    refetchInterval: 60_000,
  })
}

export function useStopDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: stopDish,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.activeStopListRoot,
      })
    },
  })
}

export function useReturnDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: returnDish,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.activeStopListRoot,
      })
    },
  })
}
