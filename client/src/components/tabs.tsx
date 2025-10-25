import { Tabs as MuiTabs, Tab, TabList, TabPanel } from '@mui/joy'
import { ReactNode } from 'react'

export type TabConfig = {
  value: string | number
  label: string
  component: ReactNode
}[]

export interface TabProps {
  handleChange?: (newVal: any) => void
  value?: string
  tabs: TabConfig
  p?: number
}

export function Tabs(props: TabProps) {
  return (
    <MuiTabs
      variant="outlined"
      sx={{ borderRadius: 'sm', minWidth: 'fit-content' }}
      value={props.value}
      onChange={(e, v) => {
        if (v == null) return
        if (props.handleChange) {
          props.handleChange(v)
        }
      }}
    >
      <TabList>
        {props.tabs.map(({ value, label }, idx) => (
          <Tab
            key={value}
            color={props.value == value ? 'primary' : 'neutral'}
            variant={props.value == value ? 'soft' : 'plain'}
          >
            {label}
          </Tab>
        ))}
      </TabList>
      {props.tabs.map(({ value, component }, idx) => (
        <TabPanel key={value} value={value} sx={{ p: props.p }}>
          {component}
        </TabPanel>
      ))}
    </MuiTabs>
  )
}
