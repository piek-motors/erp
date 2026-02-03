import type { SxProps } from '@mui/joy/styles/types'
import { app_cache } from 'domains/pdo/cache'
import { Button, observer, Stack } from 'lib'
import { detailListStore } from './store'

export const AlphabetIndex = observer(({ sx }: { sx?: SxProps }) => {
	const isActive = (letter: string) => detailListStore.index_letter === letter
	return (
		<Stack sx={{ flexWrap: 'wrap', width: 'fit-content', ...sx }}>
			{app_cache.details.first_letter_index.map((letter, index) => (
				<Button
					key={letter}
					size="sm"
					sx={{
						p: 1,
						py: 0,
						minHeight: '26px',
						fontSize: '13px',
					}}
					color={isActive(letter) ? 'primary' : 'neutral'}
					variant={isActive(letter) ? 'solid' : 'plain'}
					onClick={() => detailListStore.set_index_letter(letter)}
				>
					{letter}
				</Button>
			))}
		</Stack>
	)
})
