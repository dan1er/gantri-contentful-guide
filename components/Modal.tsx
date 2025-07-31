import React from 'react'

interface ModalProps {
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 style={{ marginBottom: '20px' }}>PRINT SIZE</h2>
        
        <p style={{ marginBottom: '20px' }}>
          The maximum size of any printed part must fit between a 250×250×250mm cube
        </p>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          (9.8 × 9.8 × 9.8 inches)
        </p>

        <div className="constraint-visual">
          <div style={{ 
            width: '200px', 
            height: '200px', 
            border: '2px dashed #d1d5db',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#6b7280' }}>250mm</span>
            <span style={{ 
              position: 'absolute', 
              left: '-60px', 
              transform: 'rotate(-90deg)' 
            }}>250mm</span>
          </div>
        </div>

        <div className="constraint-examples">
          <div className="example">
            <div style={{ 
              width: '150px', 
              height: '150px', 
              border: '2px dashed #d1d5db',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#e5e7eb',
                borderRadius: '50%' 
              }}></div>
            </div>
            <div className="check-icon">✓</div>
          </div>
          
          <div className="example">
            <div style={{ 
              width: '150px', 
              height: '150px', 
              border: '2px dashed #d1d5db',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '40%',
                  backgroundColor: '#ef4444',
                  opacity: 0.5
                }}></div>
              </div>
            </div>
            <div className="x-icon">✗</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal