import {
  EnMaterialShape,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType
} from './enums'

export const UiWriteoffReason = {
  [EnWriteoffReason.Production]: 'Производство',
  [EnWriteoffReason.Defective]: 'Брак продукта',
  [EnWriteoffReason.Sale]: 'Продажа',
  [EnWriteoffReason.Other]: 'Другое'
}

export function uiWriteoffReason(reason?: EnWriteoffReason) {
  if (reason == null) return '-'
  return UiWriteoffReason[reason]
}

export const UiMaterialShape = {
  [EnMaterialShape.RoundBar]: 'Круг',
  [EnMaterialShape.List]: 'Лист',
  [EnMaterialShape.Pipe]: 'Труба',
  [EnMaterialShape.SquareBar]: 'Квадрат'
}

export function uiMaterialShape(shape: EnMaterialShape) {
  return UiMaterialShape[shape]
}

export const UiUnit = {
  [EnUnit.Kg]: 'кг',
  [EnUnit.M]: 'м',
  [EnUnit.MilliMeter]: 'мм',
  [EnUnit.Gram]: 'гр'
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
