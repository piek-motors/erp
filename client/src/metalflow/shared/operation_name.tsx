/** @jsxImportSource @emotion/react */
import { DetailName } from 'metalflow/details/name'
import { observer } from 'mobx-react-lite'
import { MaterialName } from './name'

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

  if (operation.material_label) {
    return (
      <MaterialName
        materialLabel={operation.material_label}
        materialId={operation.material_id || undefined}
        showLinkButton={showLinkButton}
      />
    )
  }

  if (operation.detail_name) {
    return (
      <DetailName
        detail={{
          id: operation.detail_id || 0,
          name: operation.detail_name,
          group_id: null // We don't have group_id in operations, so defaulting to null
        }}
        showLinkButton={showLinkButton}
      />
    )
  }

  return <span>Неизвестный объект</span>
})
