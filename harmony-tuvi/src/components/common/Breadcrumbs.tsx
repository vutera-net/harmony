import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto pb-2 scrollbar-hide">
      <Link 
        href="/" 
        className="flex items-center hover:text-purple-600 transition-colors shrink-0"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2 shrink-0">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={item.href}
            className={`hover:text-purple-600 transition-colors ${
              index === items.length - 1 ? 'font-medium text-gray-900' : ''
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}
