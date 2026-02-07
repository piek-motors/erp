/**
 * Reasons why inventory quantity is decreased.
 * Used for write-offs, consumption, and other outbound stock movements.
 */
export enum WriteoffReason {
  /**
   * Materials or goods were consumed during the production process
   * and are no longer available in stock.
   */
  ProductionUse = 0,
  /**
   * Items were written off due to defects, damage, or loss
   * making them unsuitable for further use or sale.
   */
  DefectLoss = 1,
  /**
   * Manual or system-driven correction of stock levels
   * caused by inventory count discrepancies or accounting adjustments.
   */
  StockCorrection = 2,
  /**
   * Items were sold to a customer and physically left the inventory.
   */
  Sale = 3,
}

/**
 * Reasons why inventory quantity is increased.
 * Used for inbound stock movements.
 */
export enum SupplyReason {
  /**
   * Items were received from an external supplier
   * as a result of a purchase or delivery.
   */
  Purchase = 0,
  /**
   * Finished or semi-finished goods produced internally
   * and added to inventory as production output.
   */
  ProductionOutput = 1,
  /**
   * Manual or system-driven correction of stock levels
   * caused by inventory count discrepancies or accounting adjustments.
   */
  StockCorrection = 2,
}

export enum MaterialShape {
  RoundBar = 0,
  List = 1,
  Pipe = 2,
  SquareBar = 3,
  HexagonBar = 4,
  Arbitrary = 5,
}

export enum Unit {
  Kg = 0,
  M = 1,
  MilliMeter = 2,
  Gram = 3,
  Countable = 4,
}

export enum WriteoffType {
  ThroughDetail = 0,
  ThroughMaterial = 1,
}

export enum OperationType {
  Writeoff = 0,
  Supply = 1,
}

export enum ProductionOrderStatus {
  Waiting = 0,
  Preparation = 1,
  Production = 2,
  Archived = 3,
}

export enum Color {
  Red = 0,
  Orange = 1,
  Green = 2,
  Blue = 3,
  Indigo = 4,
  Violet = 5,
  Black = 6,
  Grey = 7,
}

export enum MaterialRequirement {
  Single = 0,
  Batch = 1,
  Countable = 2,
}

export enum OrderPriority {
  Low = 0,
  Normal = 1,
  High = 2,
}
