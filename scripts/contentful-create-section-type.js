const contentful = require('contentful-management')

async function createSectionType() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  try {
    // Create Section content type for organizing page content
    const sectionType = await environment.createContentTypeWithId('section', {
      name: 'Page Section',
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
          id: 'subtitle',
          name: 'Subtitle',
          type: 'Symbol',
          required: false,
          validations: []
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          required: false,
          validations: []
        },
        {
          id: 'components',
          name: 'Components',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: []
          },
          required: false,
          validations: []
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
          },
          required: false,
          validations: []
        },
        {
          id: 'layout',
          name: 'Layout',
          type: 'Symbol',
          required: false,
          validations: [
            {
              in: ['default', 'grid', 'cards', 'constraints-grid']
            }
          ]
        }
      ]
    })

    await sectionType.publish()
    console.log('✅ Section content type created successfully')

  } catch (error) {
    if (error.name === 'VersionMismatch') {
      console.log('ℹ️  Section content type already exists')
    } else {
      console.error('Error creating section content type:', error.message)
    }
  }
}

// Run the script
if (require.main === module) {
  createSectionType()
    .then(() => {
      console.log('✅ Section content type setup complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

module.exports = createSectionType