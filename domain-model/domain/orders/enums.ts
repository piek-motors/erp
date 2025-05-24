export enum EnOrderStatus {
  Registration = 1,
  Production = 2
}

export enum OrderStatus {
  PreOrder = 1,
  InProduction = 2,
  Archived = 3,
  ReclamationIncoming = 10,
  ReclamationDecision = 11,
  ReclamationInProduction = 12,
  ReclamationArchived = 13
}

export enum Roles {
  general = 1,
  management = 2,
  bookkeeping = 4,
  manufacture = 3
}
