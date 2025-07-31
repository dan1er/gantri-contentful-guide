require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')
const fs = require('fs')
const path = require('path')

async function uploadImages() {
  console.log('Uploading images to Contentful...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  // Example: Upload product images
  const productImages = [
    { name: 'Table Lamp', fileName: 'table-lamp.jpg', description: 'Modern table lamp design' },
    { name: 'Wall Sconce', fileName: 'wall-sconce.jpg', description: 'Minimalist wall sconce' },
    { name: 'Floor Lamp', fileName: 'floor-lamp.jpg', description: 'Elegant floor lamp' },
    { name: 'Clamp Light', fileName: 'clamp-light.jpg', description: 'Versatile clamp light' },
    { name: 'Pendant Light', fileName: 'pendant-light.jpg', description: 'Contemporary pendant light' },
    { name: 'Flush Mount', fileName: 'flush-mount.jpg', description: 'Modern flush mount fixture' }
  ]

  const uploadedAssets = []

  for (const image of productImages) {
    try {
      // Create asset
      const asset = await environment.createAsset({
        fields: {
          title: {
            'en-US': image.name
          },
          description: {
            'en-US': image.description
          },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: image.fileName,
              // For demo, using placeholder URL - replace with actual image URLs
              upload: `https://images.unsplash.com/photo-1565636192607-a9fb${Math.random().toString(36).substring(7)}?w=800&h=800&fit=crop`
            }
          }
        }
      })

      // Process asset
      await asset.processForAllLocales()
      
      // Wait for processing
      let processedAsset = await environment.getAsset(asset.sys.id)
      while (!processedAsset.fields.file['en-US'].url) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        processedAsset = await environment.getAsset(asset.sys.id)
      }

      // Publish asset
      await processedAsset.publish()
      uploadedAssets.push(processedAsset)
      
      console.log(`Uploaded and published: ${image.name}`)
    } catch (error) {
      console.error(`Error uploading ${image.name}:`, error.message)
    }
  }

  // Update product categories with images
  try {
    const categories = await environment.getEntries({
      content_type: 'productCategory'
    })

    for (let i = 0; i < categories.items.length && i < uploadedAssets.length; i++) {
      const category = categories.items[i]
      if (!category.fields.image) {
        category.fields.image = {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: uploadedAssets[i].sys.id
            }
          }
        }
        await category.update()
        await category.publish()
        console.log(`Updated ${category.fields.name['en-US']} with image`)
      }
    }
  } catch (error) {
    console.error('Error updating categories:', error)
  }

  console.log('Image upload complete!')
}

// Helper function to upload local images
async function uploadLocalImage(environment, filePath, title, description) {
  const fileContent = fs.readFileSync(filePath)
  const fileName = path.basename(filePath)
  const contentType = `image/${path.extname(filePath).slice(1)}`

  // Create upload
  const upload = await environment.createUpload({
    file: fileContent
  })

  // Create asset
  const asset = await environment.createAsset({
    fields: {
      title: { 'en-US': title },
      description: { 'en-US': description },
      file: {
        'en-US': {
          contentType: contentType,
          fileName: fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id
            }
          }
        }
      }
    }
  })

  // Process and publish
  await asset.processForAllLocales()
  
  // Wait for processing
  let processedAsset = await environment.getAsset(asset.sys.id)
  let attempts = 0
  while ((!processedAsset.fields.file['en-US'].url) && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processedAsset = await environment.getAsset(asset.sys.id)
    attempts++
  }

  await processedAsset.publish()
  return processedAsset
}

uploadImages().catch(console.error)