import { Tab, TabList, TabPanel, Tabs } from '@mui/joy'
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
    <Tabs value={tab}>
      <TabList>
        {Object.keys(props.data).map((each, idx) => (
          <Tab key={each}> {each}</Tab>
        ))}
      </TabList>
      {Object.values(props.data).map((component, idx) => (
        <TabPanel key={idx} value={tab}>
          {component}
        </TabPanel>
      ))}
    </Tabs>
  )
}
