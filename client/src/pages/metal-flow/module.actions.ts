import { Icon, UilPlusCircle } from '@iconscout/react-unicons'
import { MetalFlowRoutes } from 'lib/routes'
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
    href: MetalFlowRoutes.materials,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowRoutes.material_add
      }
    ]
  },
  {
    name: t.DetailsList,
    href: MetalFlowRoutes.details,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowRoutes.detail_add
      }
    ]
  },
  {
    name: t.SuppliesList,
    href: MetalFlowRoutes.supplies,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowRoutes.supply_add
      }
    ]
  },
  {
    name: t.WriteoffsList,
    href: MetalFlowRoutes.writeoffs,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowRoutes.writeoff_add
      }
    ]
  }
]

export const SupplyAddAction = actions.find(e => e.name === t.SuppliesList)!
export const WriteoffAction = actions.find(e => e.name === t.WriteoffsList)!
