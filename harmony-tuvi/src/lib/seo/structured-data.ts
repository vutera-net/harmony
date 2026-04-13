/**
 * JSON-LD Structured Data Generator
 * Generates structured data for search engines (Google, Bing)
 */

import { ContentType } from '@/lib/url-taxonomy'

export interface FAQItem {
  question: string
  answer: string
}

export interface ArticleMetadata {
  title: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}

export interface BreadcrumbItem {
  name: string
  item: string
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Article schema for horoscope and blog pages
 */
export function generateArticleSchema(
  metadata: ArticleMetadata, 
  appUrl: string, 
  pathname: string,
  type: ContentType = ContentType.BLOG
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    image: metadata.image || `${appUrl}/og-image.png`,
    datePublished: metadata.datePublished,
    dateModified: metadata.dateModified || metadata.datePublished,
    author: {
      '@type': 'Organization',
      name: 'VUTERA Harmony',
      url: appUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VUTERA Harmony',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/logo.png`,
      },
    },
    url: `${appUrl}${pathname}`,
    inLanguage: 'vi-VN',
  }
}

/**
 * Specific schema for Daily Horoscope
 */
export function generateHoroscopeSchema(
  title: string,
  description: string,
  date: string,
  zodiac: string,
  appUrl: string,
  pathname: string
) {
  const baseSchema = generateArticleSchema(
    {
      title,
      description,
      datePublished: date,
    },
    appUrl,
    pathname,
    ContentType.DAILY
  )

  return {
    ...baseSchema,
    keywords: `tử vi hôm nay, tử vi tuổi ${zodiac}, horoscope ${zodiac}`,
    about: {
      '@type': 'Thing',
      name: `Tử Vi Tuổi ${zodiac}`,
    },
  }
}

/**
 * Generate WebApplication schema
 */
export function generateWebAppSchema(appName: string, appUrl: string, appDescription: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appName,
    url: appUrl,
    description: appDescription,
    applicationCategory: 'LifestyleApplication',
    inLanguage: 'vi-VN',
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

/**
 * Helper to render schema as script tag
 */
export function schemaToScript(schema: Record<string, any>): string {
  return JSON.stringify(schema)
}
