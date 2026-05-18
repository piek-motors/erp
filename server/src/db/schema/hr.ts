import type { GeneratedAlways, Selectable } from 'kysely'
import type { AbsenceReason, EventOrigin } from 'shared'

export interface AccessControlLogTable {
  id: GeneratedAlways<number>
  card: string
  timestamp: Date
  origin: EventOrigin | null
}
export type AccessControlLog = Selectable<AccessControlLogTable>

export interface WorkIntervalTable {
  ent: Date
  ext: Date | null
  card: string
  employee_id: number
  database: string | null
  ent_event_id: number
  ext_event_id: number | null
  updated_manually: boolean | null
}
export type WorkInterval = Selectable<WorkIntervalTable>

export interface EmployeeTable {
  id: GeneratedAlways<number>
  firstname: string
  lastname: string
  card: string
  access_card: string | null
  job_title: string | null
  created_at: GeneratedAlways<Date>
}
export type Employee = Selectable<EmployeeTable>

export interface EmployeeAbsenceTable {
  user_id: number
  date: string
  reason: AbsenceReason
}
export type EmployeeAbsence = Selectable<EmployeeAbsenceTable>
