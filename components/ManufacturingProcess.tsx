import React from 'react'

interface ManufacturingProcessProps {
  onShowConstraint: () => void
}

export default function ManufacturingProcess({ onShowConstraint }: ManufacturingProcessProps) {
  const processes = [
    { name: 'Printing Parts', hasConstraint: true },
    { name: 'Painting Parts', hasConstraint: false },
    { name: 'Assembling the Product', hasConstraint: false },
    { name: 'Quality Control', hasConstraint: false },
    { name: 'Packing and Shipping', hasConstraint: false }
  ]

  return (
    <div>
      <h3>CONSTRAINTS</h3>
      <div style={{ marginTop: '30px', backgroundColor: '#f9fafb', padding: '40px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '150px', 
                  height: '150px', 
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>250mm</span>
                  <span style={{ 
                    position: 'absolute', 
                    left: '-30px', 
                    fontSize: '14px',
                    color: '#6b7280',
                    transform: 'rotate(-90deg)' 
                  }}>250mm</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '150px', 
                  height: '150px', 
                  backgroundColor: '#e5e7eb',
                  borderRadius: '8px'
                }}></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '150px', 
                  height: '150px', 
                  backgroundColor: '#e5e7eb',
                  borderRadius: '8px',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}></div>
              </div>
            </div>
          </div>
          
          <div style={{ width: '300px' }}>
            <h4 style={{ marginBottom: '20px' }}>OVERHANGS</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              Overhangs should not overhang up to 35 degrees
            </p>
            
            <h4 style={{ marginBottom: '20px' }}>WALL THICKNESS</h4>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              All walls must be a minimum of 5.0mm
            </p>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>🔲 Painting Parts</h3>
      <p>
        Any unpainted parts are directly sent to the assembly team and stored. Painted parts are sent to the finishing team.
        Our finishing team sands all incoming parts, primes the parts, and then paints the parts with their final color.
      </p>

      <ul style={{ marginTop: '30px', listStyle: 'none' }}>
        {processes.map((process, index) => (
          <li key={index} style={{ marginBottom: '15px' }}>
            {process.hasConstraint ? (
              <button 
                onClick={onShowConstraint}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3b82f6',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '16px',
                  padding: 0
                }}
              >
                {process.name}
              </button>
            ) : (
              <span>{process.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}