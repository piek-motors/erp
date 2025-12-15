import { DetailName } from 'domains/pdo/detail/name'
import { MaterialName } from 'domains/pdo/material/name'
import { observer } from 'mobx-react-lite'

interface Props {
  operation: {
    operation_type: number
    material_label?: string | null
    detail_name?: string | null
    material_id?: number | null
    detail_id?: number | null
  }
}

export const OperationName = observer((props: Props) => {
  const { operation } = props

  if (operation.material_label && operation.material_id) {
    return (
      <MaterialName
        materialLabel={operation.material_label}
        materialId={operation.material_id}
      />
    )
  }

  if (operation.detail_name && operation.detail_id) {
    return (
      <DetailName
        detail={{
          id: operation.detail_id,
          name: operation.detail_name,
          group_id: null // We don't have group_id in operations, so defaulting to null
        }}
        withGroupName
      />
    )
  }

  return <span>Неизвестный объект</span>
})
