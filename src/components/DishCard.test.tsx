import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Dish } from '../types/api'
import { DishCard } from './DishCard'

const dish: Dish = {
  id: 'borsch',
  name: 'Борщ',
  category: 'Кухня',
  price: 490,
}

describe('DishCard', () => {
  it('allows selecting an available dish', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<DishCard dish={dish} isStopped={false} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Поставить в стоп' }))

    expect(onSelect).toHaveBeenCalledWith(dish)
    expect(screen.getByText('В продаже')).toBeInTheDocument()
  })

  it('disables selecting a stopped dish', () => {
    render(<DishCard dish={dish} isStopped onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Уже в стопе' })).toBeDisabled()
    expect(screen.getByText('В стопе')).toBeInTheDocument()
  })
})
