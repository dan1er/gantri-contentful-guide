require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function seedContent() {
  console.log('Seeding Contentful with sample content...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Create Milestones
  const milestones = [
    { stepNumber: 1, title: 'Review Quick Start Guide', description: '' },
    { stepNumber: 2, title: 'Concept Ideation', description: '' },
    { stepNumber: 3, title: 'Concept Submission', description: '' },
    { stepNumber: 4, title: 'Product Development', description: 'Once your concept is approved, product development begins.' }
  ]

  const createdMilestones = []
  for (const milestone of milestones) {
    const entry = await environment.createEntry('milestone', {
      fields: {
        stepNumber: { 'en-US': milestone.stepNumber },
        title: { 'en-US': milestone.title },
        description: { 'en-US': milestone.description }
      }
    })
    await entry.publish()
    createdMilestones.push(entry)
    console.log(`Created milestone: ${milestone.title}`)
  }

  // Create Quick Start Guide Section
  const gettingStartedSection = await environment.createEntry('quickStartGuideSection', {
    fields: {
      title: { 'en-US': 'Getting Started' },
      sectionNumber: { 'en-US': 1 },
      content: {
        'en-US': {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'This guide will walk you through key education regarding our product offering and manufacturing constraints.',
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            },
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Please read it carefully before getting started on your concept ideation',
                  marks: [{ type: 'italic' }],
                  data: {}
                },
                {
                  nodeType: 'text',
                  value: ' so that you submit a feasible design that accounts for our constraints.',
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            }
          ]
        }
      },
      keyMilestones: {
        'en-US': createdMilestones.map(m => ({
          sys: { type: 'Link', linkType: 'Entry', id: m.sys.id }
        }))
      }
    }
  })
  await gettingStartedSection.publish()
  console.log('Created Getting Started section')

  // Create Product Categories
  const categories = [
    { name: 'Table', type: 'Plug-in', order: 1 },
    { name: 'Wall Sconce', type: 'Plug-in and Hardwired', order: 2 },
    { name: 'Floor', type: 'Plug-in', order: 3 },
    { name: 'Clamp', type: 'Plug-in', order: 4 },
    { name: 'Pendant', type: 'Hardwired', order: 5 },
    { name: 'Flush Mount', type: 'Hardwired', order: 6 }
  ]

  for (const category of categories) {
    const entry = await environment.createEntry('productCategory', {
      fields: {
        name: { 'en-US': category.name },
        type: { 'en-US': category.type },
        order: { 'en-US': category.order }
      }
    })
    await entry.publish()
    console.log(`Created product category: ${category.name}`)
  }

  // Create Constraints
  const printSizeConstraint = await environment.createEntry('constraint', {
    fields: {
      title: { 'en-US': 'Print Size' },
      description: { 'en-US': 'The maximum size of any printed part must fit between a 250×250×250mm cube (9.8 × 9.8 × 9.8 inches)' },
      specifications: {
        'en-US': {
          maxWidth: 250,
          maxHeight: 250,
          maxDepth: 250,
          units: 'mm'
        }
      }
    }
  })
  await printSizeConstraint.publish()
  console.log('Created print size constraint')

  // Create Manufacturing Process
  const printingProcess = await environment.createEntry('manufacturingProcess', {
    fields: {
      stepName: { 'en-US': 'Printing Parts' },
      description: {
        'en-US': {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'All parts are 3D printed using our state-of-the-art printing technology. Parts must adhere to specific size and design constraints.',
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            }
          ]
        }
      },
      constraints: {
        'en-US': [
          {
            sys: { type: 'Link', linkType: 'Entry', id: printSizeConstraint.sys.id }
          }
        ]
      }
    }
  })
  await printingProcess.publish()
  console.log('Created printing process')

  console.log('Content seeding completed successfully!')
}

seedContent().catch(console.error)