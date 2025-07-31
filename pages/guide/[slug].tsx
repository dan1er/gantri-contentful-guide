import { useState, useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { richTextOptions } from '../../lib/rich-text-options'
import { getSiteConfiguration, getAllPages, getPageBySlug } from '../../lib/contentful-dynamic'
import { ComponentRenderer, ProductCategoryGrid } from '../../components/DynamicComponents'
import Modal from '../../components/Modal'
import ConstraintModal from '../../components/ConstraintModal'
import SectionRenderer from '../../components/SectionRenderer'
import Navigation from '../../components/Navigation'
import NavigationButtons from '../../components/NavigationButtons'

interface Props {
  siteConfig: any
  page: any
  allPages: any[]
}

export default function DynamicGuidePage({ siteConfig, page, allPages }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedConstraint, setSelectedConstraint] = useState<any>(null)
  
  if (!page) {
    return <div>Loading...</div>
  }

  const navigation = siteConfig?.fields?.navigation || []
  const currentIndex = navigation.findIndex((item: any) => 
    item.fields.page.fields.slug === page.fields.slug
  )

  const handleNavigation = (slug: string) => {
    router.push(`/guide/${slug}`)
  }

  // Separate product categories from other components
  const productCategories = page.fields.components?.filter(
    (comp: any) => comp.sys.contentType?.sys.id === 'productCategory'
  ) || []
  
  const otherComponents = page.fields.components?.filter(
    (comp: any) => comp.sys.contentType?.sys.id !== 'productCategory'
  ) || []

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <img 
            src={siteConfig.fields.logoSvg}
            alt={siteConfig.fields.siteName}
            style={{ height: '20px' }}
          />
        </div>
      </header>

      <div className="container">
        <div className="guide-container">
          <aside className="sidebar">
            <div className="sidebar-title">{siteConfig.fields.headerTitle}</div>
            <h2>{siteConfig.fields.guideTitle}</h2>
            
            <Navigation 
              items={navigation}
              currentSlug={page.fields.slug}
              onNavigate={handleNavigation}
            />
          </aside>

          <main className="content">
            <div>
              {page.fields.sectionNumber && (
                <div className="section-number">{page.fields.sectionNumber}.</div>
              )}
              <h1 className="section-title">{page.fields.title}</h1>
              
              {page.fields.content && (
                <div className="page-content">
                  {documentToReactComponents(page.fields.content, richTextOptions)}
                </div>
              )}

              {/* Render page sections if available */}
              {page.fields.sections && page.fields.sections.length > 0 && (
                <div>
                  {page.fields.sections.map((section: any, index: number) => (
                    <SectionRenderer
                      key={section.sys.id}
                      section={section}
                      onConstraintClick={setSelectedConstraint}
                      onModalClick={() => setShowModal(true)}
                    />
                  ))}
                </div>
              )}

              {/* Render product categories grid */}
              {productCategories.length > 0 && (
                <ProductCategoryGrid categories={productCategories} />
              )}

              {/* Render other components */}
              {otherComponents.map((component: any, index: number) => (
                <ComponentRenderer 
                  key={index} 
                  component={component} 
                  onModalClick={() => setShowModal(true)}
                />
              ))}


              <NavigationButtons
                prevPage={
                  currentIndex > 0 ? {
                    slug: navigation[currentIndex - 1].fields.page.fields.slug,
                    label: page.fields.navigationButtons?.prev?.label || `Back to ${navigation[currentIndex - 1].fields.label}`,
                    icon: page.fields.navigationButtons?.prev?.icon
                  } : undefined
                }
                nextPage={
                  currentIndex < navigation.length - 1 ? {
                    slug: navigation[currentIndex + 1].fields.page.fields.slug,
                    label: page.fields.navigationButtons?.next?.label || navigation[currentIndex + 1].fields.label,
                    icon: page.fields.navigationButtons?.next?.icon
                  } : undefined
                }
              />
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} />
      )}

      {selectedConstraint && (
        <ConstraintModal
          constraint={selectedConstraint}
          onClose={() => setSelectedConstraint(null)}
        />
      )}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pages = await getAllPages()
    
    const paths = pages.map((page) => ({
      params: { slug: String(page.fields.slug) }
    }))

    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('Error fetching pages:', error)
    // Return empty paths if Contentful is not configured
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const siteConfig = await getSiteConfiguration()
    const page = await getPageBySlug(params?.slug as string)
    const allPages = await getAllPages()

    if (!page) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        siteConfig,
        page,
        allPages
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}