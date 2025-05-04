import {
  EnMaterialShape,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType,
  OrderStatus
} from './enumerations'

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
  [EnMaterialShape.Circle]: 'Круг',
  [EnMaterialShape.List]: 'Лист',
  [EnMaterialShape.Pipe]: 'Труба',
  [EnMaterialShape.Square]: 'Квадрат'
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
  [EnWriteoffType.DirectUnit]: 'Прямо в единицу'
}

export function uiWriteoffType(type: EnWriteoffType) {
  return UiWriteoffType[type]
}

export const UiOrderStatus = {
  [OrderStatus.ordRegistration]: 'Предзаказ',
  [OrderStatus.ordProduction]: 'В производстве',
  [OrderStatus.ordArchived]: 'В архиве',
  [OrderStatus.reclInbox]: 'Входящие',
  [OrderStatus.reclDecision]: 'Принятие решения',
  [OrderStatus.reclProduction]: 'В производстве',
  [OrderStatus.reclArchived]: 'В архиве'
}

export function uiOrderStatus(status: OrderStatus) {
  return UiOrderStatus[status]
}
