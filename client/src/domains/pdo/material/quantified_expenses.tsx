import { BarChart } from '@mui/x-charts'
import { Tabs } from 'components/tabs'
import { Label, observer, Stack } from 'lib/index'
import { uiUnit } from 'models'
import { MaterialState } from './state'

export const MaterialQuntifiedExpenses = observer(
  ({ m }: { m: MaterialState }) => {
    if (!m.writeoff_stat?.monthly || !m.writeoff_stat?.quarterly) return null

    const height = 300
    const slotProps = {
      barLabel: {
        fontSize: '.8rem'
      },
      tooltip: {
        sx: {
          background: 'var(--joy-palette-neutral-50, #FBFCFE)',
          fontSize: '.8rem'
        }
      }
    }

    const qtyFormatter = (v: number | null) => {
      const unit = uiUnit(m.unit)

      if (typeof v !== 'number') {
        return ''
      }

      if (v > 3) {
        return `${Math.round(v)} ${unit}`
      } else return `${v.toFixed(1)} ${unit}`
    }

    return (
      <Stack gap={1}>
        <Label textAlign={'center'} xs>
          Агрегированный расход
        </Label>
        <Tabs
          size="sm"
          slots={{ tabList: { sx: { justifyContent: 'center' } } }}
          tabs={[
            {
              label: 'Квартальный',
              value: 0,
              component: (
                <BarChart
                  colors={['#308e74']}
                  series={[
                    {
                      data: m.writeoff_stat.quarterly?.map(([_, val]) =>
                        Math.round(val)
                      ),
                      barLabel: 'value',
                      barLabelPlacement: 'outside',
                      valueFormatter: qtyFormatter
                    }
                  ]}
                  grid={{ horizontal: true }}
                  xAxis={[
                    {
                      tickPlacement: 'middle',
                      data: m.writeoff_stat.quarterly?.map(([key]) =>
                        key.slice(2).replace('-', '')
                      )
                    }
                  ]}
                  slotProps={slotProps}
                  height={height}
                />
              )
            },
            {
              label: 'Месячный',
              value: 1,
              component: (
                <BarChart
                  series={[
                    {
                      data: m.writeoff_stat?.monthly?.map(([_, val]) => val),
                      valueFormatter: qtyFormatter
                    }
                  ]}
                  grid={{ horizontal: true }}
                  xAxis={[
                    {
                      data: m.writeoff_stat?.monthly?.map(([d]) => {
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
                  slotProps={slotProps}
                  height={height}
                />
              )
            }
          ]}
        />
      </Stack>
    )
  }
)
