/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { TextEditor } from 'domains/orders/one/comments/text-editor'
import { Label, Stack } from 'lib/index'
import { observer } from 'mobx-react-lite'

export const border = '1px solid #7c7c7c'

export const tableStyles = css({
  whiteSpace: 'normal',
  tableLayout: 'initial',
  width: '100%',
  borderCollapse: 'collapse',
  border,
  th: {
    border,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'normal',
    padding: '5px',
  },
  td: {
    verticalAlign: 'top',
    padding: '5px 5px',
    fontSize: 12,
    border,
  },
})

function hasTextContent(html: string): boolean {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent?.trim().length > 0
}

export const DetailDescription = observer((props: { htmlContent?: string }) => {
  if (!props.htmlContent) return null
  if (!hasTextContent(props.htmlContent)) return null
  return (
    <Stack width={'max-content'} maxWidth={400}>
      <Label label="Примечание" level="body-sm" />
      <TextEditor
        defaultValue={props.htmlContent}
        editable={false}
        variant="plain"
        p={0}
      />
    </Stack>
  )
})
