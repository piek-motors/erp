import { Sheet, Stack } from '@mui/joy'
import { P } from 'lib/index'
import { useEffect, useImperativeHandle, useState } from 'react'
import { SuggestionItem } from './mention-suggestion'

export const MentionSelectUser = (props: {
  items: SuggestionItem[]
  ref: any
  command: (arg: SuggestionItem) => void
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectItem = index => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }
  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    )
  }
  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }
  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(props.ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }
      if (event.key === 'Enter') {
        enterHandler()
        return true
      }
      return false
    }
  }))

  return (
    <Sheet sx={{ borderRadius: 'md', p: 1, border: '1px solid' }}>
      <Stack gap={1}>
        {props.items.length ? (
          props.items.map((item, index) => (
            <P
              color={index === selectedIndex ? 'primary' : 'neutral'}
              className={index === selectedIndex ? 'is-selected' : ''}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.label}
            </P>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </Stack>
    </Sheet>
  )
}
