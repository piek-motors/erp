import { observer } from 'mobx-react-lite'
import { Link, P } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'

type Props = {
  label: string
  id?: number
  disableLink?: boolean
}

export const MaterialName = observer((props: Props) => {
  const { label, id, disableLink } = props

  const content = <P>{label}</P>

  if (disableLink || !id) {
    return content
  }

  return <Link to={openPage(routeMap.pdo.material.edit, id)}>{content}</Link>
})
