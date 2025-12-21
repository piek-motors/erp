import { UilPlusCircle } from '@iconscout/react-unicons'
import { Button, Stack } from '@mui/joy'
import { InModal } from 'components/modal'
import { Inp, Loading, observer, P, UseIcon, useState } from 'lib/index'
import { ReactNode, useEffect } from 'react'
import { crud } from './api'

interface BaseGroupModalProps {
  openButton: ReactNode
  title: string
  onSubmit: (name: string) => Promise<void>
  initialName?: string
}

// Shared base component for both create and update modals
const BaseGroupModal = observer((props: BaseGroupModalProps) => {
  const [name, setName] = useState(props.initialName || '')
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) {
      return // Don't submit if name is empty or already submitting
    }

    setIsSubmitting(true)
    try {
      await props.onSubmit(trimmedName)
      setOpen(false)
    } catch (error) {
      alert(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  // Update name when initialName changes
  useEffect(() => {
    if (props.initialName !== undefined) {
      setName(props.initialName)
    }
  }, [props.initialName])

  return (
    <InModal openButton={props.openButton} open={open} setOpen={setOpen}>
      <Stack gap={1} onKeyDown={handleKeyDown}>
        <P>{props.title}</P>
        <Inp value={name} onChange={setName} placeholder="Название" autoFocus />
        {isSubmitting && <Loading />}
      </Stack>
    </InModal>
  )
})

export const CreateGroupModal = observer(() => {
  const handleSubmit = async (name: string) => {
    await crud.createGroup(name)
  }
  return (
    <BaseGroupModal
      openButton={
        <Button
          sx={{ mt: 1 }}
          size="sm"
          variant="soft"
          color="primary"
          startDecorator={<UseIcon icon={UilPlusCircle} small />}
        >
          Создать
        </Button>
      }
      title="Создать новую группу"
      onSubmit={handleSubmit}
      initialName=""
    />
  )
})

export const UpdateGroupNameModal = observer(() => {
  const handleSubmit = async (name: string) => {
    if (!crud.store.targetGroup) {
      throw new Error('No group selected for update')
    }
    await crud.updateGroup(crud.store.targetGroup.group.id, name)
  }

  return (
    <BaseGroupModal
      openButton={
        <P
          fontWeight={600}
          sx={{
            cursor: 'text',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.500'
            }
          }}
        >
          {crud.store.targetGroup?.group.name}
        </P>
      }
      title="Изменить название группы"
      onSubmit={handleSubmit}
      initialName={crud.store.targetGroup?.group.name || ''}
    />
  )
})
