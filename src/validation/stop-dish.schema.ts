import { z } from 'zod'

export const stopDishSchema = z.object({
  reason: z
    .string()
    .refine((value) => value.trim().length >= 5, {
      message: 'Укажите причину длиной не менее 5 символов',
    })
    .refine((value) => value.trim().length <= 200, {
      message: 'Причина не должна превышать 200 символов',
    }),
  durationMinutes: z
    .number({ error: 'Укажите длительность в минутах' })
    .int('Введите целое количество минут')
    .min(15, 'Минимальная длительность — 15 минут')
    .max(720, 'Максимальная длительность — 720 минут'),
})

export type StopDishFormValues = z.infer<typeof stopDishSchema>
