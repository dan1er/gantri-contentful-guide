import React from 'react'

const productData = [
  {
    name: 'Table',
    type: 'Plug-in',
    image: 'table'
  },
  {
    name: 'Wall Sconce',
    type: 'Plug-in and Hardwired',
    image: 'wall-sconce'
  },
  {
    name: 'Floor',
    type: 'Plug-in',
    image: 'floor'
  },
  {
    name: 'Clamp',
    type: 'Plug-in',
    image: 'clamp'
  },
  {
    name: 'Pendant',
    type: 'Hardwired',
    image: 'pendant'
  },
  {
    name: 'Flush Mount',
    type: 'Hardwired',
    image: 'flush-mount'
  }
]

export default function ProductCategories() {
  return (
    <div className="categories-grid">
      {productData.map((product, index) => (
        <div key={index} className="category-card">
          <div className="category-image-placeholder">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="150" height="150" fill="#F3F4F6"/>
              <circle cx="75" cy="75" r="40" fill="#E5E7EB"/>
            </svg>
          </div>
          <div className="category-name">{product.name}</div>
          <div className="category-type">{product.type}</div>
        </div>
      ))}
    </div>
  )
}