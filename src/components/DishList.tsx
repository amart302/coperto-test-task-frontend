import type { Dish } from '../types/api'
import { DishCard } from './DishCard'

interface DishListProps {
  dishes: Dish[]
  stoppedDishIds: ReadonlySet<string>
  onSelect: (dish: Dish) => void
}

export function DishList({
  dishes,
  stoppedDishIds,
  onSelect,
}: DishListProps) {
  return (
    <section aria-labelledby="dishes-title">
      <div className="section-heading">
        <div><p>Меню</p><h2 id="dishes-title">Все блюда</h2></div>
        <span>{dishes.length}</span>
      </div>
      {dishes.length === 0 ? (
        <div className="empty-state" role="status">
          <strong>В этой категории пока нет блюд</strong>
          <p>Выберите другую категорию.</p>
        </div>
      ) : (
        <div className="dish-list">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              isStopped={stoppedDishIds.has(dish.id)}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}
