require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function setupContentTypes() {
  console.log('Setting up Contentful content types...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Quick Start Guide Section Content Type
  const guideSection = await environment.createContentTypeWithId('quickStartGuideSection', {
    name: 'Quick Start Guide Section',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'sectionNumber',
        name: 'Section Number',
        type: 'Integer',
        required: true,
      },
      {
        id: 'content',
        name: 'Content',
        type: 'RichText',
        required: true,
      },
      {
        id: 'keyMilestones',
        name: 'Key Milestones',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['milestone']
            }
          ]
        }
      }
    ]
  })

  // Milestone Content Type
  const milestone = await environment.createContentTypeWithId('milestone', {
    name: 'Milestone',
    fields: [
      {
        id: 'stepNumber',
        name: 'Step Number',
        type: 'Integer',
        required: true,
      },
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
      }
    ]
  })

  // Product Category Content Type
  const productCategory = await environment.createContentTypeWithId('productCategory', {
    name: 'Product Category',
    fields: [
      {
        id: 'name',
        name: 'Name',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'type',
        name: 'Type',
        type: 'Symbol',
        required: true,
        validations: [
          {
            in: ['Plug-in', 'Plug-in and Hardwired', 'Hardwired']
          }
        ]
      },
      {
        id: 'image',
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
        required: true,
      },
      {
        id: 'order',
        name: 'Display Order',
        type: 'Integer',
        required: true,
      }
    ]
  })

  // Manufacturing Process Content Type
  const manufacturingProcess = await environment.createContentTypeWithId('manufacturingProcess', {
    name: 'Manufacturing Process',
    fields: [
      {
        id: 'stepName',
        name: 'Step Name',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'RichText',
        required: true,
      },
      {
        id: 'constraints',
        name: 'Constraints',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['constraint']
            }
          ]
        }
      }
    ]
  })

  // Constraint Content Type
  const constraint = await environment.createContentTypeWithId('constraint', {
    name: 'Constraint',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        required: true,
      },
      {
        id: 'image',
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
      },
      {
        id: 'specifications',
        name: 'Specifications',
        type: 'Object',
      }
    ]
  })

  // Publish content types
  await guideSection.publish()
  await milestone.publish()
  await productCategory.publish()
  await manufacturingProcess.publish()
  await constraint.publish()

  console.log('Content types created successfully!')
}

// Run this script with: node contentful-management.js
// Make sure to set CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID environment variables
setupContentTypes().catch(console.error)