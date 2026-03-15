/** Group creation and editing modals with parent selection tree. */
import { UilPlusCircle } from '@iconscout/react-unicons'
import { type IconButtonProps, Stack } from '@mui/joy'
import React, { type ReactNode, useEffect } from 'react'
import { InModal } from '@/components/modal'
import {
  IconButtonXxs,
  InputLabled,
  Loading,
  observer,
  P,
  useState,
} from '@/lib/index'
import { app_cache } from '../cache'
import { api } from './api'
import { detail_groups_vm, store } from './group.store'

interface BaseGroupModalProps {
  openButton: ReactNode
  title: string
  onSubmit: (name: string, parent_id: number | null) => Promise<void>
  initialName?: string
  initialParentId?: number | null
  showParentSelect?: boolean
}

/** Base modal component for group creation and editing. */
const BaseGroupModal = observer((props: BaseGroupModalProps) => {
  const [name, setName] = useState(props.initialName || '')
  const [parentId, setParentId] = useState<number | null>(
    props.initialParentId ?? null,
  )
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return

    setIsSubmitting(true)
    try {
      await props.onSubmit(trimmedName, parentId)
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

  useEffect(() => {
    if (props.initialName !== undefined) setName(props.initialName)
  }, [props.initialName])

  useEffect(() => {
    if (props.initialParentId !== undefined) setParentId(props.initialParentId)
  }, [props.initialParentId])

  return (
    <InModal openButton={props.openButton} open={open} setOpen={setOpen}>
      <Stack gap={1} onKeyDown={handleKeyDown}>
        <P>{props.title}</P>
        <InputLabled
          value={name}
          onChange={setName}
          placeholder="Название"
          autoFocus
        />
        {isSubmitting && <Loading />}
      </Stack>
    </InModal>
  )
})

export const CreateGroupButton = observer(
  (props: { tooltip: string } & IconButtonProps) => (
    <IconButtonXxs
      {...props}
      title={props.tooltip}
      variant="soft"
      color="primary"
      icon={UilPlusCircle}
    />
  ),
)

/** Modal for creating a new root group. */
export const CreateGroupModal = observer(() => {
  const handleSubmit = async (name: string, parent_id: number | null) => {
    await api.create_group(name, parent_id)
  }

  return (
    <BaseGroupModal
      openButton={<CreateGroupButton tooltip="Создать группу" />}
      title="Создать новую группу"
      onSubmit={handleSubmit}
      initialName=""
      initialParentId={null}
    />
  )
})

/** Modal for creating a subgroup under a specific parent. */
export const CreateSubgroupModal = observer(() => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { create_subgroup_modal } = detail_groups_vm
  const parent_id = create_subgroup_modal.parent_id!
  const parent_name = app_cache.groups.tree.name_for(parent_id)

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return

    setIsSubmitting(true)
    try {
      await api.create_group(trimmedName, parent_id)
      setOpen(false)
      create_subgroup_modal.close()
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
      create_subgroup_modal.close()
    }
  }

  useEffect(() => {
    if (!open) create_subgroup_modal.close()
  }, [open])

  if (!parent_id) return null
  return (
    <InModal open={open} setOpen={setOpen}>
      <Stack gap={1} onKeyDown={handleKeyDown}>
        <P>Создать подгруппу в {parent_name}</P>
        <InputLabled
          size="sm"
          value={name}
          onChange={setName}
          placeholder="Название"
          autoFocus
        />
        {isSubmitting && <Loading />}
      </Stack>
    </InModal>
  )
})

/** Modal for editing an existing group's name and parent. */
export const ChangeGroupNameModal = observer(
  (props: { openButton: ReactNode }) => {
    const { group } = store.group_content

    const handleSubmit = async (name: string, parent_id: number | null) => {
      if (!group) throw new Error('No group selected for update')
      await api.update_group(group.id, name, parent_id)
    }

    const currentGroupId = group?.id
    const currentParentId = currentGroupId
      ? (app_cache.groups.tree.nodes.find(g => g.id === currentGroupId)
          ?.parent_id ?? null)
      : null

    return (
      <BaseGroupModal
        openButton={props.openButton}
        title="Изменить название группы"
        onSubmit={handleSubmit}
        initialName={group?.name || ''}
        initialParentId={currentParentId}
      />
    )
  },
)
