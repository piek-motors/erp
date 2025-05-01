import { UilTrash } from '@iconscout/react-unicons'
import { IconButton, Stack } from '@mui/material'
import { useEffect } from 'react'
import { useDeleteWriteOffMutation } from '../../../types/graphql-shema'
import { notif } from '../../../utils/notification'

export function DeleteWrireOff(props: {
  supplyId: number
  refetch: () => void
}) {
  const [mut, { data }] = useDeleteWriteOffMutation({
    variables: { id: props.supplyId }
  })

  useEffect(() => {
    if (data) {
      notif('success', 'Событие поставки удалено')
    }
  }, [data])

  return (
    <Stack direction="row-reverse" gap={1} className="delete-btn">
      <IconButton
        size="small"
        color="error"
        sx={{
          opacity: 0.8
        }}
        onClick={async () => {
          await mut()
          props.refetch()
        }}
      >
        <UilTrash width={16} height={16} />
      </IconButton>
    </Stack>
  )
}
