/** @jsxImportSource @emotion/react */
import { UilMinus } from '@iconscout/react-unicons'
import { IconButton, Textarea } from '@mui/joy'
import { Box, observer, PlusIcon, Row, Stack, UseIcon } from 'lib/index'

interface JsonField {
  key: string
  value: string
}

interface JsonEditorProps {
  value: Record<string, any> | null
  onChange: (value: Record<string, any> | null) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  sx?: any
}

export const JsonEditor = observer((props: JsonEditorProps) => {
  const {
    value,
    onChange,
    keyPlaceholder = 'Ключ',
    valuePlaceholder = 'Значение',
    sx,
  } = props

  const jsonFields: JsonField[] = Object.entries(value || {}).map(
    ([key, val]) => ({
      key,
      value: String(val),
    }),
  )

  const addField = () => {
    const newValue = { ...value, '': '' }
    onChange(newValue)
  }

  const updateField = (
    index: number,
    field: 'key' | 'value',
    newValue: string,
  ) => {
    const newFields = [...jsonFields]
    newFields[index] = { ...newFields[index], [field]: newValue }

    const newJson: Record<string, any> = {}
    newFields.forEach(field => {
      newJson[field.key] = field.value
    })

    onChange(newJson)
  }

  const removeField = (index: number) => {
    const newFields = jsonFields.filter((_, i) => i !== index)

    const newJson: Record<string, any> = {}
    newFields.forEach(field => {
      newJson[field.key] = field.value
    })

    onChange(Object.keys(newJson).length > 0 ? newJson : null)
  }

  return (
    <Stack gap={0.5}>
      {jsonFields.map((field, index) => (
        <Row key={index} gap={0.5} sx={{ alignItems: 'flex-start' }}>
          <Textarea
            variant="plain"
            placeholder={keyPlaceholder}
            value={field.key}
            onChange={e => updateField(index, 'key', e.target.value)}
            sx={{ minWidth: 150, flex: 2 }}
          />
          <Textarea
            variant="plain"
            placeholder={valuePlaceholder}
            value={field.value}
            onChange={e => updateField(index, 'value', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton
            variant="soft"
            color="danger"
            size="sm"
            onClick={() => removeField(index)}
          >
            <UseIcon icon={UilMinus} />
          </IconButton>
        </Row>
      ))}
      <Box sx={{ alignSelf: 'flex-start' }}>
        <PlusIcon onClick={addField} />
      </Box>
    </Stack>
  )
})
