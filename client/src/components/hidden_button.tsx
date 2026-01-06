/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilLink } from '@iconscout/react-unicons'
import { StackProps } from '@mui/joy'
import { P, Row } from 'lib/index'
import { ExtraSmallIconButton } from './buttons'

// Generic abstract component for showing hidden content on hover
interface HoverRevealProps {
  children: React.ReactNode
  hiddenComp: React.ReactNode
  css?: any
}

export const HoverReveal = (props: StackProps & HoverRevealProps) => {
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
      {...props}
    >
      {props.children}
      <div
        className={className}
        style={{ opacity: 0, transition: 'opacity 100ms ease-in-out' }}
      >
        {props.hiddenComp}
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
    hiddenComp={<ExtraSmallIconButton link={props.linkTo} icon={UilLink} />}
  >
    <P sx={{ whiteSpace: 'nowrap' }}>{props.children}</P>
  </HoverReveal>
)
