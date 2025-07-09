/** @jsxImportSource @emotion/react */
import { UilMinus } from '@iconscout/react-unicons'
import { IconButton } from '@mui/joy'
import {
  Box,
  Inp,
  PlusIcon,
  Row,
  Sheet,
  Stack,
  UseIcon,
  observer
} from 'lib/index'

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
    sx
  } = props

  const jsonFields: JsonField[] = Object.entries(value || {}).map(
    ([key, val]) => ({
      key,
      value: String(val)
    })
  )

  const addField = () => {
    const newValue = { ...value, '': '' }
    onChange(newValue)
  }

  const updateField = (
    index: number,
    field: 'key' | 'value',
    newValue: string
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
    <Sheet sx={{ borderRadius: 'sm', p: 1, ...sx }}>
      <Stack gap={1}>
        {jsonFields.map((field, index) => (
          <Row key={index} gap={1} sx={{ alignItems: 'flex-start' }}>
            <Inp
              size="sm"
              placeholder={keyPlaceholder}
              value={field.key}
              onChange={v => updateField(index, 'key', v)}
              sx={{ minWidth: 150 }}
            />
            <Inp
              size="sm"
              placeholder={valuePlaceholder}
              value={field.value}
              onChange={v => updateField(index, 'value', v)}
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
    </Sheet>
  )
})
