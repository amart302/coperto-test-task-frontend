import { DISH_CATEGORIES, type DishCategory } from '../types/api'

interface CategoryFilterProps {
  value?: DishCategory
  onChange: (category?: DishCategory) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <nav
      className="category-filter"
      aria-label="Фильтр по категориям блюд"
    >
      <button type="button" aria-pressed={!value} onClick={() => onChange()}>
        Все
      </button>
      {DISH_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={value === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  )
}
