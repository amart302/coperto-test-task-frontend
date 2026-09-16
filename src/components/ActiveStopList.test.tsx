import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StopListEntryView } from '../types/api'
import { ActiveStopList } from './ActiveStopList'

const entry: StopListEntryView = {
  id: 'entry-1',
  dishId: 'borsch',
  reason: 'Нет ингредиента',
  stoppedAt: '2026-09-16T12:00:00.000Z',
  expiresAt: '2026-09-16T13:00:00.000Z',
  returnedAt: null,
  status: 'active',
  minutesLeft: 60,
  dish: {
    id: 'borsch',
    name: 'Борщ',
    category: 'Кухня',
    price: 490,
  },
}

function renderStopList(now: number) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ActiveStopList entries={[entry]} now={now} />
    </QueryClientProvider>,
  )
}

describe('ActiveStopList', () => {
  it('renders an active entry before its expiration', () => {
    renderStopList(new Date('2026-09-16T12:30:00.000Z').getTime())

    expect(screen.getByText('Борщ')).toBeInTheDocument()
  })

  it('removes an entry at the exact expiration moment', () => {
    renderStopList(new Date(entry.expiresAt).getTime())

    expect(screen.queryByText('Борщ')).not.toBeInTheDocument()
    expect(screen.getByText('Все блюда в продаже')).toBeInTheDocument()
  })
})
