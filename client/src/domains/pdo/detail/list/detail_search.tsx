import { SearchWithCriteria } from '@/components/inputs/search_input_with_criteria'
import { observer } from '@/lib/index'
import { detail_list_vm as state } from './detail_list_vm'
import { SearchCriteria } from './search_config'

interface DetailSearchProps {
  criteria?: SearchCriteria
  onCriteriaChange?: (criteria: SearchCriteria) => void
  query?: string
  onQueryChange?: (query: string) => void
}

export const DetailSearch = observer((props: DetailSearchProps) => (
  <SearchWithCriteria
    variant="soft"
    color="primary"
    criteriaOptions={SearchCriteria}
    criteria={props.criteria ?? state.search_criteria}
    onCriteriaChange={c =>
      props.onCriteriaChange
        ? props.onCriteriaChange(c)
        : state.set_search_criteria(c)
    }
    query={props.query ?? state.query ?? ''}
    onQueryChange={v =>
      props.onQueryChange ? props.onQueryChange(v) : state.set_query(v)
    }
  />
))
