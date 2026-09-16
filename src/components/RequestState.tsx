import type { ReactNode } from 'react'

interface RequestStateProps {
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  children: ReactNode
}

export function RequestState({ isLoading, error, onRetry, children }: RequestStateProps) {
  if (isLoading) {
    return (
      <section className="request-state request-state--loading" aria-busy="true">
        <span className="sr-only" role="status">Загружаем данные…</span>
        <div className="skeleton skeleton--heading" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="request-state request-state--error" role="alert">
        <strong>Не удалось загрузить данные</strong>
        <p>{error.message}</p>
        <button type="button" onClick={onRetry}>Повторить</button>
      </section>
    )
  }

  return children
}
