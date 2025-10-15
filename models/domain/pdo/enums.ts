export enum EnWriteoffReason {
  UsedInProduction = 0,
  Defective = 1,
  InventoryAdjustment = 2,
  Sell = 3
}

export enum EnSupplyReason {
  FromSupplier = 0,
  InternalProduction = 1,
  InventoryAdjustment = 2
}

export enum EnMaterialShape {
  RoundBar = 0,
  List = 1,
  Pipe = 2,
  SquareBar = 3,
  HexagonBar = 4
}

export enum EnUnit {
  Kg = 0,
  M = 1,
  MilliMeter = 2,
  Gram = 3,
  Countable = 4
}

export enum EnWriteoffType {
  ThroughDetail = 0,
  ThroughMaterial = 1
}

export enum EnOperationType {
  Writeoff = 0,
  Supply = 1
}

export enum EnManufacturingOrderStatus {
  Waiting = 0,
  Preparation = 1,
  Production = 2,
  Collected = 3
}

export enum Color {
  Red = 0,
  Orange = 1,
  Green = 2,
  Blue = 3,
  Indigo = 4,
  Violet = 5,
  Black = 6,
  Grey = 7
}
