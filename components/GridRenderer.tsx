import ConstraintCard from './ConstraintCard'
import { ProductCategoryGrid } from './DynamicComponents'
import styles from './GridRenderer.module.css'

interface GridRendererProps {
  grid: any
  onConstraintClick?: (constraint: any) => void
}

export default function GridRenderer({ grid, onConstraintClick }: GridRendererProps) {
  const { title, columns, items, variant } = grid.fields

  // Handle different grid variants
  if (variant === 'constraints' && items) {
    return (
      <div className={styles.gridContainer}>
        {title && <h3 className={styles.gridTitle}>{title}</h3>}
        <div className={styles.constraintsGrid}>
          {items.map((item: any) => (
            <ConstraintCard
              key={item.sys.id}
              constraint={item}
              onClick={() => onConstraintClick?.(item)}
            />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'products' && items) {
    return <ProductCategoryGrid categories={items} />
  }

  // Default grid layout
  const gridColumns = columns || 3
  
  return (
    <div className={styles.gridContainer}>
      {title && <h3 className={styles.gridTitle}>{title}</h3>}
      <div 
        className={styles.defaultGrid}
        style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
      >
        {items && items.map((item: any, index: number) => (
          <div key={item.sys.id || index} className={styles.gridItem}>
            {/* Render different types of grid items */}
            {item.fields.title && <h4>{item.fields.title}</h4>}
            {item.fields.content && <p>{item.fields.content}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}