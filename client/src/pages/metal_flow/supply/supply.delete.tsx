import { UilTrash } from '@iconscout/react-unicons'
import { IconButton, Stack } from '@mui/material'
import { useEffect } from 'react'
import { useDeleteSupplyMutation } from '../../../types/graphql-shema'
import { notif } from '../../../utils/notification'

export function DeleteSupply(props: { supplyId: number; refetch: () => void }) {
  const [mut, { data, loading, error }] = useDeleteSupplyMutation({
    variables: {
      id: props.supplyId
    }
  })

  useEffect(() => {
    if (data) {
      console.log('delete success')
      notif('success', 'Событие поствки удалено')
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
