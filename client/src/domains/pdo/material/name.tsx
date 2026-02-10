import { observer } from 'mobx-react-lite'
import { Link, P } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'

export const MaterialName = observer(
  (props: { label: string; id?: number }) => {
    const { label, id } = props
    return (
      <Link to={openPage(routeMap.pdo.material.edit, id)}>
        <P>{label}</P>
      </Link>
    )
  },
)
