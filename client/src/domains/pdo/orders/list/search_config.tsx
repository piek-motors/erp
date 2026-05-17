import type { CriteriaBasedSearchConfig } from '@/lib/utils/search'
import type { ListOrdersOutput } from '@/server/domains/pdo/orders_rpc'
import { app_cache } from '../../cache'

export enum SearchCriteria {
  Id = '№',
  Detail = 'Деталь',
  Operation = 'Операция',
}

export const search_config: CriteriaBasedSearchConfig<
  ListOrdersOutput,
  SearchCriteria
> = {
  [SearchCriteria.Id]: {
    fields: [{ get: o => String(o.id), match: 'exact' }],
  },
  [SearchCriteria.Detail]: {
    fields: [
      { get: o => o.detail_name, weight: 3 },
      { get: o => String(o.id), match: 'exact' },
      {
        get: o => app_cache.groups.tree.full_node_names(o.group_ids).join(' '),
      },
    ],
  },
  [SearchCriteria.Operation]: {
    fields: [{ get: o => o.current_operation || '', match: 'start_with' }],
  },
}
