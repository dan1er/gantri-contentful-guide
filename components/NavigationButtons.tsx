import { useRouter } from 'next/router'

interface NavigationButtonsProps {
  prevPage?: {
    slug: string
    label: string
    icon?: string
  }
  nextPage?: {
    slug: string
    label: string
    icon?: string
  }
}

export default function NavigationButtons({ prevPage, nextPage }: NavigationButtonsProps) {
  const router = useRouter()

  const handleNavigation = (slug: string) => {
    router.push(`/guide/${slug}`)
  }

  if (!prevPage && !nextPage) return null

  return (
    <div className="navigation-buttons">
      {prevPage && (
        <button 
          className="nav-button secondary" 
          onClick={() => handleNavigation(prevPage.slug)}
        >
          {prevPage.icon || '←'} {prevPage.label}
        </button>
      )}
      {nextPage && (
        <button 
          className="nav-button primary" 
          onClick={() => handleNavigation(nextPage.slug)}
        >
          {nextPage.label} {nextPage.icon || '→'}
        </button>
      )}
    </div>
  )
}