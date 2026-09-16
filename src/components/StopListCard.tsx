import { ApiError } from '../api/client'
import {
  formatCountdown,
  getRemainingMilliseconds,
} from '../hooks/useCountdown'
import { useReturnDish } from '../hooks/useStopList'
import type { StopListEntryView } from '../types/api'

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
})

interface StopListCardProps {
  entry: StopListEntryView
  now: number
}

function getReturnErrorMessage(error: Error | null): string | null {
  if (!error) return null

  if (error instanceof ApiError) {
    if (error.code === 'STOP_LIST_ENTRY_NOT_ACTIVE') {
      return 'Запись уже завершена. Обновите список.'
    }

    if (error.code === 'STOP_LIST_ENTRY_NOT_FOUND') {
      return 'Запись не найдена. Обновите список.'
    }
  }

  return error.message || 'Не удалось вернуть блюдо в продажу.'
}

export function StopListCard({ entry, now }: StopListCardProps) {
  const returnMutation = useReturnDish()
  const errorMessage = getReturnErrorMessage(returnMutation.error)
  const countdown = formatCountdown(
    getRemainingMilliseconds(entry.expiresAt, now),
  )

  return (
    <article className="stop-list-card">
      <div className="stop-list-card__content">
        <div className="stop-list-card__meta">
          <span>{entry.dish.category}</span>
          <strong aria-label={`До возврата ${countdown}`}>{countdown}</strong>
        </div>
        <h3>{entry.dish.name}</h3>
        <p>{entry.reason}</p>
        <p className="stop-list-card__expires">
          Вернётся в{' '}
          <time dateTime={entry.expiresAt}>
            {timeFormatter.format(new Date(entry.expiresAt))}
          </time>
        </p>
        {errorMessage && (
          <p className="card-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => returnMutation.mutate(entry.id)}
        disabled={returnMutation.isPending}
      >
        {returnMutation.isPending && <span className="spinner" />}
        {returnMutation.isPending ? 'Возвращаем…' : 'Вернуть в продажу'}
      </button>
    </article>
  )
}
