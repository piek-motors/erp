/** @jsxImportSource @emotion/react */
import { Button, Checkbox, Input, Stack, Typography } from '@mui/joy'
import { monthAdd } from 'lib/date'
import { ReactNode } from 'react'
import { useUpdateTimeDeductionMutation } from 'types/graphql-shema'
import { Row } from '../../shortcuts'
import { State } from './main'

const months = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек'
]

interface IReportConfiguratorProps {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}

export default function ReportConfigurator({
  state,
  setState
}: IReportConfiguratorProps) {
  const [updateTimeDeductionMutation] = useUpdateTimeDeductionMutation()

  const date = new Date()

  const handleMonthClick = (date: Date) => {
    setState({
      ...state,
      employess: [],
      selectedMonth: [date.getMonth(), date.getFullYear()]
    })
  }

  async function handleOnRetentionSave() {
    updateTimeDeductionMutation({
      variables: { ID: 1, TimeDeduction: state.timeRetention }
    })
  }

  function handleShowFullInfo() {
    setState({
      ...state,
      showFullInfo: !state.showFullInfo
    })
  }

  const handleTimeRetentionInput: React.ChangeEventHandler<
    HTMLInputElement
  > = e => {
    setState({
      ...state,
      timeRetention: parseInt(e.target.value)
    })
  }

  return (
    <Stack gap={1}>
      <Row gap={1}>
        {Array.from({ length: 9 }, (v: unknown, k: number) => k).map<ReactNode>(
          i => {
            const suitable = monthAdd(date, -i)
            return (
              <Button
                variant="soft"
                color="neutral"
                key={i}
                onClick={() => handleMonthClick(suitable)}
                className={
                  suitable.getMonth() === state.selectedMonth[0] ? 'active' : ''
                }
              >
                {[months[suitable.getMonth()]]}
              </Button>
            )
          }
        )}
      </Row>

      <Row alignItems={'center'} gap={1}>
        <Typography>Норма вычета времени</Typography>
        <Row gap={1}>
          <Input
            size="sm"
            sx={{ width: 60 }}
            type="number"
            value={state.timeRetention ?? ''}
            onChange={handleTimeRetentionInput}
          />
          <Typography>мин</Typography>
        </Row>

        <Button onClick={handleOnRetentionSave} size="sm">
          Обновить
        </Button>
      </Row>

      <Checkbox
        label="Показывать время прихода и ухода"
        checked={state.showFullInfo}
        onClick={handleShowFullInfo}
      />
    </Stack>
  )
}
