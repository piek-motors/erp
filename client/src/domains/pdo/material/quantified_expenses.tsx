import { BarChart } from '@mui/x-charts'
import { Tabs } from 'components/tabs'
import { Label, observer, Stack } from 'lib/index'
import { uiUnit } from 'models'
import { MaterialState } from './state'

export const MaterialQuntifiedExpenses = observer(
  ({ m }: { m: MaterialState }) => {
    if (!m.writeoffStat?.monthly || !m.writeoffStat?.quarterly) return null
    const margin = {
      top: 15,
      right: 15,
      bottom: 0,
      left: -30
    }
    return (
      <Stack gap={1}>
        <Label textAlign={'center'}>Агрегированный расход</Label>
        <Tabs
          size="sm"
          slots={{ tabList: { sx: { justifyContent: 'center' } } }}
          tabs={[
            {
              label: 'Квартальный',
              value: 0,
              component: (
                <BarChart
                  margin={margin}
                  colors={['#308e74']}
                  series={[
                    {
                      data: m.writeoffStat.quarterly?.map(([_, val]) =>
                        Math.round(val)
                      ),
                      barLabel: 'value',
                      barLabelPlacement: 'outside',
                      valueFormatter: v => {
                        if (typeof v == 'number') {
                          return `${Math.round(v)} ${uiUnit(m.unit)}`
                        }
                        return ''
                      }
                    }
                  ]}
                  grid={{ horizontal: true }}
                  xAxis={[
                    {
                      tickPlacement: 'middle',
                      data: m.writeoffStat.quarterly?.map(([key]) =>
                        key.slice(2).replace('-', '')
                      )
                    }
                  ]}
                  slotProps={{
                    barLabel: {
                      fontSize: '.8rem'
                    },
                    tooltip: {
                      sx: {
                        background: 'var(--joy-palette-neutral-50, #FBFCFE)',
                        fontSize: '.8rem'
                      }
                    }
                  }}
                  height={200}
                />
              )
            },
            {
              label: 'Месячный',
              value: 1,
              component: (
                <BarChart
                  margin={margin}
                  series={[
                    {
                      data: m.writeoffStat?.monthly?.map(([_, val]) => val),
                      valueFormatter: v => {
                        if (typeof v == 'number') {
                          return `${Math.round(v)} ${uiUnit(m.unit)}`
                        }
                        return ''
                      }
                    }
                  ]}
                  grid={{ horizontal: true }}
                  xAxis={[
                    {
                      data: m.writeoffStat?.monthly?.map(([d]) => {
                        const [year, month] = d.split('-')
                        return new Date(+year, +month - 1)
                      }),
                      ordinalTimeTicks: ['years', 'quarterly', 'months'],
                      valueFormatter: v =>
                        Intl.DateTimeFormat('ru-RU', {
                          month: 'short',
                          year: '2-digit'
                        }).format(v) ?? ''
                    }
                  ]}
                  slotProps={{
                    tooltip: {
                      sx: {
                        background: 'var(--joy-palette-neutral-50, #FBFCFE)',
                        fontSize: '.8rem'
                      }
                    }
                  }}
                  height={200}
                />
              )
            }
          ]}
        />
      </Stack>
    )
  }
)
