import { THIEN_CAN, DIA_CHI } from '@/data/can-chi'

export type CanSlug =
  | 'giap-ty' | 'at-suu' | 'binh-dan' | 'dinh-mao' | 'mau-thin' | 'ky-ti'
  | 'canh-ngo' | 'tan-mui' | 'nham-than' | 'quy-dau' | 'giap-tuat' | 'at-hoi'
  | 'binh-ty' | 'dinh-suu' | 'mau-dan' | 'ky-mao' | 'canh-thin' | 'tan-ti'
  | 'nham-ngo' | 'quy-mui' | 'giap-than' | 'at-dau' | 'binh-tuat' | 'dinh-hoi'
  | 'mau-ty' | 'ky-suu' | 'canh-dan' | 'tan-mao' | 'nham-thin' | 'quy-ti'
  | 'giap-ngo' | 'at-mui' | 'binh-than' | 'dinh-dau' | 'mau-tuat' | 'ky-hoi'
  | 'canh-ty' | 'tan-suu' | 'nham-dan' | 'quy-mao' | 'giap-thin' | 'at-ti'
  | 'binh-ngo' | 'dinh-mui' | 'mau-than' | 'ky-dau' | 'canh-tuat' | 'tan-hoi'
  | 'nham-ty' | 'quy-suu' | 'giap-dan' | 'at-mao' | 'binh-thin' | 'dinh-ti'
  | 'mau-ngo' | 'ky-mui' | 'canh-than' | 'tan-dau' | 'nham-tuat' | 'quy-hoi'

export const VALID_CAN_CHI_SLUGS: CanSlug[] = [
  'giap-ty', 'at-suu', 'binh-dan', 'dinh-mao', 'mau-thin', 'ky-ti',
  'canh-ngo', 'tan-mui', 'nham-than', 'quy-dau', 'giap-tuat', 'at-hoi',
  'binh-ty', 'dinh-suu', 'mau-dan', 'ky-mao', 'canh-thin', 'tan-ti',
  'nham-ngo', 'quy-mui', 'giap-than', 'at-dau', 'binh-tuat', 'dinh-hoi',
  'mau-ty', 'ky-suu', 'canh-dan', 'tan-mao', 'nham-thin', 'quy-ti',
  'giap-ngo', 'at-mui', 'binh-than', 'dinh-dau', 'mau-tuat', 'ky-hoi',
  'canh-ty', 'tan-suu', 'nham-dan', 'quy-mao', 'giap-thin', 'at-ti',
  'binh-ngo', 'dinh-mui', 'mau-than', 'ky-dau', 'canh-tuat', 'tan-hoi',
  'nham-ty', 'quy-suu', 'giap-dan', 'at-mao', 'binh-thin', 'dinh-ti',
  'mau-ngo', 'ky-mui', 'canh-than', 'tan-dau', 'nham-tuat', 'quy-hoi',
]

const CAN_KEYS = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy']
const CHI_KEYS = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']

export function deslugifyCanChi(slug: string) {
  const parts = slug.split('-')
  if (parts.length !== 2) return null
  
  const canIdx = CAN_KEYS.indexOf(parts[0])
  const chiIdx = CHI_KEYS.indexOf(parts[1])
  
  if (canIdx === -1 || chiIdx === -1) return null
  
  return {
    can: { index: canIdx, name: THIEN_CAN[canIdx] },
    chi: { index: chiIdx, name: DIA_CHI[chiIdx] },
    full: `${THIEN_CAN[canIdx]} ${DIA_CHI[chiIdx]}`,
  }
}

export function deslugify(slug: string) {
    const info = deslugifyCanChi(slug);
    if (!info) return null;
    return { can: info.can.name, chi: info.chi.name };
}

export function isValidCanChiSlug(slug: string): slug is CanSlug {
  return VALID_CAN_CHI_SLUGS.includes(slug as CanSlug)
}