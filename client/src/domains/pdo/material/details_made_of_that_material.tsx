/** @jsxImportSource @emotion/react */
import { Box, Button } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import { InModal } from 'components/modal'
import { DetailName } from 'domains/pdo/detail/detail_name'
import { useEscapeClose } from 'hooks/use-escape-close'
import { Loading, observer, P, Stack, useCallback, useState } from 'lib/index'
import type { MaterialSt } from './state'

export const DetailsMadeOfMaterialModal = observer(
  ({ m }: { m: MaterialSt }) => {
    const count = m.detailCount > 0 ? `[${m.detailCount}]` : undefined

    const [modal, setModal] = useState(false)
    const handleClose = useCallback(() => {
      setModal(false)
    }, [])
    useEscapeClose(modal, handleClose)

    if (m.loadingWall.loading) return <Loading />

    if (m.details_made_from_this_material.length === 0)
      return (
        <P color="danger" level="body-xs" width={'min-content'}>
          Материал не используется
        </P>
      )

    return (
      <InModal
        layout="fullscreen"
        openButton={
          <Button variant="outlined" color="neutral">
            Детали {count}
          </Button>
        }
        open={modal}
        setOpen={setModal}
      >
        <ScrollableWindow
          refreshTrigger={false}
          static={<P level="h4">Детали из этого материала</P>}
          scroll={
            <Stack sx={{ overflowY: 'scroll' }} pb={5} p={1}>
              {m.details_made_from_this_material.map(each => (
                <Box display={'flex'}>
                  <DetailName detail={each} withGroupName />
                </Box>
              ))}
            </Stack>
          }
        />
      </InModal>
    )
  },
)
