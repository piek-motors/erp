import { Container, Stack } from '@mui/joy'
import { MobileOnly, P } from 'lib/index'
import { MobileNavigationLinks } from './shared/nav'

export function UsageInstruction() {
  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <P level="h4" fontWeight={700}>
          Добро пожаловать в систему управления металлопотоками
        </P>

        <MobileOnly>
          <MobileNavigationLinks />
        </MobileOnly>

        <Stack spacing={3}>
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
          <P>
            4. <strong>Управление деталями:</strong> Для списания материала
            через детали, необходимо указать из какого материала изготовлена
            деталь. Это позволит системе автоматически рассчитать количество
            списанного материала при создании детали.
          </P>

          <P level="body-sm" color="neutral">
            Обратную связь по системе можно отправить голосовым сообщение в
            телеграме <P fontWeight={700}>@invalid_parameter</P> или текстом на
            почту <P fontWeight={700}>loseev5@gmail.com</P>
          </P>
        </Stack>
      </Stack>
    </Container>
  )
}
