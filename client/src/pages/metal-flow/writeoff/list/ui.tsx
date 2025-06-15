/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Sheet } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { open, routeMap } from 'lib/routes'
import { AddResourceButton } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { t } from '../../text'
import { getColumns } from '../columns.decl'
import { writeoffStore } from '../writeoff.store'

export const WriteoffList = observer(() => {
  const [key, setKey] = useState(0)

  const columns = useMemo(
    () =>
      getColumns({
        key,
        setKey,
        refetch: () => {
          console.log('refetch')
        }
      }),
    [key, setKey]
  )

  useEffect(() => {
    writeoffStore.listStore.load()
  }, [])

  return (
    <>
      <PageTitle title={t.WriteoffsList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.writeoff.new)} />
      </PageTitle>
      <Sheet sx={{ gap: 2 }}>
        <Box css={styles}>
          <Table columns={columns} data={writeoffStore.listStore.writeoffs} />
        </Box>
      </Sheet>
    </>
  )
})

const styles = css`
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
`
