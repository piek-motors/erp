import { Icon, UilPlusCircle } from '@iconscout/react-unicons'
import { MetalFlowSys } from 'lib/routes'
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
    href: MetalFlowSys.materials,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowSys.material_add
      }
    ]
  },
  {
    name: t.DetailsList,
    href: MetalFlowSys.details,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowSys.detail_add
      }
    ]
  },
  {
    name: t.SuppliesList,
    href: MetalFlowSys.supplies,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowSys.supply_add
      }
    ]
  },
  {
    name: t.WriteoffsList,
    href: MetalFlowSys.writeoffs,
    endBlock: [
      {
        icon: UilPlusCircle,
        href: MetalFlowSys.writeoff_add
      }
    ]
  }
]

export const SupplyAddAction = actions.find(e => e.name === t.SuppliesList)!
export const WriteoffAction = actions.find(e => e.name === t.WriteoffsList)!
