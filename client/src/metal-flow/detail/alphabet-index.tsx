import { Button, Stack } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { detailListStore } from '../store'

export const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

export const AlphabetIndex = observer(() => {
  const availableLetters = alphabet.filter(letter =>
    detailListStore.details.some(detail =>
      detail.name.toUpperCase().startsWith(letter)
    )
  )

  if (availableLetters.length === 0) return null

  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', mb: 1 }}>
      {availableLetters.map(letter => (
        <Button
          key={letter}
          size="sm"
          color="neutral"
          variant={detailListStore.indexLetter === letter ? 'solid' : 'plain'}
          onClick={() => detailListStore.searchByFirstLetter(letter)}
        >
          {letter}
        </Button>
      ))}
    </Stack>
  )
})
