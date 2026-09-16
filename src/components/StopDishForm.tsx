import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiError } from '../api/client'
import { useStopDish } from '../hooks/useStopList'
import type { Dish } from '../types/api'
import {
  stopDishSchema,
  type StopDishFormValues,
} from '../validation/stop-dish.schema'

interface StopDishFormProps {
  dish: Dish | null
  onClose: () => void
}

export function StopDishForm({ dish, onClose }: StopDishFormProps) {
  const stopDishMutation = useStopDish()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<StopDishFormValues>({
    resolver: zodResolver(stopDishSchema),
    mode: 'onBlur',
    defaultValues: {
      reason: '',
      durationMinutes: 60,
    },
  })

  if (!dish) return null

  const closeForm = () => {
    reset()
    stopDishMutation.reset()
    onClose()
  }

  const submitForm = handleSubmit(async (values) => {
    try {
      await stopDishMutation.mutateAsync({
        dishId: dish.id,
        reason: values.reason.trim(),
        durationMinutes: values.durationMinutes,
      })
      closeForm()
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const reasonError = error.details?.reason?.[0]
        const durationError = error.details?.durationMinutes?.[0]

        if (reasonError) setError('reason', { message: reasonError })
        if (durationError) {
          setError('durationMinutes', { message: durationError })
        }

        if (!reasonError && !durationError) {
          setError('root.server', { message: error.message })
        }
        return
      }

      setError('root.server', {
        message: 'Не удалось поставить блюдо в стоп. Попробуйте ещё раз.',
      })
    }
  })

  return (
    <div className="stop-form-backdrop" role="presentation">
      <section
        className="stop-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-form-title"
      >
        <div className="stop-form__heading">
          <div>
            <p>Постановка в стоп</p>
            <h2 id="stop-form-title">{dish.name}</h2>
          </div>
          <button type="button" className="button-secondary" onClick={closeForm}>
            Закрыть
          </button>
        </div>

        <form onSubmit={(event) => void submitForm(event)} noValidate>
          <label htmlFor="stop-reason">Причина</label>
          <textarea
            id="stop-reason"
            rows={4}
            placeholder="Например, закончился основной ингредиент"
            aria-invalid={Boolean(errors.reason)}
            aria-describedby={errors.reason ? 'stop-reason-error' : undefined}
            {...register('reason')}
          />
          {errors.reason && (
            <p id="stop-reason-error" className="field-error">
              {errors.reason.message}
            </p>
          )}

          <label htmlFor="stop-duration">Длительность, минут</label>
          <input
            id="stop-duration"
            type="number"
            min={15}
            max={720}
            step={1}
            aria-invalid={Boolean(errors.durationMinutes)}
            aria-describedby={
              errors.durationMinutes ? 'stop-duration-error' : undefined
            }
            {...register('durationMinutes', { valueAsNumber: true })}
          />
          {errors.durationMinutes && (
            <p id="stop-duration-error" className="field-error">
              {errors.durationMinutes.message}
            </p>
          )}

          {errors.root?.server && (
            <p className="form-error" role="alert">
              {errors.root.server.message}
            </p>
          )}

          <div className="stop-form__actions">
            <button
              type="button"
              className="button-secondary"
              onClick={closeForm}
              disabled={stopDishMutation.isPending}
            >
              Отмена
            </button>
            <button type="submit" disabled={stopDishMutation.isPending}>
              {stopDishMutation.isPending && <span className="spinner" />}
              {stopDishMutation.isPending ? 'Ставим в стоп…' : 'Поставить в стоп'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
