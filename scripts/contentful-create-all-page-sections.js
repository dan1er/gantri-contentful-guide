const contentful = require('contentful-management')

async function createAllPageSections() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Creating sections for all pages...')

  const pageSections = {
    'getting-started': [
      {
        title: 'Key Milestones',
        content: 'Follow these steps to successfully launch your product with Gantri.',
        components: [], // Will create milestone components
        milestones: [
          { title: 'Review Quick Start Guide', description: '' },
          { title: 'Concept Ideation', description: '' },
          { title: 'Concept Submission', description: '' },
          { title: 'Product Development', description: 'Once your concept is approved, product development begins.' }
        ]
      }
    ],
    'product-categories': [
      {
        content: 'All categories can be designed to produce directed or ambient lighting, or a hybrid of the two.',
        layout: 'default'
      }
    ],
    'pricing-considerations': [
      {
        title: 'Key Pricing Factors',
        content: 'Understanding these factors will help you design cost-effective products.',
        milestones: [
          { 
            title: 'Material Usage', 
            description: 'The amount of material used directly impacts cost. Optimize your design to minimize material while maintaining structural integrity.',
            icon: '💰'
          },
          { 
            title: 'Print Time', 
            description: 'Complex geometries and larger parts require longer print times, increasing production costs.',
            icon: '⏱'
          },
          { 
            title: 'Assembly Complexity', 
            description: 'Designs requiring multiple parts or complex assembly processes will have higher labor costs.',
            icon: '🔧'
          },
          { 
            title: 'Finishing Requirements', 
            description: 'Parts requiring painting, sanding, or special finishes add to the overall cost.',
            icon: '🎨'
          }
        ]
      }
    ],
    'concept-submission': [
      {
        title: 'Submission Requirements',
        content: 'Ensure your submission includes all required elements for a smooth review process.',
        milestones: [
          { 
            title: '3D Model Files', 
            description: 'Submit your design in STL or OBJ format. Ensure all parts are properly oriented and scaled.',
            icon: '📐'
          },
          { 
            title: 'Design Documentation', 
            description: 'Include assembly instructions, material specifications, and any special finishing requirements.',
            icon: '📄'
          },
          { 
            title: 'Concept Statement', 
            description: 'Provide a brief description of your design inspiration and target market.',
            icon: '💭'
          },
          { 
            title: 'Technical Drawings', 
            description: 'Include dimensioned drawings showing key measurements and assembly details.',
            icon: '📏'
          }
        ]
      },
      {
        content: 'After submission, our team will review your concept and provide feedback within 5-7 business days.',
        layout: 'default'
      }
    ]
  }

  try {
    // Create milestone components first
    const milestoneComponents = {}
    
    for (const [pageSlug, sections] of Object.entries(pageSections)) {
      for (const sectionData of sections) {
        if (sectionData.milestones) {
          const milestones = []
          for (const milestone of sectionData.milestones) {
            // Create a panel for each milestone
            const milestonePanel = await environment.createEntry('panel', {
              fields: {
                title: { 'en-US': milestone.title },
                content: { 'en-US': milestone.description },
                icon: { 'en-US': milestone.icon || (sectionData.milestones.indexOf(milestone) + 1).toString() }
              }
            })
            await milestonePanel.publish()
            milestones.push(milestonePanel)
          }
          milestoneComponents[`${pageSlug}-${sections.indexOf(sectionData)}`] = milestones
        }
      }
    }

    // Create sections for each page
    for (const [pageSlug, sections] of Object.entries(pageSections)) {
      const createdSections = []
      
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i]
        const sectionFields = {
          title: sectionData.title ? { 'en-US': sectionData.title } : undefined,
          content: sectionData.content ? { 
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
          } : undefined,
          layout: { 'en-US': sectionData.layout || 'default' }
        }

        // Add milestone components if they exist
        const milestoneKey = `${pageSlug}-${i}`
        if (milestoneComponents[milestoneKey]) {
          sectionFields.components = {
            'en-US': milestoneComponents[milestoneKey].map(m => ({
              sys: { type: 'Link', linkType: 'Entry', id: m.sys.id }
            }))
          }
        }

        // Remove undefined fields
        Object.keys(sectionFields).forEach(key => 
          sectionFields[key] === undefined && delete sectionFields[key]
        )

        const section = await environment.createEntry('section', {
          fields: sectionFields
        })
        await section.publish()
        createdSections.push(section)
        console.log(`✅ Created section for ${pageSlug}: ${sectionData.title || 'Content section'}`)
      }

      // Update the page with sections
      const pages = await environment.getEntries({
        content_type: 'page',
        'fields.slug': pageSlug
      })

      if (pages.items.length > 0) {
        const page = pages.items[0]
        page.fields.sections = {
          'en-US': createdSections.map(s => ({
            sys: { type: 'Link', linkType: 'Entry', id: s.sys.id }
          }))
        }
        
        await page.update()
        await page.publish()
        console.log(`✅ Updated ${pageSlug} page with sections`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  createAllPageSections()
    .then(() => {
      console.log('✅ All page sections created successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}