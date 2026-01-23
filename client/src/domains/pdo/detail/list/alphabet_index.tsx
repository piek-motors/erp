import type { SxProps } from '@mui/joy/styles/types'
import { cache } from 'domains/pdo/cache/root'
import { Button, observer, Stack } from 'lib'
import { detailListStore } from './store'

export const AlphabetIndex = observer(({ sx }: { sx?: SxProps }) => {
	const isActive = (letter: string) => detailListStore.indexLetter === letter
	return (
		<Stack sx={{ flexWrap: 'wrap', width: 'fit-content', ...sx }}>
			{cache.details.getFirstLetterIndex().map((letter, index) => (
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
					onClick={() => detailListStore.setIndexLetter(letter)}
				>
					{letter}
				</Button>
			))}
		</Stack>
	)
})
