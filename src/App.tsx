import { useState } from 'react'
import { ActiveStopList } from './components/ActiveStopList'
import { CategoryFilter } from './components/CategoryFilter'
import { DishList } from './components/DishList'
import { Header } from './components/Header'
import { RequestState } from './components/RequestState'
import { StopDishForm } from './components/StopDishForm'
import { useDishes } from './hooks/useDishes'
import { useCountdownClock } from './hooks/useCountdown'
import { useActiveStopList } from './hooks/useStopList'
import type { Dish, DishCategory } from './types/api'
import './App.css'

function App() {
  const [category, setCategory] = useState<DishCategory | undefined>()
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const now = useCountdownClock()
  const dishesQuery = useDishes()
  const stopListQuery = useActiveStopList(category)

  const visibleDishes =
    dishesQuery.data?.filter((dish) => !category || dish.category === category) ??
    []
  const stoppedDishIds = new Set(
    stopListQuery.data
      ?.filter((entry) => new Date(entry.expiresAt).getTime() > now)
      .map((entry) => entry.dishId) ?? [],
  )
  const pageError = dishesQuery.error ?? stopListQuery.error
  const isPageLoading = dishesQuery.isPending || stopListQuery.isPending

  const retryPageData = () => {
    void Promise.all([dishesQuery.refetch(), stopListQuery.refetch()])
  }

  const changeCategory = (nextCategory?: DishCategory) => {
    setCategory(nextCategory)
    setSelectedDish(null)
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <CategoryFilter value={category} onChange={changeCategory} />
        <div className="dashboard-grid">
          <RequestState
            isLoading={isPageLoading}
            error={pageError}
            onRetry={retryPageData}
          >
            <DishList
              dishes={visibleDishes}
              stoppedDishIds={stoppedDishIds}
              onSelect={setSelectedDish}
            />
          </RequestState>
          <RequestState
            isLoading={stopListQuery.isPending}
            error={stopListQuery.error}
            onRetry={() => void stopListQuery.refetch()}
          >
            <ActiveStopList entries={stopListQuery.data ?? []} now={now} />
          </RequestState>
        </div>
        <StopDishForm dish={selectedDish} onClose={() => setSelectedDish(null)} />
      </main>
    </div>
  )
}

export default App
