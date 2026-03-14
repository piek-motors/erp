/** Group creation and editing modals with parent selection tree. */
import { UilFolder, UilPlusCircle } from '@iconscout/react-unicons'
import { Button, Stack } from '@mui/joy'
import React, { type ReactNode, useEffect } from 'react'
import { InModal } from '@/components/modal'
import {
  InputLabled,
  Loading,
  observer,
  P,
  UseIcon,
  useState,
} from '@/lib/index'
import { api, detail_groups_vm, store } from './api'
import { GroupTreeSelectorModal } from './group_tree_selector'

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
  const [showTreeModal, setShowTreeModal] = useState(false)
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

  const getParentName = (id: number | null): string => {
    if (!id) return 'Без родителя'
    const findNode = (nodes: typeof store.group_tree): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.name
        const found = findNode(node.children)
        if (found) return found
      }
      return null
    }
    const fromTree = findNode(store.group_tree)
    if (fromTree) return fromTree
    const fromGroups = store.groups.find(g => g.id === id)?.name
    return fromGroups || 'Без родителя'
  }

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
        {props.showParentSelect !== false && (
          <Stack gap={0.5}>
            <P level="body-sm">Родительская группа</P>
            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowTreeModal(true)}
                sx={{ flex: 1, justifyContent: 'flex-start' }}
              >
                <UseIcon icon={UilFolder} small />
                <P level="body-sm" sx={{ ml: 0.5 }}>
                  {getParentName(parentId)}
                </P>
              </Button>

              {parentId !== null && (
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={() => setParentId(null)}
                >
                  ✕
                </Button>
              )}
            </Stack>
          </Stack>
        )}
        {isSubmitting && <Loading />}
      </Stack>
      {showTreeModal && (
        <InModal
          openButton={null as any}
          open={showTreeModal}
          setOpen={setShowTreeModal}
        >
          <GroupTreeSelectorModal
            value={parentId}
            onChange={val => {
              setParentId(val)
              setShowTreeModal(false)
            }}
          />
        </InModal>
      )}
    </InModal>
  )
})

/** Modal for creating a new root group. */
export const CreateGroupModal = observer(() => {
  const handleSubmit = async (name: string, parent_id: number | null) => {
    await api.create_group(name, parent_id)
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
  const parent_id = create_subgroup_modal.parent_id

  const handleSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return

    setIsSubmitting(true)
    try {
      await api.create_group(trimmedName, create_subgroup_modal.parent_id)
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
        <P>Создать подгруппу в {detail_groups_vm.group_name(parent_id)}</P>
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
    const handleSubmit = async (name: string, parent_id: number | null) => {
      if (!store.opened_group) throw new Error('No group selected for update')
      await api.update_group(store.opened_group.group.id, name, parent_id)
    }

    const currentGroupId = store.opened_group?.group.id
    const currentParentId = currentGroupId
      ? (store.groups.find(g => g.id === currentGroupId)?.parent_id ?? null)
      : null

    return (
      <BaseGroupModal
        openButton={props.openButton}
        title="Изменить название группы"
        onSubmit={handleSubmit}
        initialName={store.opened_group?.group.name || ''}
        initialParentId={currentParentId}
      />
    )
  },
)
