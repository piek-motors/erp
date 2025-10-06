import {
  EnManufacturingOrderStatus,
  EnMaterialShape,
  EnSupplyReason,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType
} from './enums'

export const UiWriteoffReason = {
  [EnWriteoffReason.UsedInProduction]: 'Производство',
  [EnWriteoffReason.Defective]: 'Брак продукта',
  [EnWriteoffReason.InventoryAdjustment]: 'Инвентаризация',
  [EnWriteoffReason.Sell]: 'Продажа'
}
export function uiWriteoffReason(reason?: EnWriteoffReason | null) {
  if (reason == null) return '-'
  return UiWriteoffReason[reason]
}

export const UiSupplyReason = {
  [EnSupplyReason.FromSupplier]: 'Внешняя поставка',
  [EnSupplyReason.InternalProduction]: 'Собственное производство',
  [EnSupplyReason.InventoryAdjustment]: 'Инвентаризация'
}
export function uiSupplyReason(reason?: EnSupplyReason | null) {
  if (reason == null) return '-'
  return UiSupplyReason[reason]
}

export const UiMaterialShape = {
  [EnMaterialShape.RoundBar]: 'Круг',
  [EnMaterialShape.List]: 'Лист',
  [EnMaterialShape.Pipe]: 'Труба',
  [EnMaterialShape.SquareBar]: 'Квадрат',
  [EnMaterialShape.HexagonBar]: 'Шестигранник'
}

export function uiMaterialShape(shape: EnMaterialShape) {
  return UiMaterialShape[shape]
}

export const UiUnit = {
  [EnUnit.Kg]: 'кг',
  [EnUnit.M]: 'м',
  [EnUnit.MilliMeter]: 'мм',
  [EnUnit.Gram]: 'гр',
  [EnUnit.Countable]: 'шт'
}

export function uiUnit(unit?: EnUnit) {
  if (unit == null) return '-'
  return UiUnit[unit]
}

export const UiWriteoffType = {
  [EnWriteoffType.ThroughDetail]: 'Через деталь',
  [EnWriteoffType.ThroughMaterial]: 'Прямо в единицу'
}

export function uiWriteoffType(type: EnWriteoffType) {
  return UiWriteoffType[type]
}

export const UiManufacturingOrderStatus = {
  [EnManufacturingOrderStatus.Waiting]: 'Ожидание',
  [EnManufacturingOrderStatus.MaterialPreparation]: 'Подготовка',
  [EnManufacturingOrderStatus.Production]: 'Производство',
  [EnManufacturingOrderStatus.Collected]: 'Завершенные'
}

export function uiManufacturingOrderStatus(status: EnManufacturingOrderStatus) {
  return UiManufacturingOrderStatus[status]
}
