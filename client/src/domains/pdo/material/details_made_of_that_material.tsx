/** @jsxImportSource @emotion/react */
import { Box, Button } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import { InModal } from 'components/modal'
import { DetailName } from 'domains/pdo/detail/name'
import { useEscapeClose } from 'hooks/use-escape-close'
import { Loading, observer, P, Stack, useCallback, useState } from 'lib/index'
import { MaterialState } from './state'

export const DetailsMadeOfMaterialModal = observer(
  ({ m }: { m: MaterialState }) => {
    const count = m.detailCount > 0 ? `[${m.detailCount}]` : undefined

    const [modal, setModal] = useState(false)
    const handleClose = useCallback(() => {
      setModal(false)
    }, [])
    useEscapeClose(modal, handleClose)

    if (m.loadingWall.loading) return <Loading />

    if (m.detailsMadeFromThisMaterial.length === 0)
      return (
        <P color="danger" level="body-xs" width={'min-content'}>
          Материал не используется
        </P>
      )

    return (
      <InModal
        layout="fullscreen"
        openButton={
          <Button variant="soft" color="neutral">
            Детали {count}
          </Button>
        }
        open={modal}
        setOpen={setModal}
      >
        <ScrollableWindow
          refreshTrigger={false}
          staticContent={<P level="h4">Детали из этого материала</P>}
          scrollableContent={
            <Stack sx={{ overflowY: 'scroll' }} pb={5} p={1}>
              {m.detailsMadeFromThisMaterial.map(each => (
                <Box display={'flex'}>
                  <DetailName detail={each} withLink withGroupLink />
                </Box>
              ))}
            </Stack>
          }
        />
      </InModal>
    )
  }
)
