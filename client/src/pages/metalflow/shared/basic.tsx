import {
  Box,
  Button,
  Container,
  ContainerProps,
  ToggleButtonGroup
} from '@mui/joy'
import { EnUnit, UiUnit } from 'shared'

export function WorkPage(props: ContainerProps) {
  return (
    <Container
      {...props}
      sx={{
        ...props.sx,
        m: 0,
        overflow: 'scroll',
        px: '0px!important'
      }}
    >
      {props.children}
    </Container>
  )
}

export function MaterialUnitSelect(props: {
  value: EnUnit
  onChange: (e: EnUnit) => void
}) {
  return (
    <Box>
      <ToggleButtonGroup
        value={props.value.toString()}
        onChange={(e, v) => {
          props.onChange(parseInt(v as any))
        }}
      >
        {Object.entries(UiUnit).map(([key, value]) => {
          return (
            <Button value={key} key={key}>
              {value}
            </Button>
          )
        })}
      </ToggleButtonGroup>
    </Box>
  )
}
