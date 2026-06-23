import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { orderItemSchema, type OrderItemFields } from '../../../types'
import styles from './order-form.module.css'

interface OrderFormProps {
  onAdd: (data: OrderItemFields) => void
}

export function OrderForm({ onAdd }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderItemFields>({ resolver: zodResolver(orderItemSchema) })

  const onSubmit = (data: OrderItemFields) => {
    onAdd(data)
    reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="product">Produto</label>
          <input
            id="product"
            className={`${styles.input} ${errors.product ? styles.inputError : ''}`}
            placeholder="Ex: Cerveja"
            {...register('product')}
          />
          {errors.product && <span className={styles.error}>{errors.product.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="quantity">Qtd.</label>
            <input
              id="quantity"
              className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
              type="number"
              min={1}
              placeholder="1"
              {...register('quantity')}
            />
            {errors.quantity && <span className={styles.error}>{errors.quantity.message}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="unitPrice">Preço unit.</label>
            <div className={styles.inputPrefix}>
              <span className={styles.prefix}>R$</span>
              <input
                id="unitPrice"
                className={`${styles.input} ${styles.inputWithPrefix} ${errors.unitPrice ? styles.inputError : ''}`}
                type="number"
                min={0.01}
                step={0.01}
                placeholder="0,00"
                {...register('unitPrice')}
              />
            </div>
            {errors.unitPrice && <span className={styles.error}>{errors.unitPrice.message}</span>}
          </div>
        </div>

      </div>

      <button type="submit" className={styles.submitBtn}>
        + Adicionar
      </button>
    </form>
  )
}
