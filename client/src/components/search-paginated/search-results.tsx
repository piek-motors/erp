import { Box, Button } from '@mui/joy'
import { observer, P, Stack } from 'lib/index'
import type { ReactNode } from 'react'
import type { PaginatedSearchStore, SearchableItem } from './store'

interface SearchResultsProps<T extends SearchableItem> {
	store: PaginatedSearchStore<T>
	children: ReactNode
	emptyMessage?: string
	loadMoreText?: string
}

export const SearchResults = observer(
	<T extends SearchableItem>({
		store,
		children,
		emptyMessage = 'Результаты не найдены',
		loadMoreText = 'Показать еще',
	}: SearchResultsProps<T>) => {
		return (
			<Stack gap={1}>
				{/* Search indicator */}
				{store.isSearching && (
					<P level="body-sm" color="neutral" sx={{ fontStyle: 'italic' }}>
						Поиск...
					</P>
				)}

				{/* Results summary */}
				{store.searchResult.length > 0 && (
					<P level="body-xs" color="neutral">
						Показано {store.displayedResults.length} из{' '}
						{store.searchResult.length} деталей
					</P>
				)}

				{/* Main content */}
				{children}

				{/* Load More button */}
				{store.hasMore && (
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 0 }}>
						<Button
							variant="outlined"
							color="neutral"
							onClick={() => store.loadMore()}
							disabled={store.isSearching}
						>
							{loadMoreText}{' '}
							{store.searchResult.length - store.displayedResults.length}
						</Button>
					</Box>
				)}

				{/* No results message */}
				{store.searchResult.length === 0 && !store.isSearching && (
					<P
						level="body-sm"
						color="neutral"
						sx={{ textAlign: 'center', mt: 2 }}
					>
						{emptyMessage}
					</P>
				)}
			</Stack>
		)
	},
)
