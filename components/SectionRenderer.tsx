import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { richTextOptions } from '../lib/rich-text-options'
import ConstraintCard from './ConstraintCard'
import { ComponentRenderer } from './DynamicComponents'
import GridRenderer from './GridRenderer'
import styles from './SectionRenderer.module.css'

interface SectionRendererProps {
  section: any
  onConstraintClick: (constraint: any) => void
  onModalClick: () => void
}

export default function SectionRenderer({ section, onConstraintClick, onModalClick }: SectionRendererProps) {
  const { title, subtitle, content, components, constraints, layout } = section.fields

  // Handle milestone-style components
  const renderMilestones = (milestones: any[]) => (
    <div className="milestones">
      {milestones.map((milestone: any, index: number) => (
        <div key={index} className="milestone" data-step={milestone.fields.icon || (index + 1)}>
          <div className="milestone-title">{milestone.fields.title}</div>
          {milestone.fields.description && <div>{milestone.fields.description}</div>}
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.section}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      
      {content && (
        <div className={styles.sectionContent}>
          {documentToReactComponents(content, richTextOptions)}
        </div>
      )}

      {/* Render constraints in grid layout */}
      {layout === 'constraints-grid' && constraints && constraints.length > 0 && (
        <div className={styles.constraintsGrid}>
          {constraints.map((constraint: any) => (
            <ConstraintCard
              key={constraint.sys.id}
              constraint={constraint}
              onClick={() => onConstraintClick(constraint)}
            />
          ))}
        </div>
      )}

      {/* Render components based on layout */}
      {layout === 'milestones' && components && components.length > 0 ? (
        renderMilestones(components)
      ) : (
        components && components.length > 0 && (
          <div className={styles.components}>
            {components.map((component: any, index: number) => {
              // Handle Grid components
              if (component.sys.contentType?.sys.id === 'grid') {
                return (
                  <GridRenderer
                    key={component.sys.id}
                    grid={component}
                    onConstraintClick={onConstraintClick}
                  />
                )
              }
              // Handle other components
              return (
                <ComponentRenderer
                  key={index}
                  component={component}
                  onModalClick={onModalClick}
                />
              )
            })}
          </div>
        )
      )}
    </div>
  )
}