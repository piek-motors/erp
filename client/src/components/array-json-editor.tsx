import { UilMinus } from '@iconscout/react-unicons'
import { IconButton, Textarea } from '@mui/joy'
import { Box, PlusIcon, Row, Stack, UseIcon, observer } from 'lib/index'
import * as dnd from 'react-beautiful-dnd'

interface ArrayJsonEditorProps {
  value: any[] | null
  onChange: (value: any[] | null) => void
  placeholder?: object
  width?: number[]
  placeholders?: string[]
}

export const ArrayJsonEditor = observer((props: ArrayJsonEditorProps) => {
  const { value, onChange } = props
  const items = value ?? []

  const addItem = () => {
    const next = [...items, props.placeholder ?? {}]
    onChange(next)
  }

  const updateItemProp = (index: number, key: string, inputValue: string) => {
    const next = [...items]
    const current = { ...(next[index] ?? {}) }

    let casted: any = inputValue
    if (
      props.placeholder &&
      Object.prototype.hasOwnProperty.call(props.placeholder, key)
    ) {
      const templateValue = (props.placeholder as any)[key]
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
      <dnd.Droppable droppableId="array-json-editor" direction="vertical">
        {provided => (
          <Stack gap={0.5} ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => {
              const keys = props.placeholder
                ? Object.keys(props.placeholder)
                : Object.keys(item)

              return (
                <dnd.Draggable
                  key={`item-${index}`}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {dragProvided => (
                    <Row
                      gap={1}
                      sx={{ alignItems: 'center' }}
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <Box
                        sx={{
                          textAlign: 'center',
                          opacity: 0.5
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Row sx={{ flexGrow: 1, flexShrink: 0, height: '100%' }}>
                        {keys.map((key, keyIdx) => (
                          <Box
                            sx={{
                              width: props.width?.[keyIdx]
                                ? `${props.width?.[keyIdx]}%`
                                : undefined,
                              display: 'flex',
                              flexGrow: props.width?.[keyIdx] ? 0 : 1
                            }}
                          >
                            <Textarea
                              variant="plain"
                              size="sm"
                              placeholder={props.placeholders?.[keyIdx] ?? key}
                              value={String((item as any)[key] ?? '')}
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
