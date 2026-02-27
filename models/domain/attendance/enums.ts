export enum EventOrigin {
  TimeTrackingStation = 0, // станция учета времени
  AccessControlPoint = 1, // контрольно-пропускной пункт
}

export const UiEventOrigin = {
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
