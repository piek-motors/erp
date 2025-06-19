import { routeMap } from 'lib/routes'
import { t } from './text'

export type Action = {
  name?: string
  href: string
  childres?: Action[]
  endBlock?: Action[]
}

export const actions: Action[] = [
  {
    name: t.MaterialsList,
    href: routeMap.metalflow.materials,
    endBlock: [
      {
        href: routeMap.metalflow.material.new
      }
    ]
  },
  {
    name: t.DetailsList,
    href: routeMap.metalflow.details,
    endBlock: [
      {
        href: routeMap.metalflow.detail.new
      }
    ]
  },
  {
    name: t.SuppliesList,
    href: routeMap.metalflow.supplies,
    endBlock: [
      {
        href: routeMap.metalflow.supply.new
      }
    ]
  },
  {
    name: t.WriteoffsList,
    href: routeMap.metalflow.writeoffs,
    endBlock: [
      {
        href: routeMap.metalflow.writeoff.new
      }
    ]
  }
]
