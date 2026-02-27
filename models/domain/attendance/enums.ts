export enum EventOrigin {
  TimeTrackingStation = 0, // станция учета времени
  AccessControlPoint = 1, // контрольно-пропускной пункт
}

export enum EventOriginTranslation {
  TimeTrackingStation = 'Таймформер', // станция учета времени
  AccessControlPoint = 'КПП', // контрольно-пропускной пункт
}

export enum AbsenceReason {
  Vacation = 'О',
  AdministrativeVacation = 'A',
  Sick = 'Б',
  Absense = 'П',
  BussinesTrip = 'К',
}
