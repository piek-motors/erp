import { Button, Modal, ModalDialog, Sheet } from '@mui/joy'
import { Inp, observer, P, useState } from 'lib/index'
import { detailGroupStore, Group } from './store'

interface EditGroupModalProps {
  group: Group
  onClose: () => void
}

export const EditGroupModal = observer(
  ({ group, onClose }: EditGroupModalProps) => {
    const [name, setName] = useState(group.name)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
      if (!name.trim()) return

      setIsSubmitting(true)
      try {
        await detailGroupStore.updateGroup(group.id, name.trim())
        onClose()
      } catch (error) {
        console.error('Failed to update group:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <Modal open={true} onClose={onClose}>
        <ModalDialog>
          <Sheet>
            <P level="h4">Редактировать группу</P>
            <Inp
              label="Название группы"
              value={name}
              onChange={setName}
              placeholder="Введите название группы"
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button
                variant="soft"
                color="neutral"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                loading={isSubmitting}
              >
                Сохранить
              </Button>
            </div>
          </Sheet>
        </ModalDialog>
      </Modal>
    )
  }
)
