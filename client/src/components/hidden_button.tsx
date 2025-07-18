/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilLink } from '@iconscout/react-unicons'
import { IconButton as MuiJoyIconButton } from '@mui/joy'
import { P, Row, UseIcon } from 'lib/index'
import { Link } from 'react-router-dom'

// Generic abstract component for showing hidden content on hover
interface HoverRevealProps {
  children: React.ReactNode
  hidden: React.ReactNode
  css?: any
}

export const HoverReveal = (props: HoverRevealProps) => {
  const className = 'hover-reveal-hidden'
  return (
    <Row
      css={css`
        &:hover {
          .${className} {
            opacity: 1 !important;
          }
        }
      `}
    >
      {props.children}
      <div
        className={className}
        style={{ opacity: 0, transition: 'opacity 100ms ease-in-out' }}
      >
        {props.hidden}
      </div>
    </Row>
  )
}

interface Props {
  children: React.ReactNode
  linkTo: string
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const WithHiddenLinkButton = (props: Props) => (
  <HoverReveal
    hidden={
      <Link to={props.linkTo}>
        <MuiJoyIconButton
          variant="outlined"
          size="sm"
          onClick={props.onLinkClick}
        >
          <UseIcon icon={UilLink} small />
        </MuiJoyIconButton>
      </Link>
    }
  >
    <P sx={{ whiteSpace: 'nowrap' }}>{props.children}</P>
  </HoverReveal>
)
