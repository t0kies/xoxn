'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

// Row label for every nav array (header levels and footer): "3: blog".
export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{ link?: { label?: string | null } }>()
  const label = data?.link?.label
  return <div>{label ? `${rowNumber !== undefined ? rowNumber + 1 : ''}: ${label}` : 'Row'}</div>
}
