export enum EventOrigin {
  TimeTrackingStation = 0, // станция учета времени
  AccessControlPoint = 1, // контрольно-пропускной пункт
}

export const UiEventOrigin: Record<EventOrigin, string> = {
  [EventOrigin.AccessControlPoint]: 'КПП',
  [EventOrigin.TimeTrackingStation]: 'Таймформер',
}

export enum AbsenceReason {
  Vacation = 'О',
  AdministrativeVacation = 'A',
  Sick = 'Б',
  Absense = 'П',
  BussinesTrip = 'К',
}

export const UiAbsenceReason: Record<AbsenceReason, string> = {
  [AbsenceReason.Vacation]: 'Отпуск',
  [AbsenceReason.AdministrativeVacation]: 'Административный отпуск',
  [AbsenceReason.Sick]: 'Болеет',
  [AbsenceReason.Absense]: 'Пропуск',
  [AbsenceReason.BussinesTrip]: 'Командировка',
}
