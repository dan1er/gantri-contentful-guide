import { useState } from 'react'
import styles from './ConstraintCard.module.css'

interface ConstraintCardProps {
  constraint: any
  onClick: () => void
}

export default function ConstraintCard({ constraint, onClick }: ConstraintCardProps) {
  const [shortDescription, ...detailedParts] = constraint.fields.description.split('\n\n')

  return (
    <div className={styles.constraintCard} onClick={onClick}>
      <h3 className={styles.title}>{constraint.fields.title}</h3>
      <div className={styles.illustration}>
        {/* Placeholder for constraint illustration */}
        <div className={styles.placeholderImage}>
          <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#f3f4f6"/>
            <path d="M80 50h40v50H80z" stroke="#9ca3af" strokeWidth="2" fill="none"/>
            <circle cx="100" cy="75" r="15" stroke="#9ca3af" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
      <p className={styles.description}>{shortDescription}</p>
    </div>
  )
}