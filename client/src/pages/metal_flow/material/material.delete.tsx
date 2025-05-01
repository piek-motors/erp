import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { MetalFlowSys } from 'src/lib/routes'
import { useDeleteMaterialMutation } from 'src/types/graphql-shema'
import { notif } from '../../../utils/notification'
import { goTo } from '../spa'
import { t } from '../text'

export function DeleteMaterial(props: { id: number }) {
  const [mut, { loading, data, error }] = useDeleteMaterialMutation({
    variables: {
      id: props.id
    }
  })

  const navigate = useNavigate()
  const handle = async () => {
    const res = await mut()
    if (res.data?.delete_metal_pdo_materials_by_pk?.id) {
      navigate(goTo(MetalFlowSys.materials))
      notif('info', 'Материал успешно удален')
    } else {
      alert(res.errors)
    }
  }

  return (
    <Button
      variant="outlined"
      color="error"
      sx={{ width: 'max-content' }}
      onClick={handle}
      disabled={loading}
    >
      {t.Delete}
    </Button>
  )
}
