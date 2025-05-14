import type {
  Generated,
  GeneratedAlways,
  Insertable,
  JSONColumnType,
  Kysely,
  Selectable,
  Updateable
} from 'kysely'
import type {
  EnMaterialShape,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType
} from 'shared/enumerations'

export type KDB = Kysely<DB.Schema>

export namespace DB {
  export interface Schema {
    ['erp.Users']: UserTable
    ['metal_pdo.materials']: MaterialTable
    ['metal_pdo.details']: DetailTable
    ['metal_pdo.detail_materials']: DetailMaterialsTable
    ['metal_pdo.supplies']: SuppliesTable
    ['metal_pdo.writeoffs']: WriteoffsTable
  }

  export interface UserTable {
    UserID: GeneratedAlways<number>
    FirstName: string | null
    LastName: string | null
    Email: string | null
    AccessLevelID: number | null
    Password: string | null
  }
  export type User = Selectable<UserTable>
  export type InsertableUser = Insertable<UserTable>
  export type UpdateableUser = Updateable<UserTable>

  export interface MaterialTable {
    id: Generated<number>
    unit: EnUnit
    shape: EnMaterialShape
    shape_data: JSONColumnType<any, any, any>
  }

  export interface DetailTable {
    id: Generated<number>
    name: string
  }

  export interface DetailMaterialsTable {
    material_id: number
    detail_id: number
    data: JSONColumnType<any, any, any>
  }

  export interface SuppliesTable {
    id: GeneratedAlways<number>
    material_id: number
    qty: number
    supplied_at: Date
    supplier_name: string
  }

  export interface WriteoffsTable {
    id: GeneratedAlways<number>
    material_id: number
    date: Date
    qty: number
    reason: EnWriteoffReason
    type: EnWriteoffType
    type_data: JSONColumnType<any, any, any>
  }
}
