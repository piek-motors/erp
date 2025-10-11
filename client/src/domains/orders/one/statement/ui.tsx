import { Box, Grid } from '@mui/joy'
import { PrintOnly, WebOnly } from 'components/utilities/conditional-display'
import { useMediaQuery } from 'hooks/use-media-query'
import { ExecuteAction, InputStack, Label } from 'lib/index'
import { observer } from 'mobx-react-lite'
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
          <Box mt={2} width={'min-content'}>
            <ExecuteAction
              onSubmit={() => mutation()}
              stackProps={{
                sx: {
                  mt: 2,
                  width: 'max-content'
                }
              }}
            />
          </Box>
        </InputStack>
      </form>
    )
  }
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
        gridTemplateColumns: 'auto 1fr'
      }}
    >
      {rows.map(e => e)}
    </Box>
  )
})
