import {
  ManufacturingOrderStatus,
  MaterialRequirement,
  MaterialShape,
  OrderPriority,
  SupplyReason,
  Unit,
  WriteoffReason,
  WriteoffType,
} from './enums'

export const UiWriteoffReason = {
  [WriteoffReason.UsedInProduction]: 'Производство',
  [WriteoffReason.Defective]: 'Брак',
  [WriteoffReason.InventoryAdjustment]: 'Инвентаризация',
  [WriteoffReason.Sell]: 'Продажа',
}
export function uiWriteoffReason(reason?: WriteoffReason | null) {
  if (reason == null) return '-'
  return UiWriteoffReason[reason]
}

export const UiSupplyReason = {
  [SupplyReason.FromSupplier]: 'Поставка',
  [SupplyReason.InternalProduction]: 'Собств. производство',
  [SupplyReason.InventoryAdjustment]: 'Инвентаризация',
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
  [ManufacturingOrderStatus.Waiting]: 'Ожидание',
  [ManufacturingOrderStatus.Preparation]: 'Подготовка',
  [ManufacturingOrderStatus.Production]: 'Производство',
  [ManufacturingOrderStatus.Archived]: 'Архив',
}

export function uiManufacturingOrderStatus(status: ManufacturingOrderStatus) {
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
