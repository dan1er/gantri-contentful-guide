import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import ProductCategories from './ProductCategories'
import Modal from './Modal'
import ContentfulImage from './ContentfulImage'
import { richTextOptions } from '../lib/rich-text-options'

interface PanelComponentProps {
  panel: any
  onModalClick?: () => void
}

export function PanelComponent({ panel, onModalClick }: PanelComponentProps) {
  const { title, content, items, hasModal, backgroundImage } = panel.fields

  // Determine panel type based on title for special styling
  const getPanelClass = () => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('principle')) return 'panel-component panel-principles'
    if (titleLower.includes('technical')) return 'panel-component panel-technical'
    if (titleLower.includes('sustainability')) return 'panel-component panel-sustainability'
    return 'panel-component'
  }

  return (
    <div className={getPanelClass()}>
      {backgroundImage && (
        <div className="panel-background-image">
          <ContentfulImage 
            asset={backgroundImage} 
            fill 
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <h3>{title}</h3>
      {content && (
        <div className="panel-content">
          {documentToReactComponents(content, richTextOptions)}
        </div>
      )}
      {items && items.length > 0 && (
        <ul className="panel-items">
          {items.map((item: string, index: number) => (
            <li key={index} className="panel-item">
              {hasModal && index === 0 ? (
                <button 
                  onClick={onModalClick}
                  className="panel-item-button"
                >
                  {item}
                </button>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface MilestoneProps {
  milestone: any
}

export function MilestoneComponent({ milestone }: MilestoneProps) {
  const { stepNumber, title, description } = milestone.fields

  return (
    <div className="milestone" data-step={stepNumber}>
      <div className="milestone-title">{title}</div>
      {description && <div>{description}</div>}
    </div>
  )
}

interface ComponentRendererProps {
  component: any
  onModalClick?: () => void
}

export function ComponentRenderer({ component, onModalClick }: ComponentRendererProps) {
  const contentType = component.sys.contentType?.sys.id

  switch (contentType) {
    case 'panelComponent':
      return <PanelComponent panel={component} onModalClick={onModalClick} />
    
    case 'milestone':
      return <MilestoneComponent milestone={component} />
    
    case 'productCategory':
      // For multiple product categories, we'll handle this differently
      return null
    
    default:
      return null
  }
}

interface ProductCategoryGridProps {
  categories: any[]
}

export function ProductCategoryGrid({ categories }: ProductCategoryGridProps) {
  return (
    <div className="categories-grid">
      {categories.map((category, index) => (
        <div key={index} className="category-card">
          <div className="category-image-wrapper">
            {category.fields.image ? (
              <ContentfulImage 
                asset={category.fields.image} 
                width={200} 
                height={200}
                className="category-image"
              />
            ) : (
              <div className="category-image-placeholder">
                <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="150" height="150" fill="#F3F4F6"/>
                  <circle cx="75" cy="75" r="40" fill="#E5E7EB"/>
                </svg>
              </div>
            )}
          </div>
          <div className="category-name">{category.fields.name}</div>
          <div className="category-type">{category.fields.type}</div>
        </div>
      ))}
    </div>
  )
}