/** @jsxImportSource @emotion/react */
import { WithSmallLinkButton } from 'components/small_link_button'
import { Button, P, Row, observer } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { cache } from 'metalflow/metal_flow_cache'
import { Link } from 'react-router-dom'

interface Detail {
  id: number
  name: string
  group_id: number | null
}

export const DetailName = observer(
  (props: {
    detail: Detail
    showLinkButton?: boolean
    hideGroupLink?: boolean
  }) => {
    const { detail, showLinkButton, hideGroupLink } = props

    const name = (
      <Row>
        <P sx={{ whiteSpace: 'nowrap', width: 'min-content' }}>{detail.name}</P>
        {detail.group_id && !hideGroupLink && (
          <Button
            variant="plain"
            color="primary"
            size="sm"
            sx={{ p: '.1 0' }}
            onClick={e => e.stopPropagation()}
          >
            <Link
              to={open(routeMap.metalflow.detailGroup, detail.group_id)}
              style={{ textDecoration: 'none' }}
            >
              <P color="primary" sx={{ cursor: 'pointer' }}>
                {cache.detailGroups.getGroupName(detail.group_id)}
              </P>
            </Link>
          </Button>
        )}
      </Row>
    )

    if (showLinkButton) {
      return (
        <WithSmallLinkButton
          linkTo={
            detail.id ? open(routeMap.metalflow.detail.edit, detail.id) : '#'
          }
        >
          {name}
        </WithSmallLinkButton>
      )
    }

    return name
  }
)
