import { UilPlus } from '@iconscout/react-unicons'
import { routeMap } from 'lib/routes'
import { UseIcon } from 'lib/shortcuts'
import { t } from './text'

export type Action = {
  name?: string
  href: string
  icon?: React.ReactNode
  childres?: Action[]
  endBlock?: Action[]
}

export const actions: Action[] = [
  {
    name: t.MaterialsList,
    href: routeMap.metalflow.materials,
    endBlock: [
      {
        icon: <UseIcon icon={UilPlus} small />,
        href: routeMap.metalflow.material.new
      }
    ]
  },
  {
    name: t.DetailsList,
    href: routeMap.metalflow.details,
    endBlock: [
      {
        icon: <UseIcon icon={UilPlus} small />,
        href: routeMap.metalflow.detail.new
      }
    ]
  },
  {
    name: t.SuppliesList,
    href: routeMap.metalflow.supplies,
    endBlock: [
      {
        icon: <UseIcon icon={UilPlus} small />,
        href: routeMap.metalflow.supply.new
      }
    ]
  },
  {
    name: t.WriteoffsList,
    href: routeMap.metalflow.writeoffs,
    endBlock: [
      {
        icon: <UseIcon icon={UilPlus} small />,
        href: routeMap.metalflow.writeoff.new
      }
    ]
  }
]
