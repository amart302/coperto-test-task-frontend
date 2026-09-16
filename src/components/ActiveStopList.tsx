import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../hooks/query-keys'
import type { StopListEntryView } from '../types/api'
import { StopListCard } from './StopListCard'

interface ActiveStopListProps {
  entries: StopListEntryView[]
  now: number
}

export function ActiveStopList({ entries, now }: ActiveStopListProps) {
  const queryClient = useQueryClient()
  const activeEntries = entries.filter(
    (entry) => new Date(entry.expiresAt).getTime() > now,
  )
  const expiredEntryIds = entries
    .filter((entry) => new Date(entry.expiresAt).getTime() <= now)
    .map((entry) => entry.id)
    .join(',')

  useEffect(() => {
    if (!expiredEntryIds) return

    void queryClient.invalidateQueries({
      queryKey: queryKeys.activeStopListRoot,
    })
  }, [expiredEntryIds, queryClient])

  return (
    <section aria-labelledby="stop-list-title">
      <div className="section-heading">
        <div><p>Сейчас недоступно</p><h2 id="stop-list-title">Активный стоп-лист</h2></div>
        <span>{activeEntries.length}</span>
      </div>
      {activeEntries.length === 0 ? (
        <div className="empty-state" role="status">
          <strong>Все блюда в продаже</strong>
          <p>Активных позиций в стоп-листе нет.</p>
        </div>
      ) : (
        <div className="stop-list">
          {activeEntries.map((entry) => (
            <StopListCard key={entry.id} entry={entry} now={now} />
          ))}
        </div>
      )}
    </section>
  )
}
