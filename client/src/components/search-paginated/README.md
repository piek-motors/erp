# Paginated Search Component

This directory contains a reusable paginated search functionality using composition instead of inheritance.

## Components

- **`PaginatedSearchStore`**: A MobX store that handles search, filtering, and pagination
- **`SearchResults`**: A React component that renders search results with pagination controls

## Usage

### Basic Usage

```typescript
import { PaginatedSearchStore, SearchResults } from '@/components/search-paginated'

// Create a store with a data source
const searchStore = new PaginatedSearchStore(
  () => getAllItems(), // Function that returns your data
  {
    debounceMs: 100,    // Search debounce delay
    pageSize: 50,       // Items per page
  }
)

// Use in your component
<SearchResults store={searchStore}>
  {searchStore.displayedResults.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</SearchResults>
```

### Advanced Usage with Custom Filtering

```typescript
const searchStore = new PaginatedSearchStore(() => getAllItems(), {
  customFilter: (items, filters) => {
    // Your custom filtering logic
    if (filters.keyword) {
      return items.filter(item =>
        item.name.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    }
    return items
  }
})
```

### Search Methods

- `setSearchKeyword(keyword)`: Search by text
- `setSearchId(id)`: Search by ID
- `setSearchFilter(key, value)`: Set custom filter
- `clearFilters()`: Clear all filters
- `loadMore()`: Load more results
- `clear()`: Reset everything

### Properties

- `searchResult`: All filtered results
- `displayedResults`: Currently displayed results (with pagination)
- `isSearching`: Whether search is in progress
- `hasMore`: Whether there are more results to load

## Benefits of Composition

- **Flexibility**: Easy to extend with custom filtering logic
- **Reusability**: Can be used with any data type
- **Testability**: Store and component can be tested independently
- **No MobX inheritance issues**: Uses composition instead of class inheritance
