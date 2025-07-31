const contentful = require('contentful-management')

async function organizeContentIntoFolders() {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  console.log('🔄 Organizing content into folders...')

  try {
    // Define content organization
    const folderStructure = {
      'Core': [
        'siteConfiguration',
        'constraint',
        'milestone',
        'section'
      ],
      'Pages': [
        'page'
      ],
      'Menu': [
        'navigationItem'
      ],
      'Components': [
        'panel',
        'productCategory',
        'manufacturingProcess'
      ]
    }

    // Get all content types to understand what we have
    const contentTypes = await environment.getContentTypes()
    console.log('\n📋 Available content types:')
    contentTypes.items.forEach(ct => {
      console.log(`  - ${ct.sys.id}: ${ct.name}`)
    })

    // Organize entries by content type into suggested folders
    console.log('\n📁 Suggested folder organization:')
    
    for (const [folderName, contentTypeIds] of Object.entries(folderStructure)) {
      console.log(`\n${folderName}/`)
      
      for (const contentTypeId of contentTypeIds) {
        try {
          const entries = await environment.getEntries({
            content_type: contentTypeId,
            limit: 1000
          })
          
          if (entries.items.length > 0) {
            console.log(`  ├── ${contentTypeId} (${entries.items.length} entries)`)
            
            // List first few entries
            entries.items.slice(0, 3).forEach(entry => {
              const title = entry.fields.title?.['en-US'] || 
                          entry.fields.name?.['en-US'] || 
                          entry.fields.label?.['en-US'] ||
                          entry.fields.siteName?.['en-US'] ||
                          'Untitled'
              console.log(`  │   └── ${title}`)
            })
            
            if (entries.items.length > 3) {
              console.log(`  │   └── ... and ${entries.items.length - 3} more`)
            }
          }
        } catch (error) {
          // Content type might not exist
        }
      }
    }

    console.log('\n💡 How to organize in Contentful:')
    console.log('1. Go to Content in Contentful')
    console.log('2. Create folders: Core, Pages, Menu, Components')
    console.log('3. Drag and drop entries into appropriate folders')
    console.log('4. Or use the "Move to folder" option in the entry actions menu')
    
    console.log('\n📊 Summary:')
    let totalEntries = 0
    for (const [folderName, contentTypeIds] of Object.entries(folderStructure)) {
      let folderTotal = 0
      for (const contentTypeId of contentTypeIds) {
        try {
          const entries = await environment.getEntries({
            content_type: contentTypeId,
            limit: 1000
          })
          folderTotal += entries.items.length
        } catch (error) {
          // Content type might not exist
        }
      }
      if (folderTotal > 0) {
        console.log(`${folderName}: ${folderTotal} entries`)
        totalEntries += folderTotal
      }
    }
    console.log(`Total entries to organize: ${totalEntries}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// Run the script
if (require.main === module) {
  organizeContentIntoFolders()
    .then(() => {
      console.log('\n✅ Folder organization analysis complete')
      console.log('Note: Folders need to be manually organized in the Contentful web interface')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}