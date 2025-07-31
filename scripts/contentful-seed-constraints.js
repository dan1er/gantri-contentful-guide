const contentful = require('contentful-management')

async function seedConstraints() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Define all constraints
  const constraints = [
    {
      title: 'PRINT SIZE',
      shortDescription: 'Maximum 250×250×250mm cube (9.8 × 9.8 × 9.8 inches)',
      detailedDescription: 'Parts must fit within our printer\'s build volume. The maximum print size is a 250×250×250mm cube (9.8 × 9.8 × 9.8 inches). Design your parts to fit within these dimensions for successful printing.',
      specifications: [
        'Maximum width: 250mm (9.8")',
        'Maximum depth: 250mm (9.8")', 
        'Maximum height: 250mm (9.8")',
        'Larger designs must be split into multiple parts'
      ],
      order: 1
    },
    {
      title: 'PART SURFACE',
      shortDescription: 'Parts must include a flat surface',
      detailedDescription: 'Every part needs at least one flat surface to adhere to the print bed. This ensures stable printing and prevents warping. The flat surface should be at least 20mm × 20mm for optimal adhesion.',
      specifications: [
        'Minimum flat surface: 20mm × 20mm',
        'Surface must be on the bottom of the part',
        'Avoid completely rounded or spherical designs',
        'Consider adding a small flat base if needed'
      ],
      order: 2
    },
    {
      title: 'OVERHANGS',
      shortDescription: 'Parts may overhang up to 35 degrees',
      detailedDescription: 'Overhangs greater than 35 degrees from vertical require support structures. Design your parts with this limitation in mind to minimize post-processing and ensure clean prints.',
      specifications: [
        'Maximum unsupported overhang: 35°',
        'Angles measured from vertical axis',
        'Gradual slopes preferred over sharp angles',
        'Support structures automatically added for steeper angles'
      ],
      order: 3
    },
    {
      title: 'DIFFUSER GEOMETRY',
      shortDescription: 'R < 100mm requirement for glass-like diffusers',
      detailedDescription: 'For optimal light diffusion in translucent materials, maintain a radius of curvature less than 100mm. This ensures even light distribution and prevents hot spots.',
      specifications: [
        'Maximum radius: 100mm for diffusers',
        'Applies to translucent materials only',
        'Smaller radii provide better light diffusion',
        'Consider multiple smaller curves over single large curves'
      ],
      order: 4
    },
    {
      title: 'WALL THICKNESS',
      shortDescription: 'Minimum 2.4mm for standard walls',
      detailedDescription: 'Wall thickness affects part strength and print quality. Standard walls should be at least 2.4mm thick, while load-bearing or structural elements require 5mm minimum thickness.',
      specifications: [
        'Standard walls: ≥ 2.4mm',
        'Structural walls: ≥ 5mm',
        'Consistent thickness prevents warping',
        'Thicker walls increase print time and cost'
      ],
      order: 5
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
        Object.keys(constraintData).forEach(key => {
          constraint.fields[key] = { 'en-US': constraintData[key] }
        })
        constraint = await constraint.update()
        console.log(`📝 Updated constraint: ${constraintData.title}`)
      } else {
        // Create new
        constraint = await environment.createEntry('constraint', {
          fields: Object.keys(constraintData).reduce((fields, key) => {
            fields[key] = { 'en-US': constraintData[key] }
            return fields
          }, {})
        })
        console.log(`✅ Created constraint: ${constraintData.title}`)
      }

      // Publish the entry
      await constraint.publish()
    } catch (error) {
      console.error(`❌ Error creating constraint ${constraintData.title}:`, error.message)
    }
  }

  // Update the manufacturing page to include constraints
  try {
    const pages = await environment.getEntries({
      content_type: 'page',
      'fields.slug': 'how-we-manufacture'
    })

    if (pages.items.length > 0) {
      const manufacturingPage = pages.items[0]
      
      // Get all constraints
      const constraintEntries = await environment.getEntries({
        content_type: 'constraint',
        order: 'fields.order'
      })

      // Update the page to reference constraints
      manufacturingPage.fields.constraints = {
        'en-US': constraintEntries.items.map(c => ({
          sys: { type: 'Link', linkType: 'Entry', id: c.sys.id }
        }))
      }

      await manufacturingPage.update()
      await manufacturingPage.publish()
      console.log('✅ Updated manufacturing page with constraints')
    }
  } catch (error) {
    console.error('❌ Error updating manufacturing page:', error.message)
  }
}

// Run the script
if (require.main === module) {
  seedConstraints()
    .then(() => {
      console.log('✅ All constraints seeded successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

module.exports = seedConstraints