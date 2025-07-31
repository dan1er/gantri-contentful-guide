const contentful = require('contentful-management')

async function createMilestoneSections() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Creating milestone sections for pages...')

  try {
    // Create milestone content type if it doesn't exist
    try {
      const milestoneType = await environment.createContentTypeWithId('milestone', {
        name: 'Milestone',
        displayField: 'title',
        fields: [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true
          },
          {
            id: 'description',
            name: 'Description',
            type: 'Text',
            required: false
          },
          {
            id: 'icon',
            name: 'Icon',
            type: 'Symbol',
            required: false
          },
          {
            id: 'order',
            name: 'Order',
            type: 'Integer',
            required: false
          }
        ]
      })
      await milestoneType.publish()
      console.log('✅ Created milestone content type')
    } catch (error) {
      console.log('ℹ️  Milestone type might already exist')
    }

    // Create milestones for getting started page
    const gettingStartedMilestones = [
      { title: 'Review Quick Start Guide', order: 1 },
      { title: 'Concept Ideation', order: 2 },
      { title: 'Concept Submission', order: 3 },
      { title: 'Product Development', description: 'Once your concept is approved, product development begins.', order: 4 }
    ]

    const createdMilestones = []
    for (const milestone of gettingStartedMilestones) {
      const entry = await environment.createEntry('milestone', {
        fields: {
          title: { 'en-US': milestone.title },
          description: { 'en-US': milestone.description || '' },
          icon: { 'en-US': milestone.order.toString() },
          order: { 'en-US': milestone.order }
        }
      })
      await entry.publish()
      createdMilestones.push(entry)
      console.log(`✅ Created milestone: ${milestone.title}`)
    }

    // Create section for getting started page
    const gettingStartedSection = await environment.createEntry('section', {
      fields: {
        title: { 'en-US': 'Key Milestones' },
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
                    value: 'Follow these steps to successfully launch your product with Gantri.',
                    marks: [],
                    data: {}
                  }
                ]
              }
            ]
          }
        },
        components: {
          'en-US': createdMilestones.map(m => ({
            sys: { type: 'Link', linkType: 'Entry', id: m.sys.id }
          }))
        },
        layout: { 'en-US': 'milestones' }
      }
    })
    await gettingStartedSection.publish()
    console.log('✅ Created getting started section')

    // Update the getting started page
    const pages = await environment.getEntries({
      content_type: 'page',
      'fields.slug': 'getting-started'
    })

    if (pages.items.length > 0) {
      const page = pages.items[0]
      page.fields.sections = {
        'en-US': [{
          sys: { type: 'Link', linkType: 'Entry', id: gettingStartedSection.sys.id }
        }]
      }
      
      await page.update()
      await page.publish()
      console.log('✅ Updated getting-started page with sections')
    }

    // Create simple text sections for other pages
    const simplePageSections = {
      'product-categories': {
        content: 'All categories can be designed to produce directed or ambient lighting, or a hybrid of the two.'
      },
      'pricing-considerations': {
        title: 'Understanding Pricing',
        content: 'Various factors influence the cost of manufacturing your product. Consider these key elements when designing to optimize for both quality and affordability.'
      },
      'concept-submission': {
        title: 'Submission Process', 
        content: 'After submission, our team will review your concept and provide feedback within 5-7 business days.'
      }
    }

    for (const [pageSlug, sectionData] of Object.entries(simplePageSections)) {
      const sectionFields = {
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

      if (sectionData.title) {
        sectionFields.title = { 'en-US': sectionData.title }
      }

      const section = await environment.createEntry('section', {
        fields: sectionFields
      })
      await section.publish()

      // Update the page
      const pages = await environment.getEntries({
        content_type: 'page',
        'fields.slug': pageSlug
      })

      if (pages.items.length > 0) {
        const page = pages.items[0]
        const existingSections = page.fields.sections?.['en-US'] || []
        page.fields.sections = {
          'en-US': [...existingSections, {
            sys: { type: 'Link', linkType: 'Entry', id: section.sys.id }
          }]
        }
        
        await page.update()
        await page.publish()
        console.log(`✅ Updated ${pageSlug} page with section`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  createMilestoneSections()
    .then(() => {
      console.log('✅ All milestone sections created successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}