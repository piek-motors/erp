import { ReactRenderer } from '@tiptap/react'
import { rpc } from 'lib/rpc/rpc.client'
import tippy from 'tippy.js'
import { MentionSelectUser } from './mention-user-list'

export type SuggestionItem = {
  id: number
  label: string
}

export const suggestion = {
  items: async () =>
    rpc.users.query().then(
      users =>
        users.map(
          e =>
            ({
              id: e.id,
              label: `${e.first_name} ${e.last_name}`
            } satisfies SuggestionItem)
        ) ?? []
    ),
  render: () => {
    let component
    let popup
    return {
      onStart: props => {
        component = new ReactRenderer(MentionSelectUser, {
          props,
          editor: props.editor
        })
        if (!props.clientRect) {
          return
        }
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        })
      },
      onUpdate(props) {
        component.updateProps(props)
        if (!props.clientRect) {
          return
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props)
      },
      onExit() {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}
