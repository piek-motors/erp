import type { CriteriaBasedSearchConfig } from '@/lib/utils/search'
import { normalize } from '@/lib/utils/search'
import { app_cache } from '../../cache'
import type { GroupAssigment } from '../detail.state'

export interface DetailSearchEntity {
  id: number
  name: string
  normalized_name?: string
  drawing_number?: string | null
  stock_location?: string | null
  group_ids?: number[]
  group_assigment?: GroupAssigment
}

export enum SearchCriteria {
  Id = '№',
  Name = 'Наим.',
  DrawingNumber = 'Чертеж',
  Address = 'Адрес',
}

export const search_config: CriteriaBasedSearchConfig<
  DetailSearchEntity,
  SearchCriteria
> = {
  [SearchCriteria.Name]: {
    fields: [
      {
        get: d => d.normalized_name ?? normalize(d.name),
      },
      {
        get: d =>
          app_cache.groups.tree
            .full_node_names(d.group_ids ?? d.group_assigment?.group_ids ?? [])
            .join(' '),
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
  [SearchCriteria.Address]: {
    fields: [
      {
        get: d => d.stock_location ?? '',
        match: 'start_with',
      },
    ],
  },
}
