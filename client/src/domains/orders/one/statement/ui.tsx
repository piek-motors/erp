import { Box, Grid } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { PrintOnly, WebOnly } from '@/components/utilities/conditional-display'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ActionButton, InputStack, Label } from '@/lib/index'
import { orderStore } from '../order.store'
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
          <ActionButton onClick={() => mutation()} props={{ sx: { mt: 2 } }} />
        </InputStack>
      </form>
    )
  },
)

export const StatementView = observer(() => {
  const columns = orderStore.statment.getcolumns()
  const isPrinting = useMediaQuery('print')

  const rows = columns
    .map((column, idx) => {
      const { value, view, layout } = column
      if (!value && !view && !column.render) return null
      const v = view ?? value

      if (isPrinting && layout === WebOnly) return null
      if (!isPrinting && layout === PrintOnly) return null
      if (column.hidden) return null
      if (column.render && !column.render()) return null

      return (
        <>
          <Grid>
            <Label width={'auto'}>{column.label}</Label>
          </Grid>
          <Grid>{column.render ? column.render() : v}</Grid>
        </>
      )
    })
    .filter(Boolean)

  return (
    <Box
      sx={{
        py: 1,
        columnGap: 3,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      {rows.map(e => e)}
    </Box>
  )
})
