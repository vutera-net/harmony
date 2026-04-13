export type CanSlug =
  | 'giap-ty'
  | 'at-su'
  | 'binh-dan'
  | 'dinh-mao'
  | 'mau-thin'
  | 'ky-ti'
  | 'canh-ngo'
  | 'tan-mui'
  | 'nham-than'
  | 'quy-dau'
  | 'giap-tuat'
  | 'at-hoi'
  | 'binh-ty'
  | 'dinh-su'
  | 'mau-dan'
  | 'ky-mao'
  | 'canh-thin'
  | 'tan-ti'
  | 'nham-ngo'
  | 'quy-mui'
  | 'giap-than'
  | 'at-dau'
  | 'binh-tuat'
  | 'dinh-hoi'
  | 'mau-ty'
  | 'ky-su'
  | 'canh-dan'
  | 'tan-mao'
  | 'nham-thin'
  | 'quy-ti'
  | 'giap-ngo'
  | 'at-mui'
  | 'binh-than'
  | 'dinh-dau'
  | 'mau-tuat'
  | 'ky-hoi'
  | 'canh-ty'
  | 'tan-su'
  | 'nham-dan'
  | 'quy-mao'
  | 'giap-thin'
  | 'at-ti'
  | 'binh-ngo'
  | 'dinh-mui'
  | 'mau-than'
  | 'ky-dau'
  | 'canh-tuat'
  | 'tan-hoi'
  | 'nham-ty'
  | 'quy-su'
  | 'giap-dan'
  | 'at-mao'
  | 'binh-thin'
  | 'dinh-ti'
  | 'mau-ngo'
  | 'ky-mui'
  | 'canh-than'
  | 'tan-dau'
  | 'nham-tuat'
  | 'quy-hoi'

const CAN_MAP: Record<string, string> = {
  giap: 'Giáp',
  at: 'Ất',
  binh: 'Bính',
  dinh: 'Đinh',
  mau: 'Mậu',
  ky: 'Kỷ',
  canh: 'Canh',
  tan: 'Tân',
  nham: 'Nhâm',
  quy: 'Quý',
}

const CHI_MAP: Record<string, string> = {
  ty: 'Tý',
  su: 'Sửu',
  dan: 'Dần',
  mao: 'Mão',
  thin: 'Thìn',
  ti: 'Tỵ',
  ngo: 'Ngọ',
  mui: 'Mùi',
  than: 'Thân',
  dau: 'Dậu',
  tuat: 'Tuất',
  hoi: 'Hợi',
}

export const VALID_CAN_CHI_SLUGS: CanSlug[] = [
  'giap-ty', 'at-su', 'binh-dan', 'dinh-mao', 'mau-thin', 'ky-ti',
  'canh-ngo', 'tan-mui', 'nham-than', 'quy-dau', 'giap-tuat', 'at-hoi',
  'binh-ty', 'dinh-su', 'mau-dan', 'ky-mao', 'canh-thin', 'tan-ti',
  'nham-ngo', 'quy-mui', 'giap-than', 'at-dau', 'binh-tuat', 'dinh-hoi',
  'mau-ty', 'ky-su', 'canh-dan', 'tan-mao', 'nham-thin', 'quy-ti',
  'giap-ngo', 'at-mui', 'binh-than', 'dinh-dau', 'mau-tuat', 'ky-hoi',
  'canh-ty', 'tan-su', 'nham-dan', 'quy-mao', 'giap-thin', 'at-ti',
  'binh-ngo', 'dinh-mui', 'mau-than', 'ky-dau', 'canh-tuat', 'tan-hoi',
  'nham-ty', 'quy-su', 'giap-dan', 'at-mao', 'binh-thin', 'dinh-ti',
  'mau-ngo', 'ky-mui', 'canh-than', 'tan-dau', 'nham-tuat', 'quy-hoi',
]

export function slugify(can: string, chi: string): string {
  const canLower = can.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const chiLower = chi.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${canLower}-${chiLower}`
}

export function deslugify(slug: string): { can: string; chi: string } | null {
  if (!isValidCanChiSlug(slug)) {
    return null
  }

  const [canKey, chiKey] = slug.split('-') as [string, string]
  const can = CAN_MAP[canKey]
  const chi = CHI_MAP[chiKey]

  if (!can || !chi) {
    return null
  }

  return { can, chi }
}

export function isValidCanChiSlug(slug: string): slug is CanSlug {
  return VALID_CAN_CHI_SLUGS.includes(slug as CanSlug)
}

export function getSlugFromYear(year: number): string {
  const canIndex = ((year - 4) % 10 + 10) % 10
  const chiIndex = ((year - 4) % 12 + 12) % 12

  const canKeys = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy']
  const chiKeys = ['ty', 'su', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']

  return `${canKeys[canIndex]}-${chiKeys[chiIndex]}`
}

export function getYearFromSlug(slug: string): number | null {
  const parsed = deslugify(slug)
  if (!parsed) return null

  const canIndex = Object.entries(CAN_MAP).find(([, v]) => v === parsed.can)?.[0]
  const chiIndex = Object.entries(CHI_MAP).find(([, v]) => v === parsed.chi)?.[0]

  if (canIndex === undefined || chiIndex === undefined) return null

  const canKeys = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy']
  const chiKeys = ['ty', 'su', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']

  const baseYear = 1984
  const canOffset = canKeys.indexOf(canIndex)
  const chiOffset = chiKeys.indexOf(chiIndex)

  let year = baseYear + (canOffset - canKeys.indexOf('giap')) + (chiOffset - chiKeys.indexOf('ty')) * 1

  year = ((year - 1924) % 60) + 1924
  return year
}