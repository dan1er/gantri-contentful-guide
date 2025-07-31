require('dotenv').config({ path: '.env.local' })
const contentful = require('contentful')

async function checkContent() {
  console.log('Checking Contentful content...')
  
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  try {
    // Check Quick Start Guide Sections
    const sections = await client.getEntries({
      content_type: 'quickStartGuideSection'
    })
    console.log(`Found ${sections.items.length} Quick Start Guide sections`)

    // Check Product Categories
    const categories = await client.getEntries({
      content_type: 'productCategory'
    })
    console.log(`Found ${categories.items.length} Product Categories`)

    // Check Milestones
    const milestones = await client.getEntries({
      content_type: 'milestone'
    })
    console.log(`Found ${milestones.items.length} Milestones`)

    // Check Manufacturing Processes
    const processes = await client.getEntries({
      content_type: 'manufacturingProcess'
    })
    console.log(`Found ${processes.items.length} Manufacturing Processes`)

    // Check Constraints
    const constraints = await client.getEntries({
      content_type: 'constraint'
    })
    console.log(`Found ${constraints.items.length} Constraints`)

  } catch (error) {
    console.error('Error checking content:', error.message)
  }
}

checkContent()