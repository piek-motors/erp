/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, ButtonProps, Sheet, Stack } from '@mui/joy'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Row } from 'lib/index'
import { useEffect, useState } from 'react'
import { suggestion } from './mention-suggestion'

export const TextEditor = (props: {
  defaultValue?: string
  placeholder?: string
  onSubmit?: (content: string) => Promise<void>
  onChange?: (content: string) => void
}) => {
  const [key, setKey] = useState(0)

  const handleChange = () => {
    props.onChange?.(editor?.getHTML() ?? '')
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder
      }),
      Bold,
      Highlight,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        renderText: mention => {
          return `<span class="mention" data-mention="${mention.node.attrs.id}">${mention.node.attrs.label}</span>`
        },
        suggestion
      })
    ],
    content: '',
    shouldRerenderOnTransaction: false
  })

  const styles = css`
    .mention {
      background-color: #308ef860;
      border-radius: 1rem;
      padding: 0rem 0.3rem;
      color: #212529;
      display: inline-block;
    }

    .tiptap p.is-editor-empty:first-of-type::before {
      color: #adb5bd;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  `

  useEffect(() => {
    if (props.defaultValue) {
      editor?.commands.setContent(props.defaultValue)
    }
  }, [])

  if (!editor) return null
  return (
    <Stack gap={1} key={key} css={styles} sx={{ position: 'relative' }}>
      <Sheet sx={{ borderRadius: 'md', p: 1 }}>
        <Row>
          <TextFormatButton
            editor={editor}
            color={editor.isActive('bold') ? 'primary' : 'neutral'}
            onClick={() => {
              editor.chain().focus().toggleBold().run()
              handleChange()
            }}
          >
            B
          </TextFormatButton>
          <TextFormatButton
            editor={editor}
            defaultValue={props.defaultValue}
            color={editor.isActive('highlight') ? 'primary' : 'neutral'}
            onClick={() => {
              editor.chain().focus().toggleHighlight().run()
              handleChange()
            }}
          >
            Highlight
          </TextFormatButton>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <TextFormatButton
              editor={editor}
              color={
                editor.isActive('heading', { level: 1 }) ? 'primary' : 'neutral'
              }
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run()
                handleChange()
              }}
            >
              H1
            </TextFormatButton>
            <TextFormatButton
              editor={editor}
              color={
                editor.isActive('heading', { level: 2 }) ? 'primary' : 'neutral'
              }
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run()
                handleChange()
              }}
            >
              H2
            </TextFormatButton>
            <TextFormatButton
              editor={editor}
              color={
                editor.isActive('heading', { level: 3 }) ? 'primary' : 'neutral'
              }
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run()
                handleChange()
              }}
            >
              H3
            </TextFormatButton>
          </Box>
        </Row>
        <EditorContent editor={editor} onInput={() => handleChange()} />
      </Sheet>
      {props.onSubmit && (
        <PublishButton editor={editor} onSubmit={props.onSubmit} />
      )}
    </Stack>
  )
}

function TextFormatButton(
  props: {
    editor: Editor
  } & ButtonProps
) {
  return (
    <Button variant="soft" size="sm" onClick={props.onClick} {...props}>
      {props.children}
    </Button>
  )
}

function PublishButton(props: {
  editor: Editor | null
  onSubmit: (content: string) => Promise<void>
}) {
  const { editor, onSubmit } = props
  const handleReset = () => {
    editor?.commands.clearContent()
  }
  return (
    <Box>
      <Button
        color="primary"
        variant="plain"
        size="sm"
        onClick={() => {
          const content = editor?.getHTML()
          if (!content) return

          onSubmit(content).then(() => {
            handleReset()
          })
        }}
      >
        Опубликовать
      </Button>
    </Box>
  )
}
