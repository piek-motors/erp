import { Row } from 'lib/index'
import { DetailName } from '../detail/name'
import { Detail } from './group.store'

interface DetailRowProps {
  detail: Detail
  onToggle: (detailId: number) => void
}

export function DetailRow({
  detail,
  onToggle,
  isSelected
}: DetailRowProps & { isSelected: boolean }) {
  return (
    <Row
      sx={{
        alignItems: 'center',
        display: 'flex',
        p: 0,
        mb: 0,
        backgroundColor: isSelected ? '#fac3cc' : 'transparent',
        '&:hover .detail-arrow': {
          opacity: 1
        }
      }}
    >
      <Row
        sx={{ cursor: detail.group_id === null ? 'pointer' : 'default' }}
        alignItems="center"
        onClick={() => detail.group_id === null && onToggle(detail.id)}
      >
        <DetailName
          detail={{
            id: detail.id,
            name: detail.name,
            group_id: detail.group_id || null
          }}
          withLink
          withParamsButton
        />
      </Row>
    </Row>
  )
}
