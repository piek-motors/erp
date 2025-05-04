export enum EnWriteoffReason {
  Production = 0,
  Defective = 1,
  Sale = 2,
  Other = 3
}

export enum EnMaterialShape {
  Circle = 0,
  List = 1,
  Pipe = 2,
  Square = 3
}

export enum EnUnit {
  Kg = 0,
  M = 1,
  MilliMeter = 2,
  Gram = 3
}

export enum EnWriteoffType {
  ThroughDetail = 0,
  DirectUnit = 1
}

export enum EnOrderStatus {
  Registration = 1,
  Production = 2
}

export enum OrderStatus {
  ordRegistration = 1,
  ordProduction = 2,
  ordArchived = 3,
  reclInbox = 10,
  reclDecision = 11,
  reclProduction = 12,
  reclArchived = 13
}

export enum Roles {
  general = 1,
  management = 2,
  bookkeeping = 4,
  manufacture = 3
}
