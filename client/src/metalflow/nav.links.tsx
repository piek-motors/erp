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
    href: routeMap.metalflow.materials,
    endBlock: [
      {
        href: routeMap.metalflow.material.new
      }
    ]
  },
  {
    name: 'Детали',
    href: routeMap.metalflow.details,
    endBlock: [
      {
        href: routeMap.metalflow.detail.new
      }
    ]
  },
  {
    name: 'Детали в производстве',
    href: routeMap.metalflow.manufacturing
  },
  {
    name: 'Журнал операций',
    href: routeMap.metalflow.operations
  }
]
