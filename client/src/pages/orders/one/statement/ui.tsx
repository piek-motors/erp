import { Box, Typography } from '@mui/joy'
import { PrintOnly, WebOnly } from 'components/conditional-display'
import { observer } from 'mobx-react-lite'
import { InputStack, SendMutation } from 'shortcuts'
import { orderStore } from '../stores/order.store'
import { RenderInput } from './render-input'

export const OrderStatementInput = observer(
  ({ mutation }: { mutation: () => Promise<any> }) => {
    const columns = orderStore.statment.getcolumns()
    return (
      <form>
        <InputStack>
          {columns.map((column, idx) => (
            <RenderInput key={idx} column={column} idx={idx} />
          ))}
        </InputStack>
        <SendMutation onClick={() => mutation()} />
      </form>
    )
  }
)

export const StatementView = observer(() => {
  const columns = orderStore.statment.getcolumns()
  return columns
    .map((column, idx) => {
      const { value, view, layout } = column
      if (!value && !view) return null
      const v = view ?? value
      const content = (
        <Box
          key={column.label}
          style={{
            display: 'flex',
            alignItems: 'baseline'
          }}
          sx={{ gap: 1 }}
        >
          <Typography style={{ whiteSpace: 'nowrap' }}>
            {column.label}
          </Typography>
          <div
            style={{
              flex: 1,
              borderBottom: '1px dashed #aaa',
              height: 1
            }}
          />
          <Typography style={{ whiteSpace: 'normal' }}>{v}</Typography>
        </Box>
      )

      if (layout === PrintOnly) {
        return (
          <PrintOnly key={idx} display="block">
            {content}
          </PrintOnly>
        )
      }
      if (layout === WebOnly) {
        return (
          <WebOnly key={idx} display="block">
            {content}
          </WebOnly>
        )
      }

      return content
    })
    .filter(Boolean)
})
