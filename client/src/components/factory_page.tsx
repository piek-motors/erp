import { Stack } from '@mui/joy'
import { ReactNode } from 'react'
import { NavigationBar } from './navigation_bar'

export const FactoryPage = (props: {
  pageTitle: string
  header?: ReactNode
  children: ReactNode
}) => {
  return (
    <Stack gap={1} p={1} sx={{ overflow: 'auto' }}>
      <NavigationBar t={props.pageTitle}>{props.header}</NavigationBar>
      <Stack gap={1}>{props.children}</Stack>
    </Stack>
  )
}
