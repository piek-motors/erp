import type { TypographyProps } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { fmt } from 'shared'
import { Link, P } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'

interface Material {
  label: string
  alloy: string | null
  id?: number | null
}

type Props = {
  material: Material
  disableLink?: boolean
  slotProps?: TypographyProps
}

export const MaterialName = observer((props: Props) => {
  const { disableLink, material } = props
  const { label, id, alloy } = material

  const content = (
    <P {...props.slotProps}>
      {fmt.capitalize(label)} {alloy ?? ''}
    </P>
  )

  if (disableLink || !id) {
    return content
  }

  return <Link to={openPage(routeMap.pdo.material.edit, id)}>{content}</Link>
})
