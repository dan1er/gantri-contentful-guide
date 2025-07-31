const contentful = require('contentful-management')

async function createConstraints() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Define all constraints
  const constraints = [
    {
      title: 'PRINT SIZE',
      description: 'Maximum 250×250×250mm cube (9.8 × 9.8 × 9.8 inches)\n\nParts must fit within our printer\'s build volume. Design your parts to fit within these dimensions for successful printing.',
      specifications: {
        details: [
          'Maximum width: 250mm (9.8")',
          'Maximum depth: 250mm (9.8")', 
          'Maximum height: 250mm (9.8")',
          'Larger designs must be split into multiple parts'
        ]
      }
    },
    {
      title: 'PART SURFACE',
      description: 'Parts must include a flat surface\n\nEvery part needs at least one flat surface to adhere to the print bed. This ensures stable printing and prevents warping. The flat surface should be at least 20mm × 20mm for optimal adhesion.',
      specifications: {
        details: [
          'Minimum flat surface: 20mm × 20mm',
          'Surface must be on the bottom of the part',
          'Avoid completely rounded or spherical designs',
          'Consider adding a small flat base if needed'
        ]
      }
    },
    {
      title: 'OVERHANGS',
      description: 'Parts may overhang up to 35 degrees\n\nOverhangs greater than 35 degrees from vertical require support structures. Design your parts with this limitation in mind to minimize post-processing and ensure clean prints.',
      specifications: {
        details: [
          'Maximum unsupported overhang: 35°',
          'Angles measured from vertical axis',
          'Gradual slopes preferred over sharp angles',
          'Support structures automatically added for steeper angles'
        ]
      }
    },
    {
      title: 'DIFFUSER GEOMETRY',
      description: 'R < 100mm requirement for glass-like diffusers\n\nFor optimal light diffusion in translucent materials, maintain a radius of curvature less than 100mm. This ensures even light distribution and prevents hot spots.',
      specifications: {
        details: [
          'Maximum radius: 100mm for diffusers',
          'Applies to translucent materials only',
          'Smaller radii provide better light diffusion',
          'Consider multiple smaller curves over single large curves'
        ]
      }
    },
    {
      title: 'WALL THICKNESS',
      description: 'Minimum 2.4mm for standard walls\n\nWall thickness affects part strength and print quality. Standard walls should be at least 2.4mm thick, while load-bearing or structural elements require 5mm minimum thickness.',
      specifications: {
        details: [
          'Standard walls: ≥ 2.4mm',
          'Structural walls: ≥ 5mm',
          'Consistent thickness prevents warping',
          'Thicker walls increase print time and cost'
        ]
      }
    }
  ]

  console.log('🔄 Creating constraint entries...')

  for (const constraintData of constraints) {
    try {
      // Check if constraint already exists
      const existingEntries = await environment.getEntries({
        content_type: 'constraint',
        'fields.title': constraintData.title
      })

      let constraint
      if (existingEntries.items.length > 0) {
        // Update existing
        constraint = existingEntries.items[0]
        constraint.fields.title = { 'en-US': constraintData.title }
        constraint.fields.description = { 'en-US': constraintData.description }
        constraint.fields.specifications = { 'en-US': constraintData.specifications }
        constraint = await constraint.update()
        console.log(`📝 Updated constraint: ${constraintData.title}`)
      } else {
        // Create new
        constraint = await environment.createEntry('constraint', {
          fields: {
            title: { 'en-US': constraintData.title },
            description: { 'en-US': constraintData.description },
            specifications: { 'en-US': constraintData.specifications }
          }
        })
        console.log(`✅ Created constraint: ${constraintData.title}`)
      }

      // Publish the entry
      await constraint.publish()
    } catch (error) {
      console.error(`❌ Error creating constraint ${constraintData.title}:`, error.message)
    }
  }

  // Get the manufacturing page and all constraints
  try {
    const pages = await environment.getEntries({
      content_type: 'page',
      'fields.slug': 'how-we-manufacture'
    })

    const constraintEntries = await environment.getEntries({
      content_type: 'constraint'
    })

    console.log(`Found ${constraintEntries.items.length} constraints`)

    if (pages.items.length > 0) {
      const manufacturingPage = pages.items[0]
      
      // Create a panel component that references all constraints
      const panelEntry = await environment.createEntry('panel', {
        fields: {
          title: { 'en-US': 'Manufacturing Constraints' },
          content: { 'en-US': 'Click on any constraint below to learn more about our manufacturing requirements.' },
          constraints: {
            'en-US': constraintEntries.items.map(c => ({
              sys: { type: 'Link', linkType: 'Entry', id: c.sys.id }
            }))
          }
        }
      })
      
      await panelEntry.publish()
      console.log('✅ Created constraint panel')

      // Add the panel to the manufacturing page components
      const currentComponents = manufacturingPage.fields.components?.['en-US'] || []
      manufacturingPage.fields.components = {
        'en-US': [...currentComponents, {
          sys: { type: 'Link', linkType: 'Entry', id: panelEntry.sys.id }
        }]
      }

      await manufacturingPage.update()
      await manufacturingPage.publish()
      console.log('✅ Updated manufacturing page with constraint panel')
    }
  } catch (error) {
    console.error('❌ Error updating manufacturing page:', error.message)
  }
}

// Run the script
if (require.main === module) {
  createConstraints()
    .then(() => {
      console.log('✅ All constraints created successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

module.exports = createConstraints