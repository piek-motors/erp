import { Button, Modal, ModalDialog, Stack } from '@mui/joy'
import { Inp, observer, P, Row, useState } from 'lib/index'
import { detailGroupStore } from './store'

export const CreateGroupModal = observer(() => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return
    setIsSubmitting(true)
    try {
      await detailGroupStore.createGroup(name.trim())
      setName('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create group:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  return (
    <>
      <Button
        size="sm"
        variant="soft"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Создать
      </Button>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <Stack gap={1}>
            <P level="h4">Создать новую группу</P>
            <Inp
              value={name}
              onChange={setName}
              placeholder="Название"
              autoFocus
            />
            <Row>
              <Button
                variant="soft"
                color="neutral"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                loading={isSubmitting}
              >
                Создать
              </Button>
            </Row>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  )
})
