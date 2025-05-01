import { Button, Container, ContainerProps, Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, P } from '../../../shortcuts'
import { ErrorHint, SavedHint } from '../shared'
import { t } from '../text'

export function WorkPage(props: ContainerProps) {
  return (
    <Container
      {...props}
      sx={{
        ...props.sx,
        m: 0,
        py: 2,
        overflow: 'scroll',
        px: '0px!important'
      }}
    >
      {props.children}
    </Container>
  )
}

export function TakeLookHint(props: { text: string; link: string }) {
  const navigate = useNavigate()

  return (
    <Stack direction={'row'} alignItems={'center'} gap={2} pt={2}>
      <P
        variant="caption"
        sx={{
          p: 0
        }}
      >
        {props.text}
      </P>
      <Btn
        onClick={() => navigate(props.link)}
        size="small"
        variant="outlined"
        color="success"
      >
        {t.TakeLook}
      </Btn>
    </Stack>
  )
}

export function MutationWithStatus(props: {
  mutation: () => Promise<any>
  customComponent?: (error?: Error, mutationResult?: any) => JSX.Element
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error>()
  const [mutationResult, setMutationResult] = React.useState<unknown>()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await props.mutation()
      setMutationResult(result)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Stack gap={1}>
      <ErrorHint show={error} msg={error?.message} />
      <SavedHint show={mutationResult} />
      <Button
        variant="contained"
        onClick={async () => handleSubmit()}
        disabled={loading}
      >
        {t.Save}
      </Button>
      {(mutationResult || error) &&
        props.customComponent?.(error, mutationResult)}
    </Stack>
  )
}
