import { routeMap } from 'lib/routes'

export type Action = {
  name?: string
  href: string
  childres?: Action[]
  endBlock?: Action[]
}

export const actions: Action[] = [
  {
    name: 'Материалы',
    href: routeMap.pdo.materials,
    endBlock: [
      {
        href: routeMap.pdo.material.new
      }
    ]
  },
  {
    name: 'Детали',
    href: routeMap.pdo.details,
    endBlock: [
      {
        href: routeMap.pdo.detail.new
      }
    ]
  },
  {
    name: 'Группы',
    href: routeMap.pdo.detailGroups
  },
  {
    name: 'Производство',
    href: routeMap.pdo.manufacturing_orders
  },
  {
    name: 'Журнал',
    href: routeMap.pdo.operations
  }
]
