import { Link, P } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { observer } from 'mobx-react-lite'

export const MaterialName = observer(
  (props: { materialLabel: string; materialId?: number }) => {
    const { materialLabel, materialId } = props
    return (
      <Link to={openPage(routeMap.pdo.material.edit, materialId)}>
        <P whiteSpace={'nowrap'}>{materialLabel}</P>
      </Link>
    )
  }
)
