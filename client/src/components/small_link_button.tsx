/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilLink } from '@iconscout/react-unicons'
import { IconButton as MuiJoyIconButton } from '@mui/joy'
import { P, Row, UseIcon, observer } from 'lib/index'
import { Link } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  linkTo: string
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const WithSmallLinkButton = observer((props: Props) => {
  const { children, linkTo, onLinkClick } = props
  const className = 'small-link-button'
  return (
    <Row
      css={css`
        &:hover {
          .${className} {
            opacity: 1;
          }
        }
      `}
    >
      <P sx={{ whiteSpace: 'nowrap' }}>{children}</P>
      {
        <Link to={linkTo}>
          <MuiJoyIconButton
            variant="outlined"
            size="sm"
            className={className}
            sx={{
              opacity: 0,
              transition: 'opacity 50ms ease-in-out'
            }}
            onClick={onLinkClick}
          >
            <UseIcon icon={UilLink} small />
          </MuiJoyIconButton>
        </Link>
      }
    </Row>
  )
})
