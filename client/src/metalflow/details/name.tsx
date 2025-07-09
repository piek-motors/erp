/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { WithSmallLinkButton } from 'components/small_link_button'
import { Button, P, Row, observer } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { cache } from 'metalflow/cache/root'
import { Link } from 'react-router-dom'
import { DetailParamsPopup } from './detail-params-popup'

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
    showParamsButton?: boolean
  }) => {
    const { detail, showLinkButton, hideGroupLink, showParamsButton } = props

    const name = (
      <Row
        css={css`
          &:hover .params-button {
            opacity: 1;
            visibility: visible;
          }
        `}
      >
        <P sx={{ whiteSpace: 'nowrap', width: 'min-content' }}>{detail.name}</P>
        {detail.group_id && !hideGroupLink && (
          <Link
            to={open(routeMap.metalflow.detailGroup, detail.group_id)}
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="plain"
              color="primary"
              size="sm"
              sx={{ p: '.1 0' }}
              onClick={e => e.stopPropagation()}
            >
              <P color="primary" sx={{ cursor: 'pointer' }}>
                {cache.detailGroups.getGroupName(detail.group_id)}
              </P>
            </Button>
          </Link>
        )}
        {showParamsButton && (
          <div
            className="params-button"
            css={css`
              opacity: 0;
              visibility: hidden;
              transition: opacity 100ms ease-in-out,
                visibility 100ms ease-in-out;
            `}
          >
            <DetailParamsPopup detailId={detail.id} />
          </div>
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
