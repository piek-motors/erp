import { Box, Tab, Tabs } from '@mui/material'
import { ReactNode, useState } from 'react'

export function MyTabs(props: {
  data: Record<string, ReactNode>
  handleChange: (shape: number) => void
}) {
  const [tab, setTab] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    props.handleChange(newValue)
  }

  return (
    <Box>
      <Box>
        <Tabs variant="fullWidth" value={tab} onChange={handleChange}>
          {Object.keys(props.data).map((each, idx) => (
            <Tab label={each} />
          ))}
        </Tabs>
      </Box>
      {Object.values(props.data).map((component, idx) => (
        <CustomTabPanel value={tab} index={idx}>
          {component}
        </CustomTabPanel>
      ))}
    </Box>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  )
}
