require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function updateNavigationWithSubItems() {
  console.log('Updating navigation content model to support sub-items...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  try {
    // Update Navigation Item content type to add sub-items
    const navigationItem = await environment.getContentType('navigationItem')
    
    // Add subItems field if it doesn't exist
    const hasSubItems = navigationItem.fields.some(f => f.id === 'subItems')
    
    if (!hasSubItems) {
      navigationItem.fields.push({
        id: 'subItems',
        name: 'Sub Items',
        type: 'Array',
        required: false,
        items: {
          type: 'Symbol'
        }
      })
      
      await navigationItem.update()
      await navigationItem.publish()
      console.log('Updated navigationItem content type with subItems field')
    }

    // Update the "How We Manufacture" navigation item
    const navItems = await environment.getEntries({
      content_type: 'navigationItem',
      'fields.label': 'How We Manufacture'
    })

    if (navItems.items.length > 0) {
      const manufacturingNav = navItems.items[0]
      manufacturingNav.fields.subItems = {
        'en-US': [
          'Printing Parts',
          'Painting Parts',
          'Assembling the Product',
          'Quality Control',
          'Packing and Shipping'
        ]
      }
      
      await manufacturingNav.update()
      await manufacturingNav.publish()
      console.log('Updated How We Manufacture navigation with sub-items')
    }

  } catch (error) {
    console.error('Error updating navigation:', error)
  }
}

updateNavigationWithSubItems()