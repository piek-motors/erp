import type { CriteriaBasedSearchConfig } from '@/lib/utils/search'
import { app_cache } from '../../cache'
import type { AppDetail } from '../../cache/detail_cache'

export enum SearchCriteria {
  Id = '№',
  Name = 'Наим.',
  DrawingNumber = 'Чертеж',
}

export const search_config: CriteriaBasedSearchConfig<
  AppDetail,
  SearchCriteria
> = {
  [SearchCriteria.Name]: {
    fields: [
      {
        get: d => d.normalized_name,
      },
      {
        get: d => app_cache.groups.tree.full_node_names(d.group_ids).join(' '),
      },
    ],
  },
  [SearchCriteria.Id]: {
    fields: [
      {
        get: d => d.id.toString(),
        match: 'exact',
      },
    ],
  },
  [SearchCriteria.DrawingNumber]: {
    fields: [
      {
        get: d => d.drawing_number ?? '',
        match: 'includes',
      },
    ],
  },
}
