import { z } from 'zod'

export const orderItemSchema = z.object({
  product:   z.string().min(1, 'Informe o produto'),
  quantity:  z.coerce.number().int().min(1, 'Mínimo 1'),
  unitPrice: z.coerce.number().min(0.01, 'Informe o preço'),
})

export type OrderItemFields = z.infer<typeof orderItemSchema>
