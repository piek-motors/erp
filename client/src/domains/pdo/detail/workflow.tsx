/** @jsxImportSource @emotion/react */

import { AccordionCard } from '@/components/accordion_card'
import { dictManager } from '@/components/dict_manager'
import { HoverReveal } from '@/components/hidden_button'
import { app_cache } from '@/domains/pdo/cache'
import { makeAutoObservable, rpc } from '@/lib/deps'
import {
  Label,
  MinusIcon,
  MultilineInput,
  P,
  PlusIcon,
  Row,
  UseIcon,
} from '@/lib/index'
import type { DetailWorkflow } from '@/server/domains/pdo/details_rpc'
import type { DictEntry } from '@/server/lib/create_dict_router'
import { UilSubject } from '@iconscout/react-unicons'
import { Button, IconButton, Input, Stack, TypographyProps } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import type { DetailSt } from './detail.state'

export class WorkflowTask {
  constructor(
    readonly id: number,
    readonly text?: string | null,
  ) {
    makeAutoObservable(this)
  }

  get name(): string {
    const name = app_cache.details.dict_processing_operaions.find(
      each => each.id === this.id,
    )?.v
    return name ?? 'No value in the dict'
  }

  get payload(): [number] | [number, string] {
    if (this.text) return [this.id, this.text]
    else return [this.id]
  }
}

export class Workflow {
  tasks: WorkflowTask[] = []

  init(o: WorkflowTask[]) {
    this.tasks = o
  }

  constructor() {
    makeAutoObservable(this)
  }

  add(id: number) {
    this.tasks = [...this.tasks, new WorkflowTask(id)]
  }

  remove(idx: number) {
    this.tasks = this.tasks.filter((_, i) => i !== idx)
  }

  update(idx: number, id: number, text?: string | null) {
    if (idx < 0 || idx >= this.tasks.length) return
    this.tasks = [
      ...this.tasks.slice(0, idx),
      new WorkflowTask(id, text),
      ...this.tasks.slice(idx + 1),
    ]
  }

  // Move task from one index to another
  move(fromIdx: number, toIdx: number) {
    if (fromIdx < 0 || fromIdx >= this.tasks.length) return
    if (toIdx < 0 || toIdx >= this.tasks.length) return
    if (fromIdx === toIdx) return

    const newTasks = [...this.tasks]
    const [movedTask] = newTasks.splice(fromIdx, 1)
    newTasks.splice(toIdx, 0, movedTask)
    this.tasks = newTasks
  }

  reset() {
    this.tasks = []
  }

  get payload(): DetailWorkflow {
    return {
      workflow: this.tasks.map(o => o.payload),
    }
  }
}

export const WorkflowAccordion = observer(
  ({ detail }: { detail: DetailSt }) => {
    const dict = rpc.pdo.dict.operation_kinds
    const [showComment, setShowComment] = useState<Record<number, boolean>>({})
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [tempIndex, setTempIndex] = useState<string>('')

    const openDict = (onClick: (entry: DictEntry) => void) => {
      dictManager.open({
        ls: () =>
          dict.ls.query().then(res => {
            app_cache.details.set_dict_processing_operations(res)
            return res
          }),
        add: operation => dict.add.mutate({ v: operation }),
        rm: id => dict.rm.mutate({ id }),
        onClick,
      })
    }

    const handleIndexChange = (current_idx: number, new_idx_str: string) => {
      const new_idx = parseInt(new_idx_str, 10) - 1 // Convert to 0-based index
      if (Number.isNaN(new_idx) || new_idx < 0) {
        return // Invalid index
      }

      if (new_idx !== current_idx) {
        if (new_idx >= detail.workflow.tasks.length) {
          detail.workflow.move(current_idx, detail.workflow.tasks.length)
        } else {
          detail.workflow.move(current_idx, new_idx)
        }
      }

      setEditingIndex(null)
    }

    return (
      <AccordionCard title="Маршрут" defaultExpanded>
        <Stack gap={1}>
          {detail.workflow.tasks.map((op, idx) => {
            const show_comment = showComment[op.id] ?? Boolean(op.text)
            const EditableTaskIndex = (
              <>
                {editingIndex === idx ? (
                  <Input
                    size="sm"
                    variant="soft"
                    value={tempIndex}
                    onChange={e => setTempIndex(e.target.value)}
                    onBlur={() => {
                      handleIndexChange(idx, tempIndex)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleIndexChange(idx, tempIndex)
                      } else if (e.key === 'Escape') {
                        setEditingIndex(null)
                      }
                    }}
                    autoFocus
                    sx={{ width: '40px' }}
                  />
                ) : (
                  <Label
                    onClick={() => {
                      setEditingIndex(idx)
                      setTempIndex(String(idx + 1))
                    }}
                    sx={{ cursor: 'text', userSelect: 'none', px: 0.5 }}
                    title="Изменить позицию"
                  >
                    {idx + 1}
                  </Label>
                )}
              </>
            )

            const TaskLabel = (
              <Button
                variant="plain"
                color="neutral"
                sx={{ textAlign: 'left', px: 0.5 }}
                onClick={() =>
                  openDict(entry =>
                    detail.workflow.update(idx, entry.id, op.text),
                  )
                }
              >
                {op.name}
              </Button>
            )

            const TaskDescription = (
              <MultilineInput
                size="sm"
                variant="plain"
                color="neutral"
                placeholder="Описание"
                value={op.text ?? ''}
                sx={{ width: '100%', pl: 2 }}
                onChange={e => {
                  detail.workflow.update(idx, op.id, e.target.value)
                }}
              />
            )

            return (
              <HoverReveal
                key={op.id}
                gap={1}
                alignSelf="start"
                justifyContent={'start'}
                alignItems={'start'}
                flexDirection={'row'}
                sx={{ width: '-webkit-fill-available' }}
                hiddenComp={
                  <Row alignItems={'center'} gap={1}>
                    {/* Toggle comment button */}
                    {!show_comment && (
                      <IconButton
                        onClick={() =>
                          setShowComment(s => ({ ...s, [op.id]: !s[op.id] }))
                        }
                        title="Описание"
                        variant="soft"
                        color="primary"
                        size="sm"
                      >
                        <UseIcon icon={UilSubject} small />
                      </IconButton>
                    )}
                    <MinusIcon onClick={() => detail.workflow.remove(idx)} />
                  </Row>
                }
              >
                <Stack flexGrow={1}>
                  <Row alignItems={'center'} gap={1}>
                    {/* Editable index */}
                    {EditableTaskIndex}
                    {/* operation selector */}
                    {TaskLabel}
                  </Row>
                  {/* optional text - shown when toggled or if operation already has text */}
                  {show_comment && TaskDescription}
                </Stack>
              </HoverReveal>
            )
          })}
          <PlusIcon
            onClick={() => openDict(entry => detail.workflow.add(entry.id))}
          />
        </Stack>
      </AccordionCard>
    )
  },
)

export const SingleWorkflowTask = (props: {
  task: WorkflowTask
  idx: number
  textSlot?: TypographyProps
  onClick?: (task: WorkflowTask, idx: number) => {}
}) => {
  const t = props.task.text
  return (
    <Stack
      onClick={() => props.onClick?.(props.task, props.idx)}
      sx={{
        cursor: props.onClick ? 'pointer' : 'initial',
      }}
    >
      <Row noWrap alignItems={'center'}>
        {props.idx != null && (
          <Label xs {...props.textSlot}>
            {props.idx + 1}.
          </Label>
        )}
        <P {...props.textSlot}>{props.task.name}</P>
      </Row>
      {t && (
        <P level="body-xs" sx={{ maxWidth: 300 }} {...props.textSlot}>
          {t}
        </P>
      )}
    </Stack>
  )
}
