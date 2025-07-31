import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Options } from '@contentful/rich-text-react-renderer'
import ContentfulImage from '../components/ContentfulImage'
import Link from 'next/link'

export const richTextOptions: Options = {
  renderNode: {
    // Handle embedded images in rich text
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title, description } = node.data.target.fields
      
      if (file?.contentType?.includes('image')) {
        return (
          <div className="rich-text-image">
            <ContentfulImage
              asset={node.data.target}
              width={800}
              height={450}
              className="rich-text-img"
            />
            {(title || description) && (
              <p className="rich-text-image-caption">
                {title || description}
              </p>
            )}
          </div>
        )
      }
      
      // Handle other asset types (PDFs, etc.)
      return (
        <div className="rich-text-asset">
          <a href={`https:${file.url}`} download>
            📎 {title || file.fileName}
          </a>
        </div>
      )
    },
    
    // Handle embedded entries (like components)
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const contentType = node.data.target.sys.contentType?.sys.id
      
      switch (contentType) {
        case 'panelComponent':
          // Render panel inline in rich text
          return <div className="embedded-panel">Embedded Panel: {node.data.target.fields.title}</div>
        
        default:
          return <div>Embedded content</div>
      }
    },
    
    // Custom heading styles
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="rich-text-h1">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="rich-text-h2">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="rich-text-h3">{children}</h3>
    ),
    
    // Custom paragraph styles
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="rich-text-paragraph">{children}</p>
    ),
    
    // Custom list styles
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="rich-text-list">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="rich-text-list-ordered">{children}</ol>
    ),
    
    // Handle hyperlinks
    [INLINES.HYPERLINK]: (node, children) => {
      const url = node.data.uri
      
      // Internal links
      if (url.startsWith('/')) {
        return (
          <Link href={url} className="rich-text-link">
            {children}
          </Link>
        )
      }
      
      // External links
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="rich-text-link-external"
        >
          {children} ↗
        </a>
      )
    },
  },
  
  // Custom mark renderers
  renderMark: {
    bold: (text) => <strong className="rich-text-bold">{text}</strong>,
    italic: (text) => <em className="rich-text-italic">{text}</em>,
    underline: (text) => <u className="rich-text-underline">{text}</u>,
    code: (text) => <code className="rich-text-code">{text}</code>,
  },
}