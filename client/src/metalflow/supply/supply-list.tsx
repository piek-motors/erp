/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { AddResourceButton, P } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { t } from '../text'
import { getColumns } from './columns.decl'
import { supplyStore } from './supply.store'

export const ListSupplies = observer(() => {
  const [key, setKey] = useState(0)
  useEffect(() => {
    supplyStore.load()
  }, [])
  return (
    <Stack py={1}>
      <PageTitle subTitle={t.SuppliesList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.supply.new)} />
      </PageTitle>
      {supplyStore.supplies.length === 0 && <P>Нет поставок</P>}
      <Sheet sx={{ gap: 2 }}>
        <Box
          css={css`
            .delete-btn {
              opacity: 0;
              visibility: hidden;
            }

            tr:hover {
              .delete-btn {
                opacity: 1;
                visibility: visible;
              }
            }
          `}
        >
          <Table
            columns={getColumns({ key, setKey })}
            data={supplyStore.supplies}
          />
        </Box>
      </Sheet>
    </Stack>
  )
})
