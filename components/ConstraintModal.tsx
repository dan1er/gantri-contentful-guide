import styles from './ConstraintModal.module.css'

interface ConstraintModalProps {
  constraint: any
  onClose: () => void
}

export default function ConstraintModal({ constraint, onClose }: ConstraintModalProps) {
  const [shortDescription, ...detailedParts] = constraint.fields.description.split('\n\n')
  const specifications = constraint.fields.specifications?.details || []

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 className={styles.modalTitle}>{constraint.fields.title}</h2>
        
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>{detailedParts.join(' ')}</p>
          
          <div className={styles.examplesSection}>
            <div className={styles.exampleCard}>
              <div className={styles.exampleImage}>
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="150" fill="#f0fdf4"/>
                  <path d="M60 50h80v50H60z" stroke="#22c55e" strokeWidth="2" fill="none"/>
                  <circle cx="100" cy="75" r="20" stroke="#22c55e" strokeWidth="2" fill="none"/>
                  <path d="M85 120l30-30" stroke="#22c55e" strokeWidth="2"/>
                  <circle cx="120" cy="115" r="8" fill="#22c55e"/>
                  <text x="130" y="120" fill="#22c55e" fontSize="20">✓</text>
                </svg>
              </div>
              <p className={styles.exampleLabel}>Acceptable</p>
            </div>
            
            <div className={styles.exampleCard}>
              <div className={styles.exampleImage}>
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="150" fill="#fef2f2"/>
                  <path d="M50 30h100v90H50z" stroke="#ef4444" strokeWidth="2" fill="none"/>
                  <circle cx="100" cy="75" r="35" stroke="#ef4444" strokeWidth="2" fill="none"/>
                  <path d="M70 100l60 20" stroke="#ef4444" strokeWidth="2"/>
                  <text x="140" y="125" fill="#ef4444" fontSize="24">✗</text>
                </svg>
              </div>
              <p className={styles.exampleLabel}>Not Acceptable</p>
            </div>
          </div>
          
          {specifications.length > 0 && (
            <div className={styles.specificationsSection}>
              <h3 className={styles.specificationsTitle}>Technical Specifications</h3>
              <ul className={styles.specificationsList}>
                {specifications.map((spec: string, index: number) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}