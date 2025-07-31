const contentful = require('contentful-management')

async function checkConstraintType() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  try {
    const constraintType = await environment.getContentType('constraint')
    console.log('Constraint content type fields:')
    constraintType.fields.forEach(field => {
      console.log(`- ${field.id}: ${field.type}`)
    })
  } catch (error) {
    console.log('Constraint type not found, creating it...')
    
    const constraintType = await environment.createContentTypeWithId('constraint', {
      name: 'Manufacturing Constraint',
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
          required: true
        },
        {
          id: 'image',
          name: 'Image',
          type: 'Link',
          linkType: 'Asset',
          required: false
        },
        {
          id: 'detailedContent',
          name: 'Detailed Content',
          type: 'RichText',
          required: false
        }
      ]
    })

    await constraintType.publish()
    console.log('Created constraint type')
  }
}

checkConstraintType().catch(console.error)