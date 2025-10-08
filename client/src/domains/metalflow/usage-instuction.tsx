import { Container, Stack } from '@mui/joy'
import { MobileOnly, P } from 'lib/index'
import { MobileNavigationLinks } from './shared/nav'

export function UsageInstruction() {
  return (
    <Stack spacing={4}>
      <MobileOnly>
        <MobileNavigationLinks />
      </MobileOnly>

      <Container maxWidth="sm">
        <Stack spacing={3} p={2}>
          <P>
            1. <strong>Внесение материалов:</strong> Когда приходит материал на
            предприятие, сразу вносите его в систему через телефон, чтобы не
            забыть.
          </P>
          <P>
            2. <strong>Создание нового материала:</strong> Если материал еще не
            создан в системе, используйте кнопку с плюсом в панели навигации
            слева, чтобы добавить его.
          </P>
          <P level="body-sm" color="neutral">
            Обратную связь по системе можно отправить голосовым сообщение в
            телеграме <P fontWeight={700}>@invalid_parameter</P> или текстом на
            почту <P fontWeight={700}>loseev5@gmail.com</P>
          </P>
        </Stack>
      </Container>
    </Stack>
  )
}
