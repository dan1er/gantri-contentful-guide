require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function updateContentModel() {
  console.log('Updating content model...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Get the product category content type
  const productCategory = await environment.getContentType('productCategory')
  
  // Update the image field to not be required
  const imageField = productCategory.fields.find(f => f.id === 'image')
  if (imageField) {
    imageField.required = false
  }

  // Update the content type
  await productCategory.update()
  await productCategory.publish()
  
  console.log('Updated productCategory content type - image is now optional')
}

updateContentModel().catch(console.error)