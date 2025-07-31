const contentful = require('contentful-management')

async function createConstraintContentType() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Create Constraint content type
  try {
    const constraintType = await environment.createContentTypeWithId('constraint', {
      name: 'Manufacturing Constraint',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          validations: []
        },
        {
          id: 'shortDescription',
          name: 'Short Description',
          type: 'Symbol',
          required: true,
          validations: [{ size: { max: 150 } }]
        },
        {
          id: 'detailedDescription',
          name: 'Detailed Description',
          type: 'Text',
          required: true,
          validations: []
        },
        {
          id: 'cardImage',
          name: 'Card Image',
          type: 'Link',
          linkType: 'Asset',
          required: false,
          validations: []
        },
        {
          id: 'modalImages',
          name: 'Modal Images',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Asset'
          },
          required: false,
          validations: []
        },
        {
          id: 'acceptableExample',
          name: 'Acceptable Example',
          type: 'Object',
          required: false,
          validations: []
        },
        {
          id: 'unacceptableExample',
          name: 'Unacceptable Example',
          type: 'Object',
          required: false,
          validations: []
        },
        {
          id: 'specifications',
          name: 'Technical Specifications',
          type: 'Array',
          items: {
            type: 'Symbol'
          },
          required: false,
          validations: []
        },
        {
          id: 'order',
          name: 'Display Order',
          type: 'Integer',
          required: true,
          validations: []
        }
      ]
    })

    await constraintType.publish()
    console.log('✅ Constraint content type created successfully')

  } catch (error) {
    if (error.name === 'VersionMismatch') {
      console.log('ℹ️  Constraint content type already exists')
    } else {
      console.error('Error creating constraint content type:', error)
    }
  }
}

// Run the script
if (require.main === module) {
  createConstraintContentType()
    .then(() => {
      console.log('✅ Constraint content type setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

module.exports = createConstraintContentType