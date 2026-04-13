import { DIA_CHI, CON_GIAP, CHI_NGU_HANH, CHI_AM_DUONG, GIO_DIA_CHI } from './can-chi'

export interface DiaChiInfo {
  index: number
  name: string
  animal: string
  element: string
  polarity: 'duong' | 'am'
  luckyHours: string
  direction: string
}

export const DIA_CHI_INFO: Record<number, DiaChiInfo> = {
  0: {
    index: 0,
    name: 'Tý',
    animal: 'Chuột',
    element: 'Thủy',
    polarity: 'duong',
    luckyHours: '23h - 01h',
    direction: 'Bắc',
  },
  1: {
    index: 1,
    name: 'Sửu',
    animal: 'Trâu',
    element: 'Thổ',
    polarity: 'am',
    luckyHours: '01h - 03h',
    direction: 'Bắc Đông Bắc',
  },
  2: {
    index: 2,
    name: 'Dần',
    animal: 'Hổ',
    element: 'Mộc',
    polarity: 'duong',
    luckyHours: '03h - 05h',
    direction: 'Đông Đông Bắc',
  },
  3: {
    index: 3,
    name: 'Mão',
    animal: 'Mèo',
    element: 'Mộc',
    polarity: 'am',
    luckyHours: '05h - 07h',
    direction: 'Đông',
  },
  4: {
    index: 4,
    name: 'Thìn',
    animal: 'Rồng',
    element: 'Thổ',
    polarity: 'duong',
    luckyHours: '07h - 09h',
    direction: 'Đông Đông Nam',
  },
  5: {
    index: 5,
    name: 'Tỵ',
    animal: 'Rắn',
    element: 'Hỏa',
    polarity: 'am',
    luckyHours: '09h - 11h',
    direction: 'Nam Đông Nam',
  },
  6: {
    index: 6,
    name: 'Ngọ',
    animal: 'Ngựa',
    element: 'Hỏa',
    polarity: 'duong',
    luckyHours: '11h - 13h',
    direction: 'Nam',
  },
  7: {
    index: 7,
    name: 'Mùi',
    animal: 'Dê',
    element: 'Thổ',
    polarity: 'am',
    luckyHours: '13h - 15h',
    direction: 'Nam Tây Nam',
  },
  8: {
    index: 8,
    name: 'Thân',
    animal: 'Khỉ',
    element: 'Kim',
    polarity: 'duong',
    luckyHours: '15h - 17h',
    direction: 'Tây Tây Nam',
  },
  9: {
    index: 9,
    name: 'Dậu',
    animal: 'Gà',
    element: 'Kim',
    polarity: 'am',
    luckyHours: '17h - 19h',
    direction: 'Tây',
  },
  10: {
    index: 10,
    name: 'Tuất',
    animal: 'Chó',
    element: 'Thổ',
    polarity: 'duong',
    luckyHours: '19h - 21h',
    direction: 'Tây Tây Bắc',
  },
  11: {
    index: 11,
    name: 'Hợi',
    animal: 'Heo',
    element: 'Thủy',
    polarity: 'am',
    luckyHours: '21h - 23h',
    direction: 'Bắc Tây Bắc',
  },
}

export function getDiaChiInfo(index: number): DiaChiInfo | undefined {
  return DIA_CHI_INFO[index]
}
