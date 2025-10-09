/** @jsxImportSource @emotion/react */
import { Box, Button } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import { InModal } from 'components/modal'
import { DetailName } from 'domains/pdo/detail/name'
import { useEscapeClose } from 'hooks/use-escape-close'
import { Loading, observer, P, Stack, useCallback, useState } from 'lib/index'
import { api } from './api'

export const DetailsMadeOfMaterialModal = observer(() => {
  const count = api.s.detailCount > 0 ? `[${api.s.detailCount}]` : undefined

  const [modal, setModal] = useState(false)
  const handleClose = useCallback(() => {
    setModal(false)
  }, [])
  useEscapeClose(modal, handleClose)

  if (api.s.loadingWall.loading) return <Loading />

  if (api.s.detailsMadeFromThisMaterial.length === 0)
    return (
      <P color="danger" level="body-xs" maxWidth={180}>
        Материал не используется ни в одной детали
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
          <Stack sx={{ overflowY: 'scroll' }} pb={5}>
            {api.s.detailsMadeFromThisMaterial.map(each => (
              <Box display={'flex'}>
                <DetailName detail={each} withLink withGroupLink />
              </Box>
            ))}
          </Stack>
        }
      />
    </InModal>
  )
})
