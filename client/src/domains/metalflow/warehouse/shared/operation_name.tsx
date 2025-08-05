import { DetailName } from 'domains/metalflow/details/name'
import { MaterialName } from 'domains/metalflow/materials/name'
import { observer } from 'mobx-react-lite'

interface Props {
  operation: {
    operation_type: number
    material_label?: string | null
    detail_name?: string | null
    material_id?: number | null
    detail_id?: number | null
  }
  showLinkButton?: boolean
}

export const OperationName = observer((props: Props) => {
  const { operation, showLinkButton } = props

  if (operation.material_label && operation.material_id) {
    return (
      <MaterialName
        materialLabel={operation.material_label}
        materialId={operation.material_id}
        withLink={showLinkButton}
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
        withLink
        withGroupLink
        withParamsButton
      />
    )
  }

  return <span>Неизвестный объект</span>
})
