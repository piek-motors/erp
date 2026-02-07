import { Row } from '@/lib/index'
import { DetailName } from '../detail/detail_name'
import type { Detail } from './group.store'

interface DetailRowProps {
  detail: Detail
  onToggle: (detailId: number) => void
}

export function DetailRow({
  detail,
  onToggle,
  isSelected,
}: DetailRowProps & { isSelected: boolean }) {
  return (
    <>
      {/* <ColorSegmentation detail={detail} /> */}
      <Row
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 0.5,
          mb: 0,
          backgroundColor: isSelected ? '#e7b6be' : 'transparent',
          '&:hover .detail-arrow': {
            opacity: 1,
          },
          cursor: detail.group_id === null ? 'pointer' : 'default',
        }}
        alignItems="center"
        onClick={() => detail.group_id === null && onToggle(detail.id)}
      >
        <DetailName
          sx={{ whiteSpace: 'wrap', width: 'auto', lineHeight: '1.2' }}
          detail={{
            id: detail.id,
            name: detail.name,
            group_id: detail.group_id || null,
          }}
        />
      </Row>
    </>
  )
}
