/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Input } from 'lib/index'
import { observer } from 'mobx-react-lite'

export const border = '1px solid #7c7c7c'

export const tableStyles = css({
  whiteSpace: 'normal',
  tableLayout: 'initial',
  width: '100%',
  borderCollapse: 'collapse',
  border,
  th: {
    border,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'normal',
    padding: '5px'
  },
  td: {
    padding: '10px 5px',
    fontSize: 12,
    border
  }
})

export const CellInput = observer(
  (props: { value: string; onChange: (v: string) => void }) => (
    <Input
      size="sm"
      sx={{ width: 'inherit' }}
      variant="plain"
      value={props.value}
      onChange={e => props.onChange(e.target.value ?? '')}
    />
  )
)
