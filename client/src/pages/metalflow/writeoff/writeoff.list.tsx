/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/material'
import { useState } from 'react'
import { PaperL1 } from '../../../components/paper'
import { MetalFlowSys } from '../../../lib/routes'
import { useGetWrietOffsQuery } from '../../../types/graphql-shema'
import { ListPageHeader } from '../shared'
import { Table } from '../shared/table.impl'
import { t } from '../text'
import { getColumns } from './columns.decl'

export function WriteoffsList() {
  const { data, refetch } = useGetWrietOffsQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <ListPageHeader
        title={t.WriteoffsList}
        btnText={t.WriteOffAdd}
        goto={MetalFlowSys.writeoff_add}
      />
      <PaperL1 sx={{ gap: 2 }}>
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
            columns={getColumns({ key, setKey, refetch })}
            data={data?.metal_pdo_writeoffs || []}
          />
        </Box>
      </PaperL1>
    </>
  )
}
