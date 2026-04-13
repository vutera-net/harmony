import { DailyHoroscopeContent, ZodiacSign } from '@/types'
import { DAILY_TEMPLATES, DailyHoroscopeTemplate } from '@/data/templates/daily-horoscope'
import { DIA_CHI_INFO } from '@/data/dia-chi'

/**
 * Content Engine: Hydrates and selects templates for programmatic SEO pages
 */
export class ContentEngine {
  /**
   * Generates daily horoscope content based on seed (date + slug)
   */
  static generateDailyContent(
    dateStr: string,
    slug: string,
    zodiac: ZodiacSign
  ): DailyHoroscopeContent {
    // 1. Generate deterministic scores based on date and slug
    const scores = this.generateScores(dateStr, slug)
    
    // 2. Select template based on average score
    const avgScore = scores.tongQuan
    const template = this.selectTemplate(avgScore)
    
    // 3. Hydrate content
    const info = DIA_CHI_INFO[this.getZodiacIndex(zodiac)]
    const zodiacName = info?.name || zodiac
    
    return {
      zodiac,
      date: dateStr,
      scores,
      tongQuan: this.hydrate(this.pickVariation(template.tongQuan, dateStr), { zodiac: zodiacName }),
      tinhCam: this.hydrate(this.pickVariation(template.tinhCam, dateStr), { zodiac: zodiacName }),
      suNghiep: this.hydrate(this.pickVariation(template.suNghiep, dateStr), { zodiac: zodiacName }),
      taiChinh: this.hydrate(this.pickVariation(template.taiChinh, dateStr), { zodiac: zodiacName }),
      sucKhoe: this.hydrate(this.pickVariation(template.sucKhoe, dateStr), { zodiac: zodiacName }),
      luckyColor: this.pickVariation(['Xanh lá', 'Đỏ', 'Vàng', 'Trắng', 'Đen'], dateStr + slug),
      luckyDirection: this.pickVariation(['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam'], dateStr + slug),
      luckyHour: this.pickVariation(['Giờ Tý', 'Giờ Dần', 'Giờ Ngọ', 'Giờ Thân'], dateStr + slug),
      luckyNumber: (this.hashCode(dateStr + slug) % 9) + 1,
    }
  }

  private static generateScores(date: string, slug: string) {
    const hash = this.hashCode(date + slug)
    return {
      tongQuan: (hash % 10) + 1,
      tinhCam: ((hash >> 1) % 10) + 1,
      suNghiep: ((hash >> 2) % 10) + 1,
      taiChinh: ((hash >> 3) % 10) + 1,
      sucKhoe: ((hash >> 4) % 10) + 1,
    }
  }

  private static selectTemplate(score: number): DailyHoroscopeTemplate {
    return DAILY_TEMPLATES.find(t => score >= t.scoreRange[0] && score <= t.scoreRange[1]) || DAILY_TEMPLATES[2]
  }

  private static hydrate(text: string, params: Record<string, string>): string {
    let result = text
    Object.entries(params).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), val)
    })
    return result
  }

  private static pickVariation(variations: string[], seed: string): string {
    const index = Math.abs(this.hashCode(seed)) % variations.length
    return variations[index]
  }

  private static hashCode(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
    return h
  }

  private static getZodiacIndex(zodiac: ZodiacSign): number {
    const mapping: Record<ZodiacSign, number> = {
      ty: 0, suu: 1, dan: 2, mao: 3, thin: 4, ti: 5,
      ngo: 6, mui: 7, than: 8, dau: 9, tuat: 10, hoi: 11
    }
    return mapping[zodiac]
  }
}
