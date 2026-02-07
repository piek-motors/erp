import { UilMinus } from '@iconscout/react-unicons'
import { Divider, IconButton, Textarea } from '@mui/joy'
import * as dnd from 'react-beautiful-dnd'
import {
  Box,
  Label,
  observer,
  PlusIcon,
  Row,
  Stack,
  UseIcon,
} from '@/lib/index'

interface ArrayJsonEditorProps {
  value?: any[] | null
  onChange: (value: any[] | null) => void
  newItem?: Record<string, any>
  width?: number[]
  placeholders?: string[]
}

export const ArrayJsonEditor = observer((props: ArrayJsonEditorProps) => {
  const { value, onChange } = props
  const items = value ?? []

  const addItem = () => {
    const next = [...items, props.newItem ?? {}]
    onChange(next)
  }

  const updateItemProp = (index: number, key: string, inputValue: string) => {
    const next = [...items]
    const current = { ...(next[index] ?? {}) }

    let casted: any = inputValue
    if (props.newItem && Object.hasOwn(props.newItem, key)) {
      const templateValue = (props.newItem as any)[key]
      if (typeof templateValue === 'number') {
        const n = Number(inputValue)
        casted = Number.isFinite(n) ? n : templateValue
      }
      // Add other type coercions here if needed (boolean, etc.)
    }

    current[key] = casted
    next[index] = current
    onChange(next)
  }

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index)
    onChange(next.length > 0 ? next : null)
  }

  const onDragEnd: dnd.OnDragEndResponder = result => {
    const { source, destination } = result
    if (!destination) return
    if (source.index === destination.index) return
    const next = [...items]
    const [moved] = next.splice(source.index, 1)
    next.splice(destination.index, 0, moved)
    onChange(next)
  }

  return (
    <dnd.DragDropContext onDragEnd={onDragEnd}>
      <dnd.Droppable
        droppableId="array-json-editor"
        direction="vertical"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {provided => (
          <Stack gap={0.5} ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => {
              const keys = props.newItem
                ? Object.keys(props.newItem)
                : Object.keys(item)

              return (
                <dnd.Draggable
                  key={`item-${index}`}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {dragProvided => (
                    <>
                      <Row
                        sx={{ alignItems: 'center' }}
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        flexWrap={'nowrap'}
                      >
                        <Label>{index + 1}</Label>
                        <Row
                          sx={{ flexGrow: 1, flexShrink: 0, height: '100%' }}
                          flexWrap={'nowrap'}
                        >
                          {keys.map((key, keyIdx) => (
                            <Box
                              key={key}
                              sx={{
                                width: props.width?.[keyIdx]
                                  ? `${props.width?.[keyIdx]}%`
                                  : undefined,
                                display: 'flex',
                                flexGrow: props.width?.[keyIdx] ? 0 : 1,
                              }}
                            >
                              <Textarea
                                variant="plain"
                                size="sm"
                                placeholder={
                                  props.placeholders?.[keyIdx] ?? key
                                }
                                value={String((item as any)[key] || '')}
                                onChange={e =>
                                  updateItemProp(index, key, e.target.value)
                                }
                                sx={{ width: '100%', flexShrink: 1 }}
                              />
                            </Box>
                          ))}
                        </Row>
                        <IconButton
                          variant="soft"
                          color="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <UseIcon icon={UilMinus} />
                        </IconButton>
                      </Row>
                      {index !== items.length - 1 && (
                        <Divider sx={{ opacity: 0.5 }} />
                      )}
                    </>
                  )}
                </dnd.Draggable>
              )
            })}
            <Box sx={{ alignSelf: 'flex-start' }}>
              <PlusIcon onClick={addItem} />
            </Box>
          </Stack>
        )}
      </dnd.Droppable>
    </dnd.DragDropContext>
  )
})
