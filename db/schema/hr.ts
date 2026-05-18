import type { GeneratedAlways } from 'kysely'
import type { AbsenceReason, EventOrigin } from 'models'

export interface AttendanceEventsTable {
  id: GeneratedAlways<number>
  card: string
  timestamp: Date
  origin: EventOrigin | null
}

export interface AttendanceIntervalTable {
  ent: Date
  ext: Date | null
  card: string
  employee_id: number
  database: string | null
  ent_event_id: number
  ext_event_id: number | null
  updated_manually: boolean | null
}

export interface AttendanceEmployeeTable {
  id: GeneratedAlways<number>
  firstname: string
  lastname: string
  card: string
  access_card: string | null
  job_title: string | null
  created_at: GeneratedAlways<Date>
}

export interface AttendanceEmployeeAbsenceTable {
  user_id: number
  date: string
  reason: AbsenceReason
}
