import React from 'react'
import Image from 'next/image'

interface ContentfulImageProps {
  asset: any
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  style?: React.CSSProperties
}

export default function ContentfulImage({ 
  asset, 
  width = 800, 
  height = 600, 
  className = '',
  priority = false,
  fill = false,
  style
}: ContentfulImageProps) {
  if (!asset?.fields?.file?.url) {
    return (
      <div className={`image-placeholder ${className}`} style={{ width, height, ...style }}>
        <svg width="100%" height="100%" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="150" height="150" fill="#F3F4F6"/>
          <circle cx="75" cy="75" r="40" fill="#E5E7EB"/>
        </svg>
      </div>
    )
  }

  const imageUrl = `https:${asset.fields.file.url}`
  const imageAlt = asset.fields.title || asset.fields.description || 'Image'

  // Add format and quality parameters for optimization
  const optimizedUrl = `${imageUrl}?fm=webp&q=80${fill ? '' : `&w=${width}&h=${height}&fit=fill`}`

  if (fill) {
    return (
      <Image
        src={optimizedUrl}
        alt={imageAlt}
        fill
        className={className}
        priority={priority}
        style={style}
      />
    )
  }

  return (
    <Image
      src={optimizedUrl}
      alt={imageAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={style}
    />
  )
}