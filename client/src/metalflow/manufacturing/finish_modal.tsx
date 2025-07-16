import { UilCheck } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Stack } from '@mui/joy'
import { InModal } from 'components/modal'
import { Label, observer, P, Row, useEffect, UseIcon } from 'lib/index'
import { finishModalStore } from './finish_modal_store'
import { ManufactoringListOutput } from './list/list_store'

export const FinishModal = observer(
  (props: { detail: ManufactoringListOutput }) => {
    if (props.detail.finished_at) {
      return null
    }
    useEffect(() => {
      finishModalStore.loadDetail(props.detail.detail_id)
    }, [props.detail.detail_id])

    return (
      <InModal
        size="md"
        openButton={
          <IconButton
            size="sm"
            variant="soft"
            color="success"
            onClick={() => {
              finishModalStore.setOpen(true)
            }}
          >
            <UseIcon icon={UilCheck} />
          </IconButton>
        }
        open={finishModalStore.open}
        setOpen={v => {
          finishModalStore.setOpen(v)
        }}
      >
        <Box pr={3}>
          <P color="neutral">Завершить производство детали</P>
          <P fontWeight={'bold'}>{finishModalStore.detail.name}</P>
          <Stack>
            <Label label="Используемые материалы" />
            <Stack gap={1}>
              {finishModalStore.detail.usedMaterials.map(m => (
                <P key={m.materialId}>{m.materialLabel}</P>
              ))}
            </Stack>
          </Stack>

          <Row pt={5} justifyContent={'space-between'} gap={1}>
            <Button
              variant="soft"
              onClick={() => {
                finishModalStore.setOpen(false)
              }}
            >
              Отмена
            </Button>
            <Button
              color="success"
              onClick={async () => {
                await finishModalStore.finishManufacturing()
              }}
            >
              Завершить
            </Button>
          </Row>
        </Box>
      </InModal>
    )
  }
)
