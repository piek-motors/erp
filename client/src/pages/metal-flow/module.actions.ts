import { Icon, UilPlusCircle } from '@iconscout/react-unicons'
import { routeMap } from 'lib/routes'
import { t } from './text'

export type Action = {
  name?: string
  href: string
  icon?: Icon
  childres?: Action[]
  endBlock?: Action[]
}

export const actions: Action[] = [
  {
    name: t.MaterialsList,
    href: routeMap.metalflow.materials,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: routeMap.metalflow.material.new
      }
    ]
  },
  {
    name: t.DetailsList,
    href: routeMap.metalflow.details,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: routeMap.metalflow.detail.new
      }
    ]
  },
  {
    name: t.SuppliesList,
    href: routeMap.metalflow.supplies,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: routeMap.metalflow.supply.new
      }
    ]
  },
  {
    name: t.WriteoffsList,
    href: routeMap.metalflow.writeoffs,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: routeMap.metalflow.writeoff.new
      }
    ]
  }
]

export const SupplyAddAction = actions.find(e => e.name === t.SuppliesList)!
export const WriteoffAction = actions.find(e => e.name === t.WriteoffsList)!
