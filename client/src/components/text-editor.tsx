import { Box, Button, ButtonProps, Sheet, Stack } from '@mui/joy'
import Bold from '@tiptap/extension-bold'
import Highlight from '@tiptap/extension-highlight'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Label, Row } from 'lib/shortcuts'
import { useState } from 'react'

export const TextEditor = (props: {
  onSubmit: (content: string) => Promise<void>
}) => {
  const [key, setKey] = useState(0)
  const editor = useEditor({
    extensions: [StarterKit, Bold, Highlight],
    content: '',
    shouldRerenderOnTransaction: false
  })

  if (!editor) return null
  return (
    <Stack gap={1} key={key}>
      <Sheet sx={{ borderRadius: 'md', p: 1 }}>
        <Label p={2}>Добавить комментарий</Label>
        <Row>
          <TextFormatButton
            editor={editor}
            color={editor.isActive('bold') ? 'primary' : 'neutral'}
            onClick={() => {
              editor.chain().focus().toggleBold().run()
              setKey(key + 1)
            }}
          >
            Bold
          </TextFormatButton>
          <TextFormatButton
            editor={editor}
            color={editor.isActive('highlight') ? 'primary' : 'neutral'}
            onClick={() => {
              editor.chain().focus().toggleHighlight().run()
              setKey(key + 1)
            }}
          >
            Highlight
          </TextFormatButton>
        </Row>
        <EditorContent editor={editor} />
      </Sheet>
      <PublishButton editor={editor} onSubmit={props.onSubmit} />
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
