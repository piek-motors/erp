import { Box, Tab, Tabs } from '@mui/material'
import { ReactNode, useState } from 'react'

export function ShapeDependedTabs(props: {
  data: Record<string, ReactNode>
  handleChange: (shape: string) => void
}) {
  const [tab, setTab] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    const shape = Object.keys(props.data)[newValue]
    props.handleChange(shape)
  }

  return (
    <Box
      sx={{
        width: '100%',
        background: 'var(--L2)',
        border: 'var(--border)',
        borderRadius: 3,
        my: 1
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange}>
          {Object.keys(props.data).map((each, idx) => (
            <Tab label={each} {...a11yProps(idx)} />
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
