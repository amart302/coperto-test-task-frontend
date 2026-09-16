import type { Dish } from '../types/api'

interface DishCardProps {
  dish: Dish
  isStopped: boolean
  onSelect: (dish: Dish) => void
}

export function DishCard({ dish, isStopped, onSelect }: DishCardProps) {
  return (
    <article className={`dish-card${isStopped ? ' dish-card--stopped' : ''}`}>
      <div>
        <div className="dish-card__meta">
          <span>{dish.category}</span>
          <span
            className={`status-badge status-badge--${isStopped ? 'stopped' : 'available'}`}
          >
            {isStopped ? 'В стопе' : 'В продаже'}
          </span>
        </div>
        <h3>{dish.name}</h3>
        <p>{dish.price.toLocaleString('ru-RU')} ₽</p>
      </div>
      <button
        type="button"
        disabled={isStopped}
        onClick={() => onSelect(dish)}
      >
        {isStopped ? 'Уже в стопе' : 'Поставить в стоп'}
      </button>
    </article>
  )
}
