import { WithHiddenLinkButton } from 'components/hidden_button'
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
        <WithHiddenLinkButton
          linkTo={open(routeMap.metalflow.material.edit, materialId)}
        >
          {materialLabel}
        </WithHiddenLinkButton>
      )
    }
    return <P>{materialLabel}</P>
  }
)
