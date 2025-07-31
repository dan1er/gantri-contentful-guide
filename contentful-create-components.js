require('dotenv').config({ path: '.env.local' })
const contentfulManagement = require('contentful-management')

async function createComponentContentTypes() {
  console.log('Creating component-based content types...')
  
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  const environment = await space.getEnvironment('master')

  try {
    // 1. Panel Component Content Type
    const panelComponent = await environment.createContentTypeWithId('panelComponent', {
      name: 'Panel Component',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          required: false,
        },
        {
          id: 'items',
          name: 'Items',
          type: 'Array',
          required: false,
          items: {
            type: 'Symbol'
          }
        },
        {
          id: 'hasModal',
          name: 'Has Modal',
          type: 'Boolean',
          required: false,
        },
        {
          id: 'modalContent',
          name: 'Modal Content',
          type: 'Link',
          linkType: 'Entry',
          required: false,
          validations: [
            {
              linkContentType: ['modalComponent']
            }
          ]
        },
        {
          id: 'backgroundImage',
          name: 'Background Image',
          type: 'Link',
          linkType: 'Asset',
          required: false,
        }
      ]
    })
    await panelComponent.publish()
    console.log('Created Panel Component content type')
  } catch (e) {
    console.log('Panel Component already exists')
  }

  try {
    // 2. Modal Component Content Type
    const modalComponent = await environment.createContentTypeWithId('modalComponent', {
      name: 'Modal Component',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          required: false,
        },
        {
          id: 'images',
          name: 'Images',
          type: 'Array',
          required: false,
          items: {
            type: 'Link',
            linkType: 'Asset'
          }
        },
        {
          id: 'data',
          name: 'Data',
          type: 'Object',
          required: false,
        }
      ]
    })
    await modalComponent.publish()
    console.log('Created Modal Component content type')
  } catch (e) {
    console.log('Modal Component already exists')
  }

  try {
    // 3. Navigation Item Content Type
    const navigationItem = await environment.createContentTypeWithId('navigationItem', {
      name: 'Navigation Item',
      displayField: 'label',
      fields: [
        {
          id: 'label',
          name: 'Label',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'order',
          name: 'Order',
          type: 'Integer',
          required: true,
        },
        {
          id: 'page',
          name: 'Page',
          type: 'Link',
          linkType: 'Entry',
          required: true,
          validations: [
            {
              linkContentType: ['page']
            }
          ]
        },
        {
          id: 'isActive',
          name: 'Is Active',
          type: 'Boolean',
          required: false,
        }
      ]
    })
    await navigationItem.publish()
    console.log('Created Navigation Item content type')
  } catch (e) {
    console.log('Navigation Item already exists')
  }

  try {
    // 4. Page Content Type
    const page = await environment.createContentTypeWithId('page', {
      name: 'Page',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          required: true,
          validations: [
            {
              unique: true
            },
            {
              regexp: {
                pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
              }
            }
          ]
        },
        {
          id: 'sectionNumber',
          name: 'Section Number',
          type: 'Integer',
          required: false,
        },
        {
          id: 'content',
          name: 'Content',
          type: 'RichText',
          required: false,
        },
        {
          id: 'components',
          name: 'Components',
          type: 'Array',
          required: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['panelComponent', 'productCategory', 'milestone', 'constraint']
              }
            ]
          }
        },
        {
          id: 'navigationButtons',
          name: 'Navigation Buttons',
          type: 'Object',
          required: false,
        }
      ]
    })
    await page.publish()
    console.log('Created Page content type')
  } catch (e) {
    console.log('Page already exists')
  }

  try {
    // 5. Site Configuration Content Type
    const siteConfig = await environment.createContentTypeWithId('siteConfiguration', {
      name: 'Site Configuration',
      displayField: 'siteName',
      fields: [
        {
          id: 'siteName',
          name: 'Site Name',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'logo',
          name: 'Logo',
          type: 'Link',
          linkType: 'Asset',
          required: false,
        },
        {
          id: 'logoSvg',
          name: 'Logo SVG',
          type: 'Text',
          required: false,
        },
        {
          id: 'headerTitle',
          name: 'Header Title',
          type: 'Symbol',
          required: false,
        },
        {
          id: 'guideTitle',
          name: 'Guide Title',
          type: 'Symbol',
          required: false,
        },
        {
          id: 'navigation',
          name: 'Navigation',
          type: 'Array',
          required: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['navigationItem']
              }
            ]
          }
        }
      ]
    })
    await siteConfig.publish()
    console.log('Created Site Configuration content type')
  } catch (e) {
    console.log('Site Configuration already exists')
  }

  console.log('Component content types created successfully!')
}

createComponentContentTypes().catch(console.error)