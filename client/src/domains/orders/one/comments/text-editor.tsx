/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilBold, UilMessage, UilPaintTool } from '@iconscout/react-unicons'
import { Box, Button, Sheet, type SheetProps, Stack } from '@mui/joy'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Row, TooltipIconButton, UseIcon } from 'lib/index'
import { useEffect, useState } from 'react'
import { suggestion } from './mention-suggestion'

export const TextEditor = (props: {
	defaultValue?: string
	placeholder?: string
	onSubmit?: (content: string) => Promise<void>
	onChange?: (content: string) => void
	editable?: boolean
	variant?: SheetProps['variant']
}) => {
	const [key] = useState(0)
	const editable = props.editable === undefined ? true : props.editable

	const handleChange = () => {
		props.onChange?.(editor?.getHTML() ?? '')
	}

	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: props.placeholder,
			}),
			Highlight,
			Mention.configure({
				HTMLAttributes: {
					class: 'mention',
				},
				renderText: mention => {
					return `<span class="mention" data-mention="${mention.node.attrs.id}">${mention.node.attrs.label}</span>`
				},
				suggestion,
			}),
		],
		content: props.defaultValue,
		editable,
		shouldRerenderOnTransaction: false,
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
	}, [editor])

	if (!editor) return null
	return (
		<Stack gap={1} key={key} css={styles} sx={{ position: 'relative' }}>
			<Sheet
				sx={{ borderRadius: 'md', p: 1 }}
				variant={props.variant || 'outlined'}
			>
				{editable && (
					<Row>
						<TooltipIconButton
							icon={UilBold}
							variant={editor.isActive('bold') ? 'soft' : 'outlined'}
							color={editor.isActive('bold') ? 'primary' : 'neutral'}
							onClick={() => {
								editor.chain().focus().toggleBold().run()
								handleChange()
							}}
						/>
						<TooltipIconButton
							icon={UilPaintTool}
							variant={editor.isActive('highlight') ? 'soft' : 'outlined'}
							color={editor.isActive('highlight') ? 'primary' : 'neutral'}
							onClick={() => {
								editor.chain().focus().toggleHighlight().run()
								handleChange()
							}}
						/>
					</Row>
				)}
				<EditorContent
					disabled={!editable}
					editor={editor}
					onInput={() => editable && handleChange()}
					css={css`
            .tiptap {
              padding: 5px;
            }
            .tiptap p {
              font-size: 14px;
              margin: 0 !important;
            }
          `}
				/>
			</Sheet>
			{props.onSubmit && (
				<PublishButton editor={editor} onSubmit={props.onSubmit} />
			)}
		</Stack>
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
				color="neutral"
				variant="soft"
				size="sm"
				startDecorator={<UseIcon icon={UilMessage} small />}
				onClick={() => {
					const content = editor?.getHTML()
					if (!content) return

					onSubmit(content).then(() => {
						handleReset()
					})
				}}
			>
				Прикрепить
			</Button>
		</Box>
	)
}
