import {
  MaterialRequirement,
  MaterialShape,
  OrderPriority,
  ProductionOrderStatus,
  SupplyReason,
  Unit,
  WriteoffReason,
  WriteoffType,
} from './enums.js'

export const UiWriteoffReason = {
  [WriteoffReason.ProductionUse]: 'Производство',
  [WriteoffReason.DefectLoss]: 'Брак',
  [WriteoffReason.StockCorrection]: 'Коррект.',
  [WriteoffReason.Sale]: 'Продажа',
}
export function uiWriteoffReason(reason?: WriteoffReason | null) {
  if (reason == null) return '-'
  return UiWriteoffReason[reason]
}

export const UiSupplyReason = {
  [SupplyReason.Purchase]: 'Покупка',
  [SupplyReason.ProductionOutput]: 'Собств. производство',
  [SupplyReason.StockCorrection]: 'Коррект.',
}

export function uiSupplyReason(reason?: SupplyReason | null) {
  if (reason == null) return '-'
  return UiSupplyReason[reason]
}

export const UiMaterialShape = {
  [MaterialShape.RoundBar]: 'Круг',
  [MaterialShape.List]: 'Лист',
  [MaterialShape.Pipe]: 'Труба',
  [MaterialShape.SquareBar]: 'Квадрат',
  [MaterialShape.HexagonBar]: 'Шестигранник',
  [MaterialShape.Arbitrary]: 'Произвольный',
}

export function uiMaterialShape(shape: MaterialShape) {
  return UiMaterialShape[shape]
}

export const UiUnit = {
  [Unit.Kg]: 'кг',
  [Unit.M]: 'м',
  [Unit.MilliMeter]: 'мм',
  [Unit.Gram]: 'гр',
  [Unit.Countable]: 'шт',
}

export function uiUnit(unit: Unit | null) {
  if (unit == null) return '-'
  return UiUnit[unit]
}

export const UiWriteoffType = {
  [WriteoffType.ThroughDetail]: 'Через деталь',
  [WriteoffType.ThroughMaterial]: 'Прямо в единицу',
}

export function uiWriteoffType(type: WriteoffType) {
  return UiWriteoffType[type]
}

export const UiManufacturingOrderStatus = {
  [ProductionOrderStatus.Waiting]: 'Ожидание',
  [ProductionOrderStatus.Preparation]: 'Подготовка',
  [ProductionOrderStatus.Production]: 'Производство',
  [ProductionOrderStatus.Archived]: 'Архив',
}

export function uiManufacturingOrderStatus(status: ProductionOrderStatus) {
  return UiManufacturingOrderStatus[status]
}

export const UiMaterialRequirement = {
  [MaterialRequirement.Single]: 'В размер',
  [MaterialRequirement.Batch]: 'С прутка',
  [MaterialRequirement.Countable]: 'Готовая',
}

export const UiOrderPriority = {
  [OrderPriority.Low]: 'Низкий',
  [OrderPriority.Normal]: 'Обычный',
  [OrderPriority.High]: 'Высокий',
}
