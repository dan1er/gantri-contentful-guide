const contentful = require('contentful-management')

async function createManufacturingSections() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Creating manufacturing page sections...')

  try {
    // First, update page content type to include sections
    try {
      const pageType = await environment.getContentType('page')
      const hasSectionsField = pageType.fields.some(f => f.id === 'sections')
      
      if (!hasSectionsField) {
        pageType.fields.push({
          id: 'sections',
          name: 'Page Sections',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['section']
              }
            ]
          },
          required: false,
          validations: []
        })
        
        await pageType.update()
        await pageType.publish()
        console.log('✅ Added sections field to page content type')
      }
    } catch (error) {
      console.log('ℹ️  Sections field might already exist on page type')
    }

    // Get all constraints
    const constraintEntries = await environment.getEntries({
      content_type: 'constraint'
    })

    // Create Printing Parts section
    const printingSection = await environment.createEntry('section', {
      fields: {
        title: { 'en-US': 'Printing Parts' },
        subtitle: { 'en-US': 'Manufacturing Constraints' },
        content: { 
          'en-US': {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value: 'Click on any constraint below to learn more about our manufacturing requirements.',
                    marks: [],
                    data: {}
                  }
                ]
              }
            ]
          }
        },
        constraints: {
          'en-US': constraintEntries.items.map(c => ({
            sys: { type: 'Link', linkType: 'Entry', id: c.sys.id }
          }))
        },
        layout: { 'en-US': 'constraints-grid' }
      }
    })
    await printingSection.publish()
    console.log('✅ Created Printing Parts section')

    // Create other manufacturing sections  
    const sections = [
      {
        title: 'Painting Parts',
        content: 'Our painting process ensures a high-quality finish for all products. We use eco-friendly paints and advanced techniques to achieve consistent color and durability.'
      },
      {
        title: 'Assembling the Product',
        content: 'Assembly is performed by skilled technicians following strict quality guidelines. Each product is carefully assembled to ensure proper fit and function.'
      },
      {
        title: 'Quality Control',
        content: 'Every product undergoes rigorous quality control checks at multiple stages of production. We ensure that only products meeting our high standards reach our customers.'
      },
      {
        title: 'Packing and Shipping',
        content: 'Products are carefully packed using sustainable materials to ensure safe delivery. We work with reliable shipping partners to deliver your products on time.'
      }
    ]

    const createdSections = [printingSection]

    for (const sectionData of sections) {
      const section = await environment.createEntry('section', {
        fields: {
          title: { 'en-US': sectionData.title },
          content: { 
            'en-US': {
              nodeType: 'document',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: sectionData.content,
                      marks: [],
                      data: {}
                    }
                  ]
                }
              ]
            }
          },
          layout: { 'en-US': 'default' }
        }
      })
      await section.publish()
      createdSections.push(section)
      console.log(`✅ Created ${sectionData.title} section`)
    }

    // Update the manufacturing page to use sections
    const pages = await environment.getEntries({
      content_type: 'page',
      'fields.slug': 'how-we-manufacture'
    })

    if (pages.items.length > 0) {
      const manufacturingPage = pages.items[0]
      
      // Update the page to reference sections
      manufacturingPage.fields.sections = {
        'en-US': createdSections.map(s => ({
          sys: { type: 'Link', linkType: 'Entry', id: s.sys.id }
        }))
      }

      await manufacturingPage.update()
      await manufacturingPage.publish()
      console.log('✅ Updated manufacturing page with sections')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  createManufacturingSections()
    .then(() => {
      console.log('✅ Manufacturing sections setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}