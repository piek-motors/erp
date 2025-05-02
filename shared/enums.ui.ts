import {
  EnMaterialShape,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType
} from './enumerations'

export const UiWriteoffReason = {
  [EnWriteoffReason.Production]: 'Производство',
  [EnWriteoffReason.Defective]: 'Брак продукта',
  [EnWriteoffReason.Sale]: 'Продажа',
  [EnWriteoffReason.Other]: 'Другое'
}

export function formatWriteoffReason(reason?: EnWriteoffReason) {
  if (reason == null) return '-'
  return UiWriteoffReason[reason]
}

export const UiMaterialShape = {
  [EnMaterialShape.Circle]: 'Круг',
  [EnMaterialShape.List]: 'Лист',
  [EnMaterialShape.Pipe]: 'Труба',
  [EnMaterialShape.Square]: 'Квадрат'
}

export function formatMaterialShape(shape: EnMaterialShape) {
  return UiMaterialShape[shape]
}

export const UiUnit = {
  [EnUnit.Kg]: 'кг',
  [EnUnit.M]: 'м',
  [EnUnit.MilliMeter]: 'мм',
  [EnUnit.Gram]: 'гр'
}

export function formatUnit(unit?: EnUnit) {
  if (unit == null) return '-'
  return UiUnit[unit]
}

export const UiWriteoffType = {
  [EnWriteoffType.ThroughDetail]: 'Через деталь',
  [EnWriteoffType.DirectUnit]: 'Прямо в единицу'
}

export function formatWriteoffType(type: EnWriteoffType) {
  return UiWriteoffType[type]
}
