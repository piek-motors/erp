import { DetailName } from 'domains/pdo/detail/name'
import { MaterialName } from 'domains/pdo/material/name'
import { observer } from 'mobx-react-lite'

interface Props {
  operation: {
    operation_type: number
    material_label?: string | null
    detail_name?: string | null
    detail_group_id?: number | null
    material_id?: number | null
    detail_id?: number | null
  }
}

export const OperationName = observer((props: Props) => {
  const { operation: op } = props

  if (op.material_label && op.material_id) {
    return (
      <MaterialName
        materialLabel={op.material_label}
        materialId={op.material_id}
      />
    )
  }

  if (op.detail_name && op.detail_id) {
    return (
      <DetailName
        detail={{
          id: op.detail_id,
          name: op.detail_name,
          group_id: op.detail_group_id!
        }}
        withGroupName
      />
    )
  }

  return <span>Неизвестный объект</span>
})
