import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface NavigationItem {
  sys: { id: string }
  fields: {
    label: string
    order: number
    page?: any
    subItems?: any[]
    isExpandedByDefault?: boolean
  }
}

interface NavigationProps {
  items: NavigationItem[]
  currentSlug?: string
  onNavigate: (slug: string) => void
}

export default function Navigation({ items, currentSlug, onNavigate }: NavigationProps) {
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Initialize expanded items based on current page
  useEffect(() => {
    const expanded: string[] = []
    items.forEach(item => {
      // Check if this item has sub-items and if current page is one of them
      if (item.fields.subItems && item.fields.subItems.length > 0) {
        const hasActiveSubItem = item.fields.subItems.some((subItem: any) => {
          const subSlug = subItem.fields.label?.toLowerCase().replace(/\s+/g, '-')
          return router.asPath.includes(subSlug)
        })
        
        if (hasActiveSubItem || item.fields.page?.fields.slug === currentSlug) {
          expanded.push(item.sys.id)
        }
      }
    })
    setExpandedItems(expanded)
  }, [items, currentSlug, router.asPath])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNavClick = (item: NavigationItem) => {
    if (item.fields.page) {
      onNavigate(item.fields.page.fields.slug)
    } else if (item.fields.subItems && item.fields.subItems.length > 0) {
      toggleExpanded(item.sys.id)
    }
  }

  const handleSubItemClick = (parentSlug: string, subLabel: string) => {
    // Navigate to parent page with hash for section
    const sectionId = subLabel.toLowerCase().replace(/\s+/g, '-')
    router.push(`/guide/${parentSlug}#${sectionId}`)
  }

  return (
    <ul className="nav-list">
      {items.map((item, index) => {
        const isActive = item.fields.page?.fields.slug === currentSlug
        const isExpanded = expandedItems.includes(item.sys.id)
        const hasSubItems = item.fields.subItems && item.fields.subItems.length > 0

        return (
          <li key={item.sys.id}>
            <div
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              style={{ cursor: hasSubItems || item.fields.page ? 'pointer' : 'default' }}
            >
              {item.fields.order}. {item.fields.label}
            </div>
            
            {hasSubItems && isExpanded && (
              <ul className="nav-subitems">
                {item.fields.subItems.map((subItem: any) => (
                  <li 
                    key={subItem.sys.id} 
                    className="nav-subitem"
                    onClick={() => handleSubItemClick(
                      item.fields.page?.fields.slug || currentSlug || '',
                      subItem.fields.label
                    )}
                  >
                    {subItem.fields.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}