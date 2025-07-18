import { Checkbox } from '@mui/joy'
import { Row } from 'lib/index'
import { DetailName } from '../name'
import { Detail } from './store'

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
        '&:hover .detail-arrow': {
          opacity: 1
        }
      }}
    >
      {detail.group_id == null ? (
        <Checkbox
          size="sm"
          variant="outlined"
          checked={isSelected}
          onChange={() => onToggle(detail.id)}
          onClick={e => e.stopPropagation()}
        />
      ) : null}
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
          withGroupLink
          withParamsButton
        />
      </Row>
    </Row>
  )
}
