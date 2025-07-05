import { WithSmallLinkButton } from 'components/small_link_button'
import { P } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { observer } from 'mobx-react-lite'

export const MaterialName = observer(
  (props: {
    materialLabel: string
    materialId?: number
    showLinkButton?: boolean
  }) => {
    const { materialLabel, materialId, showLinkButton } = props

    if (showLinkButton && materialId) {
      return (
        <WithSmallLinkButton
          linkTo={open(routeMap.metalflow.material.edit, materialId)}
        >
          {materialLabel}
        </WithSmallLinkButton>
      )
    }
    return <P>{materialLabel}</P>
  }
)
